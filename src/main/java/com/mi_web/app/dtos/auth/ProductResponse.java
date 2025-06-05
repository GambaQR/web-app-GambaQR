package com.mi_web.app.dtos.auth;

import com.mi_web.app.models.Category;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private CategoryResponse category;
}
