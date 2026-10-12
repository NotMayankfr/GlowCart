package com.glowcart.controller;

import com.glowcart.dto.request.PaymentWebhookRequest;
import com.glowcart.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/webhooks")
@RequiredArgsConstructor
@Tag(name = "Webhooks", description = "Asynchronous payment gateway callbacks")
public class WebhookController {

    private final PaymentService paymentService;

    @PostMapping("/payment")
    @Operation(summary = "Payment callback webhook", description = "Public webhook invoked by mock payment gateway. Transitions order status to PAID or CANCELLED.")
    @ApiResponse(responseCode = "200", description = "Webhook processed successfully")
    public ResponseEntity<Void> handlePaymentWebhook(@Valid @RequestBody PaymentWebhookRequest request) {
        // Note: In production, verify HMAC-SHA256 signature in X-Webhook-Signature header
        paymentService.processWebhook(request);
        return ResponseEntity.ok().build();
    }
}
