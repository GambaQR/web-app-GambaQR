package com.mi_web.app.dtos.auth.combo;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ComboResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Long restaurantId;
    private List<ComboProductDetailDTO> products;
}
