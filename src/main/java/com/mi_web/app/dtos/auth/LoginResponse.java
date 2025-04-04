package com.mi_web.app.dtos.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String username;
    private String role;
    private String token;
    private Long userId;
}
