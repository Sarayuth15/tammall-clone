package com.tammalls.api.service;

import com.tammalls.api.dto.*;
import com.tammalls.api.entity.Category;
import com.tammalls.api.entity.Product;
import com.tammalls.api.entity.User;
import com.tammalls.api.repository.CategoryRepository;
import com.tammalls.api.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Product createProduct(ProductCreateDto dto, User seller) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .discountPercentage(dto.getDiscountPercentage())
                .quantity(dto.getQuantity())
                .category(category)
                .seller(seller)
                .imageUrl(dto.getImageUrl())
                .thumbnailUrl(dto.getThumbnailUrl())
                .active(true)
                .build();

        return productRepository.save(product);
    }

    public Product updateProduct(Long productId, ProductUpdateDto dto, User seller) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (!product.getSeller().getId().equals(seller.getId())) {
            throw new IllegalArgumentException("You can only update your own products");
        }

        if (dto.getName() != null) product.setName(dto.getName());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getPrice() != null) product.setPrice(dto.getPrice());
        if (dto.getDiscountPercentage() != null) product.setDiscountPercentage(dto.getDiscountPercentage());
        if (dto.getQuantity() != null) product.setQuantity(dto.getQuantity());
        if (dto.getActive() != null) product.setActive(dto.getActive());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            product.setCategory(category);
        }

        return productRepository.save(product);
    }

    public void deleteProduct(Long productId, User seller) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (!product.getSeller().getId().equals(seller.getId())) {
            throw new IllegalArgumentException("You can only delete your own products");
        }

        productRepository.delete(product);
    }

    public Optional<Product> getProductById(Long productId) {
        return productRepository.findById(productId);
    }

    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findByActive(true, pageable);
    }

    public Page<Product> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchProducts(keyword, pageable);
    }

    public Page<Product> getProductsByCategory(Long categoryId, Pageable pageable) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        return productRepository.findByCategory(category, pageable);
    }

    public Page<Product> getSellerProducts(User seller, Pageable pageable) {
        return productRepository.findBySeller(seller, pageable);
    }

    public ProductResponseDto convertToDto(Product product, UserService userService) {
        return ProductResponseDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .discountPercentage(product.getDiscountPercentage())
                .discountedPrice(product.getDiscountedPrice())
                .quantity(product.getQuantity())
                .imageUrl(product.getImageUrl())
                .thumbnailUrl(product.getThumbnailUrl())
                .ratingAverage(product.getRatingAverage())
                .totalReviews(product.getTotalReviews())
                .category(CategoryDto.builder()
                        .id(product.getCategory().getId())
                        .name(product.getCategory().getName())
                        .build())
                .seller(userService.convertToDto(product.getSeller()))
                .createdAt(product.getCreatedAt())
                .build();
    }
}
