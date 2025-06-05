package com.mi_web.app.controllers;

import com.mi_web.app.dtos.auth.RestaurantRequest;
import com.mi_web.app.dtos.auth.RestaurantResponse;
import com.mi_web.app.services.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurants")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @PostMapping("/create")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createRestaurant(
            @RequestBody RestaurantRequest request,
            @RequestParam String username // Usuario actual desde el token
    ) {
        try {
            RestaurantResponse response = restaurantService.createRestaurant(request,username);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<RestaurantResponse>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRestaurantById(@PathVariable Long id) {
        try {
            RestaurantResponse response = restaurantService.getRestaurantById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    // update restaurante (solo dueño o admin)
    @PutMapping("update/{id}")
    public ResponseEntity<?> updateRestaurant(
            @PathVariable Long id,
            @RequestBody RestaurantRequest request,
            @RequestParam String username
    ) {
        try {
            RestaurantResponse response = restaurantService.updateRestaurant(id, request, username);
            return ResponseEntity.ok(response);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Eliminar restaurante (solo dueño o admin)
    @DeleteMapping("delete/{id}")
    public ResponseEntity<?> deleteRestaurant(
            @PathVariable Long id,
            @RequestParam String username
    ) {
        try {
            restaurantService.deleteRestaurant(id, username);
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}