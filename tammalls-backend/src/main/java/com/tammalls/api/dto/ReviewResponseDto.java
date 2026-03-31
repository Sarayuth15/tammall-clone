package com.tammalls.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponseDto {
    private Long id;
    private Integer rating;
    private String title;
    private String comment;
    private UserResponseDto reviewer;
    private Boolean verified;
    private LocalDateTime createdAt;
}
