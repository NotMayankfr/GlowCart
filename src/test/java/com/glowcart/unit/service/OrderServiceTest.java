package com.glowcart.unit.service;

import com.glowcart.dto.request.PlaceOrderRequest;
import com.glowcart.dto.response.OrderResponse;
import com.glowcart.entity.*;
import com.glowcart.exception.InsufficientStockException;
import com.glowcart.exception.InvalidOrderStateException;
import com.glowcart.repository.CartRepository;
import com.glowcart.repository.OrderRepository;
import com.glowcart.repository.ProductRepository;
import com.glowcart.repository.UserRepository;
import com.glowcart.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CacheManager cacheManager;

    @Mock
    private Cache cache;

    @InjectMocks
    private OrderService orderService;

    private User testUser;
    private Product testProduct;
    private Cart testCart;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("buyer@example.com")
                .fullName("Beauty Buyer")
                .role(Role.CUSTOMER)
                .build();

        testProduct = Product.builder()
                .id(100L)
                .name("Hydrating Serum")
                .slug("hydrating-serum")
                .price(BigDecimal.valueOf(25.00))
                .stockQuantity(10)
                .version(0L)
                .active(true)
                .build();

        CartItem cartItem = CartItem.builder()
                .id(10L)
                .product(testProduct)
                .quantity(2)
                .build();

        testCart = Cart.builder()
                .id(5L)
                .user(testUser)
                .items(new ArrayList<>(List.of(cartItem)))
                .build();
    }

    @Test
    @DisplayName("Place order succeeds and reserves stock")
    void placeOrder_success() {
        when(orderRepository.findByIdempotencyKey("key-123")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("buyer@example.com")).thenReturn(Optional.of(testUser));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(testCart));
        when(productRepository.findById(100L)).thenReturn(Optional.of(testProduct));
        when(cacheManager.getCache(anyString())).thenReturn(cache);

        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order o = invocation.getArgument(0);
            o.setId(999L);
            return o;
        });

        PlaceOrderRequest request = new PlaceOrderRequest();
        request.setShippingAddress("123 Beauty Lane");

        OrderResponse response = orderService.placeOrder("buyer@example.com", "key-123", request);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(999L);
        assertThat(response.getStatus()).isEqualTo(OrderStatus.CREATED);
        assertThat(response.getTotalAmount()).isEqualByComparingTo(BigDecimal.valueOf(50.00));
        assertThat(testProduct.getStockQuantity()).isEqualTo(8);
        assertThat(testCart.getItems()).isEmpty();

        verify(orderRepository).save(any(Order.class));
        verify(productRepository).save(testProduct);
    }

    @Test
    @DisplayName("Place order is idempotent: Returns existing order if key is reused")
    void placeOrder_idempotent() {
        Order existing = Order.builder()
                .id(888L)
                .user(testUser)
                .idempotencyKey("dup-key")
                .status(OrderStatus.CREATED)
                .totalAmount(BigDecimal.valueOf(50.00))
                .items(new ArrayList<>())
                .build();

        when(orderRepository.findByIdempotencyKey("dup-key")).thenReturn(Optional.of(existing));

        PlaceOrderRequest request = new PlaceOrderRequest();
        request.setShippingAddress("123 Beauty Lane");

        OrderResponse response = orderService.placeOrder("buyer@example.com", "dup-key", request);

        assertThat(response.getId()).isEqualTo(888L);
        verify(productRepository, never()).save(any());
        verify(orderRepository, never()).save(argThat(o -> o.getId() == null));
    }

    @Test
    @DisplayName("Place order throws InsufficientStockException when stock is depleted")
    void placeOrder_insufficientStock() {
        testProduct.setStockQuantity(1); // Requested is 2

        when(orderRepository.findByIdempotencyKey("low-stock-key")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("buyer@example.com")).thenReturn(Optional.of(testUser));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(testCart));
        when(productRepository.findById(100L)).thenReturn(Optional.of(testProduct));

        PlaceOrderRequest request = new PlaceOrderRequest();
        request.setShippingAddress("123 Beauty Lane");

        assertThatThrownBy(() -> orderService.placeOrder("buyer@example.com", "low-stock-key", request))
                .isInstanceOf(InsufficientStockException.class);

        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    @DisplayName("Order state transition follows valid state machine")
    void transitionStatus_valid() {
        Order order = Order.builder()
                .id(1L)
                .status(OrderStatus.CREATED)
                .items(new ArrayList<>())
                .build();

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);

        OrderResponse res = orderService.transitionStatus(1L, OrderStatus.PAID);
        assertThat(res.getStatus()).isEqualTo(OrderStatus.PAID);
    }

    @Test
    @DisplayName("Invalid state transition throws InvalidOrderStateException")
    void transitionStatus_invalid() {
        Order order = Order.builder()
                .id(1L)
                .status(OrderStatus.CREATED)
                .items(new ArrayList<>())
                .build();

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        assertThatThrownBy(() -> orderService.transitionStatus(1L, OrderStatus.SHIPPED))
                .isInstanceOf(InvalidOrderStateException.class)
                .hasMessageContaining("Cannot transition order from status CREATED to SHIPPED");
    }
}
