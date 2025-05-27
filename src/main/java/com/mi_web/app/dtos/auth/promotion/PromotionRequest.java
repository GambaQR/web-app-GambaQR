package com.mi_web.app.dtos.auth.promotion;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PromotionRequest {
    private Long restaurantId;
    private String name;
    private String description;
    private BigDecimal discount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;
    private List<Long> productIds;
    private List<Long> comboIds;
}
