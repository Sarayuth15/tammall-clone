package com.tammalls.api.controller;

import com.tammalls.api.dto.AddToCartDto;
import com.tammalls.api.dto.CartItemDto;
import com.tammalls.api.dto.CartResponseDto;
import com.tammalls.api.entity.CartItem;
import com.tammalls.api.entity.User;
import com.tammalls.api.service.CartService;
import com.tammalls.api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Manage the current user's shopping cart")
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get my cart", description = "Returns the authenticated user's cart.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cart returned",
                    content = @Content(schema = @Schema(implementation = CartResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<?> getCart(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        CartResponseDto cart = cartService.getCartResponse(user);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Add item to cart", description = "Adds a product to the authenticated user's cart.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Item added",
                    content = @Content(schema = @Schema(implementation = CartItemDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<?> addToCart(
            @RequestBody AddToCartDto dto,
            Authentication authentication) {
        
        User user = userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        CartItem cartItem = cartService.addToCart(user, dto);
        
        CartItemDto response = CartItemDto.builder()
                .id(cartItem.getId())
                .quantity(cartItem.getQuantity())
                .build();
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/items/{cartItemId}")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update cart item quantity", description = "Updates the quantity for a cart item.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Item updated",
                    content = @Content(schema = @Schema(implementation = CartItemDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid quantity / item not found",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<?> updateCartItem(
            @Parameter(description = "Cart item id", example = "10") @PathVariable Long cartItemId,
            @Parameter(description = "New quantity", example = "2", required = true)
            @RequestParam Integer quantity) {
        
        CartItem cartItem = cartService.updateCartItem(cartItemId, quantity);
        
        CartItemDto response = CartItemDto.builder()
                .id(cartItem.getId())
                .quantity(cartItem.getQuantity())
                .build();
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/items/{cartItemId}")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Remove cart item", description = "Removes a cart item by its id.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Item removed",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<?> removeFromCart(@PathVariable Long cartItemId) {
        cartService.removeFromCart(cartItemId);
        return ResponseEntity.ok("Item removed from cart");
    }

    @DeleteMapping("/products/{productId}")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Remove product from cart", description = "Removes a product from the authenticated user's cart.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product removed",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<?> removeProductFromCart(
            @Parameter(description = "Product id", example = "123") @PathVariable Long productId,
            Authentication authentication) {
        
        User user = userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        cartService.removeFromCart(user, productId);
        return ResponseEntity.ok("Product removed from cart");
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Clear cart", description = "Removes all items from the authenticated user's cart.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cart cleared",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<?> clearCart(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        cartService.clearCart(user);
        return ResponseEntity.ok("Cart cleared successfully");
    }

    @GetMapping("/count")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get cart item count", description = "Returns the number of items in the authenticated user's cart.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count returned",
                    content = @Content(schema = @Schema(implementation = Long.class))),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<?> getCartItemCount(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        long count = cartService.getCartItemCount(user);
        return ResponseEntity.ok(count);
    }
}
