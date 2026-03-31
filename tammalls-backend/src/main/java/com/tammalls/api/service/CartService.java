package com.tammalls.api.service;

import com.tammalls.api.dto.AddToCartDto;
import com.tammalls.api.dto.CartItemDto;
import com.tammalls.api.dto.CartResponseDto;
import com.tammalls.api.dto.ProductResponseDto;
import com.tammalls.api.entity.CartItem;
import com.tammalls.api.entity.Product;
import com.tammalls.api.entity.User;
import com.tammalls.api.repository.CartItemRepository;
import com.tammalls.api.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final UserService userService;

    public CartItem addToCart(User user, AddToCartDto dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (product.getQuantity() < dto.getQuantity()) {
            throw new IllegalArgumentException("Insufficient stock available");
        }

        Optional<CartItem> existingItem = cartItemRepository.findByUserAndProduct(user, product);

        if (existingItem.isPresent()) {
            CartItem cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + dto.getQuantity());
            return cartItemRepository.save(cartItem);
        }

        CartItem cartItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(dto.getQuantity())
                .build();

        return cartItemRepository.save(cartItem);
    }

    public List<CartItem> getCart(User user) {
        return cartItemRepository.findByUser(user);
    }

    public CartResponseDto getCartResponse(User user) {
        List<CartItem> items = getCart(user);
        
        BigDecimal subtotal = BigDecimal.ZERO;
        int totalItems = 0;

        for (CartItem item : items) {
            BigDecimal itemTotal = item.getProduct().getDiscountedPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(itemTotal);
            totalItems += item.getQuantity();
        }

        List<CartItemDto> itemDtos = items.stream()
                .map(item -> CartItemDto.builder()
                        .id(item.getId())
                        .product(productService.convertToDto(item.getProduct(), userService))
                        .quantity(item.getQuantity())
                        .build())
                .toList();

        return CartResponseDto.builder()
                .items(itemDtos)
                .subtotal(subtotal)
                .totalItems(totalItems)
                .build();
    }

    public CartItem updateCartItem(Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        if (cartItem.getProduct().getQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient stock available");
        }

        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    public void removeFromCart(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        
        cartItemRepository.deleteByUserAndProduct(user, product);
    }

    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }

    public long getCartItemCount(User user) {
        return cartItemRepository.countByUser(user);
    }
}
