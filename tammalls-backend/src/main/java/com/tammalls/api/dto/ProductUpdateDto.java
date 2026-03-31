package com.tammalls.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductUpdateDto {
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPercentage;
    private Integer quantity;
    private Long categoryId;
    private Boolean active;
}
