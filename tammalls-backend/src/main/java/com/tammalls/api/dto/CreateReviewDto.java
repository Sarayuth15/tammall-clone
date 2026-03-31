package com.tammalls.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// Review DTOs
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateReviewDto {
    private Long productId;
    private Integer rating;
    private String title;
    private String comment;
}
