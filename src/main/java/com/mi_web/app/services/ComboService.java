package com.mi_web.app.services;

import com.mi_web.app.dtos.auth.combo.*;
import com.mi_web.app.models.*;
import com.mi_web.app.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComboService {

    private final ComboRepository comboRepository;
    private final ComboProductRepository comboProductRepository;
    private final ProductRepository productRepository;
    private final RestaurantRepository restaurantRepository;

    public ComboResponse createCombo(ComboRequest request) {
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new IllegalArgumentException("Restaurante no encontrado"));

        Combo combo = new Combo();
        combo.setName(request.getName());
        combo.setDescription(request.getDescription());
        combo.setPrice(request.getPrice());
        combo.setRestaurant(restaurant);
        combo.setCreatedAt(LocalDateTime.now());

        Combo savedCombo = comboRepository.save(combo);

        List<ComboProduct> comboProducts = request.getProducts().stream().map(p -> {
            Product product = productRepository.findById(p.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));

            ComboProduct cp = new ComboProduct();
            cp.setCombo(savedCombo);
            cp.setProduct(product);
            cp.setQuantity(p.getQuantity());
            return cp;
        }).collect(Collectors.toList());

        comboProductRepository.saveAll(comboProducts);

        return toComboResponse(savedCombo, comboProducts);
    }


    public List<ComboResponse> getAllCombos() {
        List<Combo> combos = comboRepository.findAll();
        return combos.stream()
                .map(combo -> toComboResponse(combo, comboProductRepository.findByCombo(combo)))
                .collect(Collectors.toList());
    }

    public Optional<ComboResponse> getComboById(Long id) {
        return comboRepository.findById(id)
                .map(combo -> toComboResponse(combo, comboProductRepository.findByCombo(combo)));
    }

    public List<ComboResponse> getCombosByRestaurant(Long restaurantId) {
        List<Combo> combos = comboRepository.findByRestaurantId(restaurantId);
        return combos.stream()
                .map(combo -> toComboResponse(combo, comboProductRepository.findByCombo(combo)))
                .collect(Collectors.toList());
    }
    @Transactional
    public ComboResponse updateCombo(Long id, ComboRequest request) {
        Combo combo = comboRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Combo no encontrado"));

        combo.setName(request.getName());
        combo.setDescription(request.getDescription());
        combo.setPrice(request.getPrice());

        Combo updatedCombo = comboRepository.save(combo);

        comboProductRepository.deleteByCombo(updatedCombo);

        List<ComboProduct> newComboProducts = request.getProducts().stream().map(p -> {
            Product product = productRepository.findById(p.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));

            ComboProduct cp = new ComboProduct();
            cp.setCombo(updatedCombo);
            cp.setProduct(product);
            cp.setQuantity(p.getQuantity());
            return cp;
        }).collect(Collectors.toList());

        comboProductRepository.saveAll(newComboProducts);

        return toComboResponse(updatedCombo, newComboProducts);
    }


    public void deleteCombo(Long id) {
        Combo combo = comboRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Combo no encontrado"));

        comboProductRepository.deleteByCombo(combo);
        comboRepository.delete(combo);
    }

    private ComboResponse toComboResponse(Combo combo, List<ComboProduct> comboProducts) {
        ComboResponse response = new ComboResponse();
        response.setId(combo.getId());
        response.setName(combo.getName());
        response.setDescription(combo.getDescription());
        response.setPrice(combo.getPrice());
        response.setRestaurantId(combo.getRestaurant().getId());

        List<ComboProductDetailDTO> productDetails = comboProducts.stream().map(cp -> {
            ComboProductDetailDTO detail = new ComboProductDetailDTO();
            detail.setProductId(cp.getProduct().getId());
            detail.setProductName(cp.getProduct().getName());
            detail.setQuantity(cp.getQuantity());
            return detail;
        }).collect(Collectors.toList());

        response.setProducts(productDetails);
        return response;
    }
}
