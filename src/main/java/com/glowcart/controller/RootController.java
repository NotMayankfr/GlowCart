package com.glowcart.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.view.RedirectView;

import java.time.Instant;
import java.util.Map;

@Controller
@Tag(name = "Root", description = "Application health & discovery")
public class RootController {

    @GetMapping("/")
    @Operation(summary = "Redirect to Swagger UI", description = "Redirects root requests directly to interactive Swagger API documentation.")
    public RedirectView redirectToSwagger() {
        return new RedirectView("/swagger-ui.html");
    }

    @GetMapping("/health")
    @ResponseBody
    @Operation(summary = "Health status", description = "JSON endpoint returning application health status.")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "application", "GlowCart Backend",
                "version", "1.0.0",
                "status", "UP",
                "timestamp", Instant.now().toString(),
                "docs", "/swagger-ui.html",
                "catalog", "/api/v1/products"
        ));
    }
}
