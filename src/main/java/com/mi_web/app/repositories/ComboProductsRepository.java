package com.mi_web.app.repositories;

import com.mi_web.app.models.ComboProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComboProductsRepository extends JpaRepository<ComboProduct, Integer> {
    List<ComboProduct> findByComboId(Integer comboId);
    List<ComboProduct> findByProductId(Integer productId);
}