package com.mi_web.app.dtos.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class QrCodeResponse {
    private Long id;
    private Long restaurantId;
    private Integer tableNumber;
    private String qrUrl;
    private Boolean isGeneral;
    private LocalDateTime createdAt;
}
