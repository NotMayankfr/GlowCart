package com.glowcart.service;

import com.glowcart.dto.request.PlaceOrderRequest;
import com.glowcart.entity.*;
import com.glowcart.repository.CartRepository;
import com.glowcart.repository.OrderRepository;
import com.glowcart.repository.ProductRepository;
import com.glowcart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order placeOrder(String email, String idempotencyKey, PlaceOrderRequest request) {
        // 1. Check idempotency
        Optional<Order> existingOrder = orderRepository.findByIdempotencyKey(idempotencyKey);
        if (existingOrder.isPresent()) {
            return existingOrder.get();
        }

        User user = userRepository.findByEmail(email).orElseThrow();
        
        // 2. Load Cart
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.CREATED)
                .idempotencyKey(idempotencyKey)
                .shippingAddress(request.getShippingAddress())
                .build();

        // 3. Process each item (Oversell Protection with @Version)
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Decrement stock - will throw OptimisticLockException if version modified
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .productName(product.getName())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();
            order.getItems().add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        
        // 4. Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        // 5. Save order
        return orderRepository.save(order);
    }
}
