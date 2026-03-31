package com.tammalls.api.repository;

import com.tammalls.api.entity.Product;
import com.tammalls.api.entity.Review;
import com.tammalls.api.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct(Product product);

    Optional<Review> findByProductAndReviewer(Product product, User reviewer);

    Page<Review> findByProduct(Product product, Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product = :product")
    Double getAverageRating(@Param("product") Product product);
}
