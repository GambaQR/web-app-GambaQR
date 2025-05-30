package com.mi_web.app.dtos.auth;

import lombok.Data;

@Data
public class PaymentRequest {

    private Long amount;
    private String currency;
    private String paymentMethod;
    private String paymentStatus;
    private Long orderId;
}
