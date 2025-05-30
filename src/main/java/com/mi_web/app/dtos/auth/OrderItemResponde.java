package com.mi_web.app.dtos.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
class OrderItemResponse {
    private String productName;
    private Integer quantity;
    private Double price;
}