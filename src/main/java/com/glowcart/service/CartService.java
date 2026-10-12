package com.glowcart.service;

import com.glowcart.dto.request.CartItemRequest;
import com.glowcart.dto.response.CartItemResponse;
import com.glowcart.dto.response.CartResponse;
import com.glowcart.entity.Cart;
import com.glowcart.entity.CartItem;
import com.glowcart.entity.Product;
import com.glowcart.entity.User;
import com.glowcart.exception.InsufficientStockException;
import com.glowcart.exception.ResourceNotFoundException;
import com.glowcart.repository.CartItemRepository;
import com.glowcart.repository.CartRepository;
import com.glowcart.repository.ProductRepository;
import com.glowcart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Cart getOrCreateCartEntity(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).items(new ArrayList<>()).build()));
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(String email) {
        Cart cart = getOrCreateCartEntity(email);
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse addItem(String email, CartItemRequest request) {
        Cart cart = getOrCreateCartEntity(email);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        if (!product.getActive()) {
            throw new IllegalArgumentException("Cannot add inactive product to cart");
        }

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new InsufficientStockException(product.getId(), request.getQuantity(), product.getStockQuantity());
        }

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            int newQuantity = existingItem.get().getQuantity() + request.getQuantity();
            if (product.getStockQuantity() < newQuantity) {
                throw new InsufficientStockException(product.getId(), newQuantity, product.getStockQuantity());
            }
            existingItem.get().setQuantity(newQuantity);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(newItem);
        }

        return mapToResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse updateItemQuantity(String email, Long itemId, int quantity) {
        if (quantity < 1) {
            return removeItem(email, itemId);
        }

        Cart cart = getOrCreateCartEntity(email);
        CartItem cartItem = cart.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", itemId));

        if (cartItem.getProduct().getStockQuantity() < quantity) {
            throw new InsufficientStockException(cartItem.getProduct().getId(), quantity, cartItem.getProduct().getStockQuantity());
        }

        cartItem.setQuantity(quantity);
        return mapToResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeItem(String email, Long itemId) {
        Cart cart = getOrCreateCartEntity(email);
        cart.getItems().removeIf(item -> item.getId().equals(itemId));
        return mapToResponse(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(String email) {
        Cart cart = getOrCreateCartEntity(email);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public CartResponse mapToResponse(Cart cart) {
        BigDecimal total = BigDecimal.ZERO;
        int count = 0;
        var itemResponses = new ArrayList<CartItemResponse>();

        for (CartItem item : cart.getItems()) {
            Product p = item.getProduct();
            BigDecimal subtotal = p.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(subtotal);
            count += item.getQuantity();

            itemResponses.add(CartItemResponse.builder()
                    .id(item.getId())
                    .productId(p.getId())
                    .productName(p.getName())
                    .productSlug(p.getSlug())
                    .imageUrl(p.getImageUrl())
                    .unitPrice(p.getPrice())
                    .quantity(item.getQuantity())
                    .subtotal(subtotal)
                    .build());
        }

        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser() != null ? cart.getUser().getId() : null)
                .items(itemResponses)
                .totalItems(count)
                .totalPrice(total)
                .build();
    }
}
