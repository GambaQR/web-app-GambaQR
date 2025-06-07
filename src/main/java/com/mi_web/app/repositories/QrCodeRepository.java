package com.mi_web.app.repositories;

import com.mi_web.app.models.QrCode;
import com.mi_web.app.models.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QrCodeRepository extends JpaRepository<QrCode, Integer> {
    Optional<QrCode> findByRestaurantId(Long restaurantId);
    Optional<QrCode> findByQrUrl(String qrUrl);

}
