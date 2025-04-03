package com.mi_web.app.dtos.auth;

import lombok.Data;

@Data
public class CheckTokenRequest {
    private String token;
    private String username;
}