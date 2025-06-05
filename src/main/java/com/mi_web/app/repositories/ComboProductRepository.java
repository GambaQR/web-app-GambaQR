package com.mi_web.app.repositories;

import com.mi_web.app.models.Combo;
import com.mi_web.app.models.ComboProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComboProductRepository extends JpaRepository<ComboProduct, Integer> {
    List<ComboProduct> findByCombo(Combo combo);
    void deleteByCombo(Combo combo);
}