package com.glowcart.service;

import com.glowcart.dto.request.PaymentWebhookRequest;
import com.glowcart.entity.Order;
import com.glowcart.entity.OrderStatus;
import com.glowcart.exception.ResourceNotFoundException;
import com.glowcart.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;
    private final OrderService orderService;

    @Transactional
    public void processWebhook(PaymentWebhookRequest request) {
        log.info("Received payment webhook: Order ID {}, Status {}, Payment ID {}",
                request.getOrderId(), request.getStatus(), request.getPaymentId());

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", request.getOrderId()));

        order.setPaymentId(request.getPaymentId());
        orderRepository.save(order);

        if ("SUCCESS".equalsIgnoreCase(request.getStatus())) {
            orderService.transitionStatus(order.getId(), OrderStatus.PAID);
            log.info("Payment confirmed for Order ID {}", order.getId());
        } else {
            orderService.transitionStatus(order.getId(), OrderStatus.CANCELLED);
            log.warn("Payment failed for Order ID {}. Stock automatically restored.", order.getId());
        }
    }
}
