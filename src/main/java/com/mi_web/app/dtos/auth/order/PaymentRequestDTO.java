package com.mi_web.app.dtos.auth.order;
import lombok.Data;

@Data
public class PaymentRequestDTO {
    private Integer orderId;
    private String paymentMethod;
}