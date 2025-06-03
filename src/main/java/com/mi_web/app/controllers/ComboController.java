package com.mi_web.app.controllers;


import com.mi_web.app.dtos.auth.combo.ComboRequest;
import com.mi_web.app.dtos.auth.combo.ComboResponse;
import com.mi_web.app.services.ComboService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/combos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ComboController {

    private final ComboService comboService;

    @PostMapping("/create")
    public ResponseEntity<?> createCombo(@RequestBody ComboRequest request) {
        try {
            ComboResponse combo = comboService.createCombo(request);
            return ResponseEntity.ok(combo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<ComboResponse>> getAllCombos() {
        return ResponseEntity.ok(comboService.getAllCombos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getComboById(@PathVariable Long id) {
        Optional<ComboResponse> combo = comboService.getComboById(id);
        return combo.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCombo(@PathVariable Long id, @RequestBody ComboRequest request) {
        try {
            ComboResponse updated = comboService.updateCombo(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @Transactional
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCombo(@PathVariable Long id) {
        try {
            comboService.deleteCombo(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "No se puede eliminar el combo porque tiene datos asociados."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al eliminar el combo."));
        }
    }


    @GetMapping("/by-restaurant/{restaurantId}")
    public ResponseEntity<List<ComboResponse>> getCombosByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(comboService.getCombosByRestaurant(restaurantId));
    }
}
