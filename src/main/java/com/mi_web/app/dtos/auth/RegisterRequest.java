package com.mi_web.app.dtos.auth;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String role;
    private String firstName;
    private String lastName;
    private String address;
    private String phone;
    private String email;
    private Long restaurantId;
}