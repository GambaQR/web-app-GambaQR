package com.mi_web.app.dtos.auth.order;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequestDTO {
    private Long userId;
    private Long restaurantId;
    private Integer tableNumber;
    private List<OrderDetailDTO> orderDetails;
}