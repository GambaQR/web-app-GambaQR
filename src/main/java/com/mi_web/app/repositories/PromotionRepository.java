package com.mi_web.app.repositories;

import com.mi_web.app.models.Promotion;
import com.mi_web.app.models.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Integer> {
    List<Restaurant> findByRestaurantId(Integer restaurantId);
}
