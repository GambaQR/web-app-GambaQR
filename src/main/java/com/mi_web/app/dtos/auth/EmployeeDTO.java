package com.mi_web.app.dtos.auth;

import lombok.Data;

@Data
public class EmployeeDTO {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String role;
}
