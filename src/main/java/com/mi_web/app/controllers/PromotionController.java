package com.mi_web.app.controllers;

import com.mi_web.app.dtos.auth.promotion.PromotionRequest;
import com.mi_web.app.dtos.auth.promotion.PromotionResponse;
import com.mi_web.app.services.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/promotions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PromotionController {

    private final PromotionService promotionService;

    @PostMapping("/create")
    public ResponseEntity<?> createPromotion(@RequestBody PromotionRequest request) {
        try {
            PromotionResponse created = promotionService.createPromotion(request);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<PromotionResponse>> getAllPromotions() {
        return ResponseEntity.ok(promotionService.getAllPromotions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPromotionById(@PathVariable Long id) {
        return promotionService.getPromotionById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/by-restaurant/{restaurantId}")
    public ResponseEntity<List<PromotionResponse>> getPromotionsByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(promotionService.getPromotionsByRestaurant(restaurantId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePromotion(@PathVariable Long id, @RequestBody PromotionRequest request) {
        try {
            PromotionResponse updated = promotionService.updatePromotion(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePromotion(@PathVariable Long id) {
        try {
            promotionService.deletePromotion(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "No se puede eliminar la promoción porque tiene datos asociados."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al eliminar la promoción."));
        }
    }
}
