package com.mi_web.app.repositories;

import com.mi_web.app.models.ComboPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComboPromotionRepository extends JpaRepository<ComboPromotion, Integer> {
    List<ComboPromotion> findByPromotionId(Integer promotionId);
}