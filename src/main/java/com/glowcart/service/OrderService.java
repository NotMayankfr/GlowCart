package com.glowcart.service;

import com.glowcart.dto.request.PlaceOrderRequest;
import com.glowcart.dto.response.OrderItemResponse;
import com.glowcart.dto.response.OrderResponse;
import com.glowcart.dto.response.PagedResponse;
import com.glowcart.entity.*;
import com.glowcart.exception.InsufficientStockException;
import com.glowcart.exception.InvalidOrderStateException;
import com.glowcart.exception.ResourceNotFoundException;
import com.glowcart.repository.CartRepository;
import com.glowcart.repository.OrderRepository;
import com.glowcart.repository.ProductRepository;
import com.glowcart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CacheManager cacheManager;

    private static final Map<OrderStatus, Set<OrderStatus>> VALID_TRANSITIONS = new EnumMap<>(OrderStatus.class);

    static {
        VALID_TRANSITIONS.put(OrderStatus.CREATED, Set.of(OrderStatus.PAID, OrderStatus.CANCELLED));
        VALID_TRANSITIONS.put(OrderStatus.PAID, Set.of(OrderStatus.SHIPPED, OrderStatus.CANCELLED));
        VALID_TRANSITIONS.put(OrderStatus.SHIPPED, Collections.emptySet());
        VALID_TRANSITIONS.put(OrderStatus.CANCELLED, Collections.emptySet());
    }

    /**
     * Core checkout transaction.
     * Guaranteed oversell protection via JPA @Version optimistic locking.
     * Guaranteed duplicate order protection via Idempotency-Key.
     */
    @Transactional
    public OrderResponse placeOrder(String email, String idempotencyKey, PlaceOrderRequest request) {
        log.info("Processing order placement for user: {} with Idempotency-Key: {}", email, idempotencyKey);

        // 1. Idempotency Check: Return existing order if key has already been processed
        Optional<Order> existingOrder = orderRepository.findByIdempotencyKey(idempotencyKey);
        if (existingOrder.isPresent()) {
            log.info("Idempotent hit: Returning existing order ID {} for key {}", existingOrder.get().getId(), idempotencyKey);
            return mapToResponse(existingOrder.get());
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // 2. Validate Cart
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Cart is empty. Add items before placing an order."));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cannot place order with an empty cart.");
        }

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.CREATED)
                .idempotencyKey(idempotencyKey)
                .shippingAddress(request.getShippingAddress())
                .items(new ArrayList<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        // 3. Process each line item with Optimistic Locking decrement
        for (CartItem cartItem : cart.getItems()) {
            final Long productId = cartItem.getProduct().getId();

            // Refresh product state from DB
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

            if (product.getStockQuantity() < cartItem.getQuantity()) {
                log.warn("Stock depletion conflict: Product '{}' has {} units, requested {}",
                        product.getName(), product.getStockQuantity(), cartItem.getQuantity());
                throw new InsufficientStockException(product.getId(), cartItem.getQuantity(), product.getStockQuantity());
            }

            // Decrement inventory. JPA @Version enforces concurrency control on commit
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            // Evict product cache so stale stock numbers aren't served
            evictProductCache(product.getSlug());

            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

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

        // 4. Clear shopping cart
        cart.getItems().clear();
        cartRepository.save(cart);

        // 5. Persist and return order
        Order savedOrder = orderRepository.save(order);
        log.info("Order ID {} created successfully for user {}", savedOrder.getId(), email);
        return mapToResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> getMyOrders(String email, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        Page<Order> orderPage = orderRepository.findByUserId(user.getId(),
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));

        return new PagedResponse<>(
                orderPage.getContent().stream().map(this::mapToResponse).toList(),
                orderPage.getNumber(),
                orderPage.getSize(),
                orderPage.getTotalElements(),
                orderPage.getTotalPages(),
                orderPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(String email, Long orderId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getUser().getId().equals(user.getId()) && !user.getRole().equals(Role.ADMIN)) {
            throw new ResourceNotFoundException("Order", "id", orderId);
        }

        return mapToResponse(order);
    }

    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> getAllOrders(OrderStatus status, int page, int size) {
        Page<Order> orderPage = (status == null)
                ? orderRepository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")))
                : orderRepository.findByStatus(status, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));

        return new PagedResponse<>(
                orderPage.getContent().stream().map(this::mapToResponse).toList(),
                orderPage.getNumber(),
                orderPage.getSize(),
                orderPage.getTotalElements(),
                orderPage.getTotalPages(),
                orderPage.isLast()
        );
    }

    /**
     * Enforces the state machine transitions:
     * CREATED -> PAID -> SHIPPED
     * CREATED/PAID -> CANCELLED (restores stock)
     */
    @Transactional
    public OrderResponse transitionStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        Set<OrderStatus> allowed = VALID_TRANSITIONS.getOrDefault(order.getStatus(), Collections.emptySet());
        if (!allowed.contains(newStatus)) {
            throw new InvalidOrderStateException(order.getStatus().name(), newStatus.name());
        }

        log.info("Transitioning Order ID {} from {} to {}", orderId, order.getStatus(), newStatus);

        // If order is cancelled, restore reserved inventory
        if (newStatus == OrderStatus.CANCELLED) {
            restoreStock(order);
        }

        order.setStatus(newStatus);
        return mapToResponse(orderRepository.save(order));
    }

    /**
     * Runs every 5 minutes: auto-cancels orders left in CREATED state older than 30 minutes.
     */
    @Scheduled(fixedRate = 300_000)
    @Transactional
    public void cancelStaleOrders() {
        Instant cutoff = Instant.now().minus(30, ChronoUnit.MINUTES);
        List<Order> staleOrders = orderRepository.findByStatusAndCreatedAtBefore(OrderStatus.CREATED, cutoff);

        if (!staleOrders.isEmpty()) {
            log.info("Scheduled job found {} stale unpaid orders to cancel", staleOrders.size());
            for (Order order : staleOrders) {
                try {
                    restoreStock(order);
                    order.setStatus(OrderStatus.CANCELLED);
                    orderRepository.save(order);
                    log.info("Cancelled stale Order ID {}", order.getId());
                } catch (Exception ex) {
                    log.error("Failed to cancel stale Order ID {}", order.getId(), ex);
                }
            }
        }
    }

    private void restoreStock(Order order) {
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
            evictProductCache(product.getSlug());
            log.info("Restored {} units to Product ID {}", item.getQuantity(), product.getId());
        }
    }

    private void evictProductCache(String slug) {
        try {
            var cache = cacheManager.getCache("products");
            if (cache != null && slug != null) {
                cache.evict(slug);
            }
        } catch (Exception e) {
            log.debug("Cache eviction exception ignored: {}", e.getMessage());
        }
    }

    public OrderResponse mapToResponse(Order order) {
        var itemResponses = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                        .productName(item.getProductName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subtotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build())
                .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .userEmail(order.getUser() != null ? order.getUser().getEmail() : null)
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .idempotencyKey(order.getIdempotencyKey())
                .paymentId(order.getPaymentId())
                .shippingAddress(order.getShippingAddress())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(itemResponses)
                .build();
    }
}
