package com.glowcart.controller;

import com.glowcart.dto.request.PlaceOrderRequest;
import com.glowcart.entity.Order;
import com.glowcart.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> placeOrder(
            Authentication authentication,
            @RequestHeader("Idempotency-Key") String idempotencyKey,
            @Valid @RequestBody PlaceOrderRequest request) {
        
        String email = authentication.getName();
        Order order = orderService.placeOrder(email, idempotencyKey, request);
        
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }
}
