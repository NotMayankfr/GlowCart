package com.glowcart.service;

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
