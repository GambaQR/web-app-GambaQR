package com.mi_web.app.dtos.auth;

import lombok.Data;

@Data
public class QrCodeRequest {
    private Long restaurantId;
    private Integer tableNumber;
    private String qrUrl;
    private Boolean isGeneral;
}
