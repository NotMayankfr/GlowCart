package com.glowcart.dto.request;

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
