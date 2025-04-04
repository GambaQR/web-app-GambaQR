package com.mi_web.app.dtos.auth;

import lombok.Data;

@Data
public class RestaurantRequest {
    private String name;
    private String address;
    private String phone;
    private String email;
}