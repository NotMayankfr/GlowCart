package com.glowcart.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@Tag(name = "Root", description = "Application health & discovery")
public class RootController {

    @GetMapping("/")
    @Operation(summary = "API Welcome & Status", description = "Root health endpoint providing links to documentation and API status.")
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
                "application", "GlowCart Backend",
                "version", "1.0.0",
                "status", "UP",
                "timestamp", Instant.now().toString(),
                "docs", "/swagger-ui.html",
                "apiDocs", "/v3/api-docs",
                "catalog", "/api/v1/products"
        ));
    }
}
