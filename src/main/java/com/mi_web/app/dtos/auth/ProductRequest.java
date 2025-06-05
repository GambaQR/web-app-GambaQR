package com.mi_web.app.dtos.auth;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    private Long categoryId;
    private Long restaurantId;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal tax;
    private String currency;
    private String imageUrl;
}
