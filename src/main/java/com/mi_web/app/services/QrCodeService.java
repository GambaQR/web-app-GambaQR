package com.mi_web.app.services;

import com.mi_web.app.dtos.auth.QrCodeRequest;
import com.mi_web.app.dtos.auth.QrCodeResponse;
import com.mi_web.app.models.QrCode;
import com.mi_web.app.models.Restaurant;
import com.mi_web.app.repositories.QrCodeRepository;
import com.mi_web.app.repositories.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QrCodeService {

    private final QrCodeRepository qrCodeRepository;
    private final RestaurantRepository restaurantRepository; // Para asociar el QR con un restaurante

    public QrCodeResponse createQrCode(QrCodeRequest request) {
        // Buscar el restaurante por ID
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurante no encontrado"));

        // Crear el QR Code
        QrCode qrCode = new QrCode();
        qrCode.setRestaurant(restaurant);
        qrCode.setTableNumber(request.getTableNumber());
        qrCode.setQrUrl(request.getQrUrl());
        qrCode.setIsGeneral(request.getIsGeneral());

        // Guardar el QR en la base de datos
        QrCode savedQrCode = qrCodeRepository.save(qrCode);

        // Retornar la respuesta
        return new QrCodeResponse(
                savedQrCode.getId(),
                restaurant.getId(),
                savedQrCode.getTableNumber(),
                savedQrCode.getQrUrl(),
                savedQrCode.getIsGeneral(),
                savedQrCode.getCreatedAt()
        );
    }
}

