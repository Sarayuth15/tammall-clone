package com.tammalls.api.controller;

import com.tammalls.api.dto.*;
import com.tammalls.api.entity.Product;
import com.tammalls.api.entity.User;
import com.tammalls.api.service.ProductService;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Browse, search, and manage products")
public class ProductController {

    private final ProductService productService;
    private final UserService userService;

    @GetMapping
    @Operation(
            summary = "List products (paged)",
            description = "Returns a paged list of products. Supports pagination and sorting."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Paged products",
                    content = @Content(schema = @Schema(implementation = Page.class)))
    })
    public ResponseEntity<?> getAllProducts(
            @Parameter(description = "Page index (0-based)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size", example = "12")
            @RequestParam(defaultValue = "12") int size,
            @Parameter(description = "Sort field (DESC)", example = "createdAt")
            @RequestParam(defaultValue = "createdAt") String sortBy) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, sortBy);
        Page<Product> products = productService.getAllProducts(pageable);
        
        Page<ProductResponseDto> result = products.map(p -> productService.convertToDto(p, userService));
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/search")
    @Operation(
            summary = "Search products (paged)",
            description = "Search products by keyword."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Paged search results",
                    content = @Content(schema = @Schema(implementation = Page.class)))
    })
    public ResponseEntity<?> searchProducts(
            @Parameter(description = "Search keyword", example = "shoes", required = true)
            @RequestParam String keyword,
            @Parameter(description = "Page index (0-based)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size", example = "12")
            @RequestParam(defaultValue = "12") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.searchProducts(keyword, pageable);
        
        Page<ProductResponseDto> result = products.map(p -> productService.convertToDto(p, userService));
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/category/{categoryId}")
    @Operation(
            summary = "List products by category (paged)",
            description = "Returns products belonging to a category."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Paged category products",
                    content = @Content(schema = @Schema(implementation = Page.class)))
    })
    public ResponseEntity<?> getProductsByCategory(
            @Parameter(description = "Category id", example = "1", required = true)
            @PathVariable Long categoryId,
            @Parameter(description = "Page index (0-based)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size", example = "12")
            @RequestParam(defaultValue = "12") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.getProductsByCategory(categoryId, pageable);
        
        Page<ProductResponseDto> result = products.map(p -> productService.convertToDto(p, userService));
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Get product by id",
            description = "Returns one product by its id."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product found",
                    content = @Content(schema = @Schema(implementation = ProductResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(p -> {
                    ProductResponseDto dto = productService.convertToDto(p, userService);
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
            summary = "Create product",
            description = "Creates a new product. Requires SELLER or ADMIN."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Product created",
                    content = @Content(schema = @Schema(implementation = ProductResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Not authorized")
    })
    public ResponseEntity<?> createProduct(
            @RequestBody ProductCreateDto dto,
            Authentication authentication) {
        
        User seller = userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Product product = productService.createProduct(dto, seller);
        ProductResponseDto response = productService.convertToDto(product, userService);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
            summary = "Update product",
            description = "Updates an existing product. Requires SELLER or ADMIN."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product updated",
                    content = @Content(schema = @Schema(implementation = ProductResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Not authorized")
    })
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductUpdateDto dto,
            Authentication authentication) {
        
        User seller = userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Product product = productService.updateProduct(id, dto, seller);
        ProductResponseDto response = productService.convertToDto(product, userService);
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
            summary = "Delete product",
            description = "Deletes a product. Requires SELLER or ADMIN."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product deleted",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Not authorized")
    })
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long id,
            Authentication authentication) {
        
        User seller = userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        productService.deleteProduct(id, seller);
        
        return ResponseEntity.ok("Product deleted successfully");
    }

    @GetMapping("/seller/{sellerId}")
    @Operation(
            summary = "List products for a seller (paged)",
            description = "Returns products created by a specific seller."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Paged seller products",
                    content = @Content(schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "400", description = "Seller not found",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<?> getSellerProducts(
            @PathVariable Long sellerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        User seller = userService.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.getSellerProducts(seller, pageable);
        
        Page<ProductResponseDto> result = products.map(p -> productService.convertToDto(p, userService));
        
        return ResponseEntity.ok(result);
    }
}
