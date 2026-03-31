package com.tammalls.api.service;

import com.tammalls.api.dto.CreateReviewDto;
import com.tammalls.api.dto.ReviewResponseDto;
import com.tammalls.api.entity.Product;
import com.tammalls.api.entity.Review;
import com.tammalls.api.entity.User;
import com.tammalls.api.repository.ProductRepository;
import com.tammalls.api.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    public Review createReview(CreateReviewDto dto, User reviewer) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        // Check if user already reviewed this product
        Optional<Review> existingReview = reviewRepository.findByProductAndReviewer(product, reviewer);
        if (existingReview.isPresent()) {
            throw new IllegalArgumentException("You have already reviewed this product");
        }

        Review review = Review.builder()
                .product(product)
                .reviewer(reviewer)
                .rating(dto.getRating())
                .title(dto.getTitle())
                .comment(dto.getComment())
                .verified(false)
                .build();

        review = reviewRepository.save(review);

        // Update product rating
        updateProductRating(product);

        return review;
    }

    public Review updateReview(Long reviewId, CreateReviewDto dto, User reviewer) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        if (!review.getReviewer().getId().equals(reviewer.getId())) {
            throw new IllegalArgumentException("You can only update your own reviews");
        }

        review.setRating(dto.getRating());
        review.setTitle(dto.getTitle());
        review.setComment(dto.getComment());

        review = reviewRepository.save(review);

        // Update product rating
        updateProductRating(review.getProduct());

        return review;
    }

    public void deleteReview(Long reviewId, User reviewer) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        if (!review.getReviewer().getId().equals(reviewer.getId())) {
            throw new IllegalArgumentException("You can only delete your own reviews");
        }

        Product product = review.getProduct();
        reviewRepository.delete(review);

        // Update product rating
        updateProductRating(product);
    }

    public Page<Review> getProductReviews(Long productId, Pageable pageable) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        
        return reviewRepository.findByProduct(product, pageable);
    }

    public List<Review> getProductReviewsList(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        
        return reviewRepository.findByProduct(product);
    }

    public Review getReviewById(Long reviewId) {
        return reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
    }

    public Optional<Review> getUserProductReview(Long productId, User reviewer) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        
        return reviewRepository.findByProductAndReviewer(product, reviewer);
    }

    public void verifyReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        
        review.setVerified(true);
        reviewRepository.save(review);
    }

    private void updateProductRating(Product product) {
        Double averageRating = reviewRepository.getAverageRating(product);
        long totalReviews = reviewRepository.findByProduct(product).size();

        product.setRatingAverage(averageRating != null ? averageRating : 0.0);
        product.setTotalReviews(totalReviews);

        productRepository.save(product);
    }

    public ReviewResponseDto convertToDto(Review review) {
        return ReviewResponseDto.builder()
                .id(review.getId())
                .rating(review.getRating())
                .title(review.getTitle())
                .comment(review.getComment())
                .reviewer(userService.convertToDto(review.getReviewer()))
                .verified(review.getVerified())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
