package com.mi_web.app.repositories;

import com.mi_web.app.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByRestaurantId(Integer restaurantId);

    List<Order> findByUserId(Integer userId);

    List<Order> findByUserId(Long userId);
}