package com.glowcart.service;

import com.glowcart.dto.request.CartItemRequest;
import com.glowcart.entity.Cart;
import com.glowcart.entity.CartItem;
import com.glowcart.entity.Product;
import com.glowcart.entity.User;
import com.glowcart.repository.CartRepository;
import com.glowcart.repository.ProductRepository;
import com.glowcart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Cart getOrCreateCart(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }

    @Transactional
    public Cart addItem(String email, CartItemRequest request) {
        Cart cart = getOrCreateCart(email);
        Product product = productRepository.findById(request.getProductId()).orElseThrow();

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + request.getQuantity());
        } else {
            cart.getItems().add(CartItem.builder().cart(cart).product(product).quantity(request.getQuantity()).build());
        }

        return cartRepository.save(cart);
    }
}
