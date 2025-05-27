package com.mi_web.app.repositories;

import com.mi_web.app.models.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    List<Promotion> findByRestaurantId(Long restaurantId);
}
