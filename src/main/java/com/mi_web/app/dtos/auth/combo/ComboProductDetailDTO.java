package com.mi_web.app.dtos.auth.combo;

import lombok.Data;

@Data
public class ComboProductDetailDTO {
    private Long productId;
    private String productName;
    private Integer quantity;
}
