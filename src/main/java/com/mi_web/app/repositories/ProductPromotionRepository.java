package com.mi_web.app.repositories;

import com.mi_web.app.models.ProductPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductPromotionRepository extends JpaRepository<ProductPromotion, Integer> {
    List<ProductPromotion> findByPromotionId(Integer promotionId);
    List<ProductPromotion> findByProductId(Long productId);
}
