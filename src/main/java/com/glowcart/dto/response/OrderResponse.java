package com.glowcart.dto.response;

import com.glowcart.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Long userId;
    private String userEmail;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private String idempotencyKey;
    private String paymentId;
    private String shippingAddress;
    private Instant createdAt;
    private Instant updatedAt;
    private List<OrderItemResponse> items;
}
