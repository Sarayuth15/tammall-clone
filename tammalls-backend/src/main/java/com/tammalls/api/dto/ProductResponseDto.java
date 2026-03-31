package com.tammalls.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPercentage;
    private BigDecimal discountedPrice;
    private Integer quantity;
    private String imageUrl;
    private String thumbnailUrl;
    private Double ratingAverage;
    private Long totalReviews;
    private CategoryDto category;
    private UserResponseDto seller;
    private LocalDateTime createdAt;
}
