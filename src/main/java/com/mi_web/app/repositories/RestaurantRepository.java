package com.mi_web.app.repositories;

import com.mi_web.app.models.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    @Override
    Optional<Restaurant> findById(Long id);

}
