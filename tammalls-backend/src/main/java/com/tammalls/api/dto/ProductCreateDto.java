package com.tammalls.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

// Product DTOs
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCreateDto {
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPercentage;
    private Integer quantity;
    private Long categoryId;
    private String imageUrl;
    private String thumbnailUrl;
}
