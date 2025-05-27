package com.mi_web.app.dtos.auth.order;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentResponseDTO {
    private Long id;
    private Long orderId;
    private BigDecimal amount;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime createdAt;

    public PaymentResponseDTO(Long id, Long orderId, BigDecimal amount, String paymentMethod, String paymentStatus, LocalDateTime createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.createdAt = createdAt;
    }
}
