package com.mi_web.app.dtos.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDetailResponse {
    private String firstName;
    private String lastName;
    private String address;
    private String phone;
    private String email;
}