package com.mi_web.app.dtos.auth.order;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class OrderResponseDTO {
    private Long id;
    private Long userId;
    private Long restaurantId;
    private Integer tableNumber;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private BigDecimal totalAmount;
    private List<OrderDetailSimplifiedDTO> products;
    private List<OrderDetailSimplifiedDTO> combos;
    
}
