package com.mi_web.app.dtos.auth;

import lombok.Data;

@Data
public class UpdatePasswordRequest {
    private String username;
    private String oldPassword;
    private String newPassword;
}
