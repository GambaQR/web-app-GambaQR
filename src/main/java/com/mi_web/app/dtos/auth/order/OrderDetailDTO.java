package com.mi_web.app.dtos.auth.order;

import lombok.Data;

@Data
public class OrderDetailDTO {
    private Long productId;
    private Long comboId;
    private Integer quantity;
}