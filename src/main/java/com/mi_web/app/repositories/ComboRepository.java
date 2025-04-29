package com.mi_web.app.repositories;

import com.mi_web.app.models.Combo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComboRepository extends JpaRepository<Combo, Long> {
    List<Combo> findByRestaurantId(Long restaurantId);
}
