import os

files = {
    "src/main/java/com/glowcart/dto/request/ProductRequest.java": """package com.glowcart.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank
    @Size(max = 255)
    private String name;

    private String description;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal price;

    @NotNull
    @Min(0)
    private Integer stockQuantity;

    @NotNull
    private Long categoryId;

    @NotNull
    private Long brandId;

    private String imageUrl;
}
""",
    "src/main/java/com/glowcart/dto/response/ProductResponse.java": """package com.glowcart.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
    private Long brandId;
    private String brandName;
    private Boolean active;
}
""",
    "src/main/java/com/glowcart/dto/response/PagedResponse.java": """package com.glowcart.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PagedResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean last;
}
""",
    "src/main/java/com/glowcart/service/ProductService.java": """package com.glowcart.service;

import com.glowcart.dto.request.ProductRequest;
import com.glowcart.dto.response.PagedResponse;
import com.glowcart.dto.response.ProductResponse;
import com.glowcart.entity.Brand;
import com.glowcart.entity.Category;
import com.glowcart.entity.Product;
import com.glowcart.repository.BrandRepository;
import com.glowcart.repository.CategoryRepository;
import com.glowcart.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    private ProductResponse mapToResponse(Product p) {
        ProductResponse res = new ProductResponse();
        res.setId(p.getId());
        res.setName(p.getName());
        res.setSlug(p.getSlug());
        res.setDescription(p.getDescription());
        res.setPrice(p.getPrice());
        res.setStockQuantity(p.getStockQuantity());
        res.setImageUrl(p.getImageUrl());
        res.setCategoryId(p.getCategory().getId());
        res.setCategoryName(p.getCategory().getName());
        res.setBrandId(p.getBrand().getId());
        res.setBrandName(p.getBrand().getName());
        res.setActive(p.getActive());
        return res;
    }

    public PagedResponse<ProductResponse> getProducts(
            Long categoryId, Long brandId, BigDecimal minPrice, BigDecimal maxPrice,
            String search, int page, int size, String sort) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort).descending());
        Page<Product> products = productRepository.findFiltered(categoryId, brandId, minPrice, maxPrice, search, pageable);

        return new PagedResponse<>(
                products.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()),
                products.getNumber(),
                products.getSize(),
                products.getTotalElements(),
                products.getTotalPages(),
                products.isLast()
        );
    }

    public ProductResponse getProductBySlug(String slug) {
        Product p = productRepository.findBySlug(slug).orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToResponse(p);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        Product p = Product.builder()
                .name(request.getName())
                .slug(request.getName().toLowerCase().replace(" ", "-"))
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .category(category)
                .brand(brand)
                .active(true)
                .build();

        return mapToResponse(productRepository.save(p));
    }
}
""",
    "src/main/java/com/glowcart/controller/ProductController.java": """package com.glowcart.controller;

import com.glowcart.dto.request.ProductRequest;
import com.glowcart.dto.response.PagedResponse;
import com.glowcart.dto.response.ProductResponse;
import com.glowcart.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<PagedResponse<ProductResponse>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sort) {
        return ResponseEntity.ok(productService.getProducts(categoryId, brandId, minPrice, maxPrice, search, page, size, sort));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProductResponse> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return new ResponseEntity<>(productService.createProduct(request), HttpStatus.CREATED);
    }
}
"""
}

for filepath, content in files.items():
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content)
