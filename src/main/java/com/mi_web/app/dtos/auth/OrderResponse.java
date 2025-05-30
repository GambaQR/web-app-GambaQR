package com.mi_web.app.dtos.auth;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private String orderCode;
    private String status;
    private Double total;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
}

