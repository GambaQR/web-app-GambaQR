package com.mi_web.app.dtos.auth.order;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderDetailSimplifiedDTO {
    private Long id;
    private Long productId;
    private String productName;
    private Long comboId;
    private String comboName;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal total;
}