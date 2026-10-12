package com.glowcart.controller;

import com.glowcart.dto.request.PlaceOrderRequest;
import com.glowcart.dto.response.OrderResponse;
import com.glowcart.dto.response.PagedResponse;
import com.glowcart.entity.OrderStatus;
import com.glowcart.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order placement, idempotency handling, and order lifecycle management")
@SecurityRequirement(name = "Bearer Auth")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/orders")
    @Operation(summary = "Place order", description = "Places an order from the user's cart in a single transaction with optimistic-locking oversell protection. Requires a unique Idempotency-Key header.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Order placed successfully"),
            @ApiResponse(responseCode = "200", description = "Idempotency replay: Existing order returned for duplicate key"),
            @ApiResponse(responseCode = "400", description = "Invalid request or cart is empty"),
            @ApiResponse(responseCode = "409", description = "Insufficient stock or concurrent modification conflict (retry safe)")
    })
    public ResponseEntity<OrderResponse> placeOrder(
            Authentication authentication,
            @Parameter(description = "UUID v4 client idempotency key to prevent double charge / duplicate orders", required = true)
            @RequestHeader("Idempotency-Key") String idempotencyKey,
            @Valid @RequestBody PlaceOrderRequest request) {

        String email = authentication.getName();
        OrderResponse order = orderService.placeOrder(email, idempotencyKey, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping("/orders")
    @Operation(summary = "Get user order history", description = "Returns a paginated list of orders placed by the authenticated customer.")
    public ResponseEntity<PagedResponse<OrderResponse>> getMyOrders(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(orderService.getMyOrders(authentication.getName(), page, size));
    }

    @GetMapping("/orders/{id}")
    @Operation(summary = "Get order details", description = "Retrieves line items and status for a specific order.")
    public ResponseEntity<OrderResponse> getOrderById(
            Authentication authentication,
            @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(authentication.getName(), id));
    }

    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all orders (Admin)", description = "Admin endpoint to browse all orders across all customers with optional status filter.")
    public ResponseEntity<PagedResponse<OrderResponse>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(orderService.getAllOrders(status, page, size));
    }

    @PutMapping("/admin/orders/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update order status (Admin)", description = "Transitions order status according to lifecycle rules (e.g., mark as SHIPPED or CANCELLED).")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.transitionStatus(id, status));
    }
}
