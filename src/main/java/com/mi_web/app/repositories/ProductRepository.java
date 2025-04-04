package com.mi_web.app.repositories;

import com.mi_web.app.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByRestaurantId(Integer restaurantId);
    List<Product> findByCategoryId(Integer categoryId);
}