package com.mi_web.app.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mi_web.app.dtos.auth.ProductRequest;
import com.mi_web.app.dtos.auth.ProductResponse;
import com.mi_web.app.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

      

    @GetMapping("/all")
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    @PostMapping("/create")
    public ResponseEntity<?> createProduct(@RequestParam("product") String productJson, @RequestParam("image") MultipartFile imageFile) {
        try {
            ProductRequest request = new ObjectMapper().readValue(productJson, ProductRequest.class);
            // Aquí estamos pasando el MultipartFile (imagen) a nuestro servicio
            ProductResponse product = productService.createProduct(request, imageFile);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        Optional<ProductResponse> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

     @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestParam("product") String productJson, @RequestParam("image") MultipartFile imageFile) {
        try {
            ProductRequest request = new ObjectMapper().readValue(productJson, ProductRequest.class);
            ProductResponse updated = productService.updateProduct(id, request, imageFile);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProductById(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "No se puede eliminar el producto porque tiene datos asociados."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al eliminar el producto."));
        }
    }

    @GetMapping("/by-restaurant/{restaurantId}")
    public ResponseEntity<List<ProductResponse>> getProductsByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(productService.getProductsByRestaurant(restaurantId));
    }
}
