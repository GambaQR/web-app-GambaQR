package com.mi_web.app.services;

import com.mi_web.app.dtos.auth.promotion.PromotionRequest;
import com.mi_web.app.dtos.auth.promotion.PromotionResponse;
import com.mi_web.app.models.*;
import com.mi_web.app.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final ProductRepository productRepository;
    private final ComboRepository comboRepository;
    private final ProductPromotionRepository productPromotionRepository;
    private final ComboPromotionRepository comboPromotionRepository;
    private final RestaurantRepository restaurantRepository;

    public PromotionResponse createPromotion(PromotionRequest request) {
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new IllegalArgumentException("Restaurante no encontrado"));

        Promotion promotion = new Promotion();
        promotion.setName(request.getName());
        promotion.setDescription(request.getDescription());
        promotion.setDiscount(request.getDiscount());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setIsActive(request.getIsActive());
        promotion.setRestaurant(restaurant);

        Promotion savedPromotion = promotionRepository.save(promotion);

        // Verifica si hay productos en la promoción
        if (request.getProductIds() != null && !request.getProductIds().isEmpty()) {
            List<ProductPromotion> productPromotions = request.getProductIds().stream()
                    .map(productId -> {
                        Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));

                        ProductPromotion pp = new ProductPromotion();
                        pp.setPromotion(savedPromotion);
                        pp.setProduct(product);
                        return pp;
                    }).toList();
            productPromotionRepository.saveAll(productPromotions);
        }

        // Verifica si hay combos en la promoción
        if (request.getComboIds() != null && !request.getComboIds().isEmpty()) {
            List<ComboPromotion> comboPromotions = request.getComboIds().stream()
                    .map(comboId -> {
                        Combo combo = comboRepository.findById(comboId)
                                .orElseThrow(() -> new IllegalArgumentException("Combo no encontrado"));

                        ComboPromotion cp = new ComboPromotion();
                        cp.setPromotion(savedPromotion);
                        cp.setCombo(combo);
                        return cp;
                    }).toList();
            comboPromotionRepository.saveAll(comboPromotions);
        }

        return toResponse(savedPromotion);
    }

    public List<PromotionResponse> getAllPromotions() {
        return promotionRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PromotionResponse> getPromotionsByRestaurant(Long restaurantId) {
        return promotionRepository.findByRestaurantId(restaurantId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<PromotionResponse> getPromotionById(Long id) {
        return promotionRepository.findById(id).map(this::toResponse);
    }

    public void deletePromotion(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Promoción no encontrada"));

        productPromotionRepository.deleteAll(productPromotionRepository.findByPromotionId(promotion.getId().intValue()));
        comboPromotionRepository.deleteAll(comboPromotionRepository.findByPromotionId(promotion.getId().intValue()));
        promotionRepository.delete(promotion);
    }
    public PromotionResponse updatePromotion(Long id, PromotionRequest request) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Promoción no encontrada"));

        // Actualizamos datos básicos
        promotion.setName(request.getName());
        promotion.setDescription(request.getDescription());
        promotion.setDiscount(request.getDiscount());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setIsActive(request.getIsActive());

        Promotion updatedPromotion = promotionRepository.save(promotion);

        // Limpiamos relaciones anteriores
        productPromotionRepository.deleteAll(productPromotionRepository.findByPromotionId(id.intValue()));
        comboPromotionRepository.deleteAll(comboPromotionRepository.findByPromotionId(id.intValue()));

        // Agregamos nuevas relaciones
        if (request.getProductIds() != null) {
            List<ProductPromotion> ppList = request.getProductIds().stream()
                    .map(pid -> {
                        Product product = productRepository.findById(pid)
                                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
                        return new ProductPromotion(null, updatedPromotion, product);
                    }).collect(Collectors.toList());
            productPromotionRepository.saveAll(ppList);
        }

        if (request.getComboIds() != null) {
            List<ComboPromotion> cpList = request.getComboIds().stream()
                    .map(cid -> {
                        Combo combo = comboRepository.findById(cid)
                                .orElseThrow(() -> new IllegalArgumentException("Combo no encontrado"));
                        return new ComboPromotion(null, updatedPromotion, combo);
                    }).collect(Collectors.toList());
            comboPromotionRepository.saveAll(cpList);
        }

        return toResponse(updatedPromotion);
    }


    private PromotionResponse toResponse(Promotion promotion) {
        List<String> productNames = productPromotionRepository.findByPromotionId(promotion.getId().intValue()).stream()
                .map(pp -> pp.getProduct().getName())
                .collect(Collectors.toList());

        List<String> comboNames = comboPromotionRepository.findByPromotionId(promotion.getId().intValue()).stream()
                .map(cp -> cp.getCombo().getName())
                .collect(Collectors.toList());

        return getPromotionResponse(promotion, productNames, comboNames);
    }

    private static PromotionResponse getPromotionResponse(Promotion promotion, List<String> productNames, List<String> comboNames) {
        PromotionResponse response = new PromotionResponse();
        response.setId(promotion.getId());
        response.setName(promotion.getName());
        response.setDescription(promotion.getDescription());
        response.setDiscount(promotion.getDiscount());
        response.setStartDate(promotion.getStartDate());
        response.setEndDate(promotion.getEndDate());
        response.setIsActive(promotion.getIsActive());
        response.setRestaurantId(Math.toIntExact(promotion.getRestaurant().getId()));
        response.setProducts(productNames);
        response.setCombos(comboNames);
        return response;
    }
}
