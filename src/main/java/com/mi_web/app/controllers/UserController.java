package com.mi_web.app.controllers;

import com.mi_web.app.dtos.auth.EmployeeDTO;
import com.mi_web.app.dtos.auth.*;
import com.mi_web.app.models.User;
import com.mi_web.app.models.EmployeeInfo;
import com.mi_web.app.models.UserInfo;
import com.mi_web.app.services.UserInfoService;
import com.mi_web.app.services.UserService;
import com.mi_web.app.services.EmployeeInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final EmployeeInfoService employeeInfoService;
    private final UserInfoService userInfoService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = this.userService.createUser(registerRequest);

            // Si el usuario tiene un restaurantId en la solicitud, lo añadimos a la tabla employee_info
            if (registerRequest.getRestaurantId() != null) {
                EmployeeInfo employeeInfo = new EmployeeInfo(user.getId(), registerRequest.getRestaurantId());
                employeeInfoService.createEmployeeInfo(employeeInfo);
            }

            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest credentials) {
        try {
            LoginResponse loginResponse = this.userService.login(credentials);
            return ResponseEntity.ok(loginResponse);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping("/check-token")
    public ResponseEntity<Boolean> checkToken(@RequestBody CheckTokenRequest checkTokenRequest) {
        boolean isValid = userService.checkToken(checkTokenRequest);
        return ResponseEntity.ok(isValid);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestParam String username) {
        Optional<UserDetailResponse> user = userService.getUserProfile(username);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody UpdatePasswordRequest request) {
        boolean updated = userService.updatePassword(
                request.getUsername(),
                request.getOldPassword(),
                request.getNewPassword()
        );

        return updated ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    @GetMapping("/employees/{restaurantId}")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByRestaurant(@PathVariable Long restaurantId) {
        List<EmployeeInfo> employeeInfos = employeeInfoService.getEmployeesByRestaurant(restaurantId);

        if (employeeInfos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // Convertir los EmployeeInfo a EmployeeDTO
        List<EmployeeDTO> employeeDTOs = employeeInfos.stream()
                .map(employeeInfo -> {
                    EmployeeDTO employeeDTO = new EmployeeDTO();
                    employeeDTO.setId(employeeInfo.getId());
                    employeeDTO.setUsername(employeeInfo.getUser().getUsername());

                    // Obtener firstName y lastName desde UserInfo
                    UserInfo userInfo = userInfoService.getUserInfoByUserId(employeeInfo.getUser().getId());
                    if (userInfo != null) {
                        employeeDTO.setFirstName(userInfo.getFirstName());
                        employeeDTO.setLastName(userInfo.getLastName());
                    }

                    // Convertir Role enum a String
                    employeeDTO.setRole(employeeInfo.getUser().getRole().toString());
                    return employeeDTO;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(employeeDTOs);
    }



    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUserById(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "No se puede eliminar el usuario porque tiene datos asociados")
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("error", "Error al eliminar el usuario")
            );
        }
    }
}
