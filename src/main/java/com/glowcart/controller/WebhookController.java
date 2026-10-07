package com.glowcart.controller;

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
