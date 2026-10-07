package com.glowcart.service;

import com.glowcart.dto.request.PaymentWebhookRequest;
import com.glowcart.entity.Order;
import com.glowcart.entity.OrderStatus;
import com.glowcart.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final OrderRepository orderRepository;

    @Transactional
    public void processWebhook(PaymentWebhookRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getStatus().equals(OrderStatus.CREATED)) {
            throw new RuntimeException("Invalid order state transition");
        }

        if ("SUCCESS".equalsIgnoreCase(request.getStatus())) {
            order.setStatus(OrderStatus.PAID);
            order.setPaymentId(request.getPaymentId());
        } else {
            order.setStatus(OrderStatus.CANCELLED);
            // Stock restoration logic would go here
        }
        orderRepository.save(order);
    }
}
