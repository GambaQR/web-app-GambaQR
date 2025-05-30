package com.mi_web.app.dtos.auth;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private Long restaurantId;
    private List<OrderItemRequest> items;
}


