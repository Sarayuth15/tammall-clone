package com.tammalls.api.repository;

import com.tammalls.api.entity.Category;
import com.tammalls.api.entity.Product;
import com.tammalls.api.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategory(Category category, Pageable pageable);

    Page<Product> findBySeller(User seller, Pageable pageable);

    Page<Product> findByActive(Boolean active, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
            "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchProducts(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.active = true " +
            "ORDER BY p.ratingAverage DESC")
    List<Product> findTopProductsByCategory(@Param("category") Category category, Pageable pageable);
}
