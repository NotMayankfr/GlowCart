import os

files = {
    "src/main/java/com/glowcart/dto/request/PaymentWebhookRequest.java": """package com.glowcart.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentWebhookRequest {
    @NotNull
    private Long orderId;

    @NotBlank
    private String paymentId;

    @NotBlank
    private String status; // "SUCCESS" or "FAILED"
}
""",
    "src/main/java/com/glowcart/service/PaymentService.java": """package com.glowcart.service;

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
""",
    "src/main/java/com/glowcart/controller/WebhookController.java": """package com.glowcart.controller;

import com.glowcart.dto.request.PaymentWebhookRequest;
import com.glowcart.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final PaymentService paymentService;

    @PostMapping("/payment")
    public ResponseEntity<Void> handlePaymentWebhook(@Valid @RequestBody PaymentWebhookRequest request) {
        // TODO: Validate webhook signature in production
        paymentService.processWebhook(request);
        return ResponseEntity.ok().build();
    }
}
""",
    "k6/load-test.js": """import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 50 },
        { duration: '1m',  target: 50 },
        { duration: '30s', target: 200 },
        { duration: '1m',  target: 200 },
        { duration: '30s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],
    },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export default function () {
    const res = http.get(`${BASE_URL}/api/v1/products?page=0&size=20`);
    check(res, { 'status is 200': (r) => r.status === 200 });
    sleep(1);
}
""",
    "k6/oversell-test.js": """import http from 'k6/http';
import { check } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
    vus: 200,
    iterations: 200,
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const TOKEN = __ENV.TOKEN; // Pass via environment

export default function () {
    const res = http.post(
        `${BASE_URL}/api/v1/orders`,
        JSON.stringify({ shippingAddress: '123 Test St' }),
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`,
                'Idempotency-Key': uuidv4(),
            },
        }
    );
    check(res, {
        'is 201 or 409': (r) => r.status === 201 || r.status === 409,
    });
}
"""
}

for filepath, content in files.items():
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content)
