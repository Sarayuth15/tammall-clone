package com.tammalls.api.controller;

import com.tammalls.api.dto.CreateReviewDto;
import com.tammalls.api.dto.ReviewResponseDto;
import com.tammalls.api.entity.Review;
import com.tammalls.api.entity.User;
import com.tammalls.api.service.ReviewService;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Create and browse product reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create review", description = "Creates a review for a product. Requires authentication.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Review created",
                    content = @Content(schema = @Schema(implementation = ReviewResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<?> createReview(
            @RequestBody CreateReviewDto dto,
            Authentication authentication) {
        
        User reviewer = userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Review review = reviewService.createReview(dto, reviewer);
        ReviewResponseDto response = reviewService.convertToDto(review);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update review", description = "Updates an existing review. Requires authentication.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Review updated",
                    content = @Content(schema = @Schema(implementation = ReviewResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<?> updateReview(
            @PathVariable Long id,
            @RequestBody CreateReviewDto dto,
            Authentication authentication) {
        
        User reviewer = userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Review review = reviewService.updateReview(id, dto, reviewer);
        ReviewResponseDto response = reviewService.convertToDto(review);
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete review", description = "Deletes a review. Requires authentication.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Review deleted",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<?> deleteReview(
            @PathVariable Long id,
            Authentication authentication) {
        
        User reviewer = userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        reviewService.deleteReview(id, reviewer);
        return ResponseEntity.ok("Review deleted successfully");
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get review by id", description = "Returns a review by its id.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Review found",
                    content = @Content(schema = @Schema(implementation = ReviewResponseDto.class)))
    })
    public ResponseEntity<?> getReviewById(@PathVariable Long id) {
        Review review = reviewService.getReviewById(id);
        ReviewResponseDto response = reviewService.convertToDto(review);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/product/{productId}")
    @Operation(summary = "List reviews for product (paged)", description = "Returns a paged list of reviews for a product.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Paged reviews",
                    content = @Content(schema = @Schema(implementation = Page.class)))
    })
    public ResponseEntity<?> getProductReviews(
            @Parameter(description = "Product id", example = "123") @PathVariable Long productId,
            @Parameter(description = "Page index (0-based)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size", example = "10")
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviews = reviewService.getProductReviews(productId, pageable);
        
        Page<ReviewResponseDto> result = reviews.map(reviewService::convertToDto);
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/product/{productId}/list")
    @Operation(summary = "List reviews for product (non-paged)", description = "Returns all reviews for a product (non-paginated).")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reviews list",
                    content = @Content(schema = @Schema(implementation = ReviewResponseDto.class)))
    })
    public ResponseEntity<?> getProductReviewsList(@PathVariable Long productId) {
        List<Review> reviews = reviewService.getProductReviewsList(productId);
        List<ReviewResponseDto> result = reviews.stream()
                .map(reviewService::convertToDto)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/product/{productId}/my-review")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get my review for product", description = "Returns the authenticated user's review for a product (if present).")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Review found",
                    content = @Content(schema = @Schema(implementation = ReviewResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "No review found"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<?> getUserProductReview(
            @PathVariable Long productId,
            Authentication authentication) {
        
        User reviewer = userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        return reviewService.getUserProductReview(productId, reviewer)
                .map(review -> {
                    ReviewResponseDto dto = reviewService.convertToDto(review);
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Verify review", description = "ADMIN: Marks a review as verified.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Review verified",
                    content = @Content(schema = @Schema(implementation = ReviewResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Not authorized")
    })
    public ResponseEntity<?> verifyReview(@PathVariable Long id) {
        reviewService.verifyReview(id);
        Review review = reviewService.getReviewById(id);
        ReviewResponseDto response = reviewService.convertToDto(review);
        
        return ResponseEntity.ok(response);
    }
}
