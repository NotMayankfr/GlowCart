package com.glowcart.unit.service;

import com.glowcart.dto.request.ProductRequest;
import com.glowcart.dto.response.PagedResponse;
import com.glowcart.dto.response.ProductResponse;
import com.glowcart.entity.Brand;
import com.glowcart.entity.Category;
import com.glowcart.entity.Product;
import com.glowcart.exception.ResourceNotFoundException;
import com.glowcart.repository.BrandRepository;
import com.glowcart.repository.CategoryRepository;
import com.glowcart.repository.ProductRepository;
import com.glowcart.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private BrandRepository brandRepository;

    @InjectMocks
    private ProductService productService;

    private Category testCategory;
    private Brand testBrand;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        testCategory = Category.builder().id(1L).name("Skincare").slug("skincare").build();
        testBrand = Brand.builder().id(2L).name("GlowCart Luxe").slug("glowcart-luxe").build();
        testProduct = Product.builder()
                .id(10L)
                .name("Rose Serum")
                .slug("rose-serum")
                .description("Hydrating rose extract")
                .price(BigDecimal.valueOf(19.99))
                .stockQuantity(50)
                .category(testCategory)
                .brand(testBrand)
                .active(true)
                .version(0L)
                .build();
    }

    @Test
    @DisplayName("Fetch product by slug returns mapped response")
    void getProductBySlug_success() {
        when(productRepository.findBySlug("rose-serum")).thenReturn(Optional.of(testProduct));

        ProductResponse response = productService.getProductBySlug("rose-serum");

        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("Rose Serum");
        assertThat(response.getCategoryName()).isEqualTo("Skincare");
        assertThat(response.getBrandName()).isEqualTo("GlowCart Luxe");
    }

    @Test
    @DisplayName("Fetch product with non-existent slug throws ResourceNotFoundException")
    void getProductBySlug_notFound() {
        when(productRepository.findBySlug("unknown-product")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getProductBySlug("unknown-product"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Create product successfully persists and sets generated slug")
    void createProduct_success() {
        ProductRequest request = new ProductRequest();
        request.setName("Vitamin C Cleanser");
        request.setDescription("Brightening facial cleanser");
        request.setPrice(BigDecimal.valueOf(14.50));
        request.setStockQuantity(100);
        request.setCategoryId(1L);
        request.setBrandId(2L);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(brandRepository.findById(2L)).thenReturn(Optional.of(testBrand));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> {
            Product p = i.getArgument(0);
            p.setId(25L);
            return p;
        });

        ProductResponse res = productService.createProduct(request);

        assertThat(res.getId()).isEqualTo(25L);
        assertThat(res.getName()).isEqualTo("Vitamin C Cleanser");
        assertThat(res.getSlug()).isEqualTo("vitamin-c-cleanser");
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("Soft delete marks product as inactive")
    void deleteProduct_softDelete() {
        when(productRepository.findById(10L)).thenReturn(Optional.of(testProduct));

        productService.deleteProduct(10L);

        assertThat(testProduct.getActive()).isFalse();
        verify(productRepository).save(testProduct);
    }
}
