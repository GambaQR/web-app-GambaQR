package com.mi_web.app.dtos.auth;

import lombok.Data;


@Data
public class LoginRequest {
    private String username;
    private String password;
}