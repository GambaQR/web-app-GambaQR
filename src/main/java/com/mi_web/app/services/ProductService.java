package com.mi_web.app.services;

import com.mi_web.app.dtos.auth.CategoryResponse;
import com.mi_web.app.dtos.auth.ProductRequest;
import com.mi_web.app.dtos.auth.ProductResponse;
import com.mi_web.app.models.Category;
import com.mi_web.app.models.Product;
import com.mi_web.app.models.Restaurant;
import com.mi_web.app.repositories.CategoryRepository;
import com.mi_web.app.repositories.ProductRepository;
import com.mi_web.app.repositories.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final RestaurantRepository restaurantRepository;
    private final SupabaseService supabaseService;

    public ProductResponse createProduct(ProductRequest request, MultipartFile imageFile) throws Exception {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new IllegalArgumentException("Restaurante no encontrado"));

        Product product = new Product();
        product.setCategory(category);
        product.setRestaurant(restaurant);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setTax(request.getTax());
        product.setCurrency(request.getCurrency());

        // Subir la imagen a Supabase y obtener la URL
        String imageUrl = supabaseService.uploadImage(imageFile);  // Aquí subimos la imagen
        product.setImageUrl(imageUrl);  // Guarda la URL en el producto

        Product saved = productRepository.save(product);
        return mapToResponse(saved);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(product -> ProductResponse.builder()
                        .id(product.getId())
                        .name(product.getName())
                        .description(product.getDescription())
                        .price(product.getPrice())
                        .imageUrl(product.getImageUrl())
                        .category(CategoryResponse.builder()
                                .id(product.getCategory().getId()) // ✅ Asegurar que se incluye la categoría
                                .name(product.getCategory().getName())
                                .description(product.getCategory().getDescription())
                                .build()
                        )
                        .build())
                .toList();
    }


    public Optional<ProductResponse> getProductById(Long id) {
        return productRepository.findById(id).map(this::mapToResponse);
    }

   public ProductResponse updateProduct(Long id, ProductRequest request, MultipartFile imageFile) throws Exception {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new IllegalArgumentException("Restaurante no encontrado"));

        product.setCategory(category);
        product.setRestaurant(restaurant);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setTax(request.getTax());
        product.setCurrency(request.getCurrency());

        // Subir la nueva imagen y obtener la URL
        String imageUrl = supabaseService.uploadImage(imageFile);  // Aquí subimos la imagen
        product.setImageUrl(imageUrl);  // Guarda la URL en el producto

        return mapToResponse(productRepository.save(product));
    }

    public void deleteProductById(Long id) {
        productRepository.deleteById(id);
    }

    public List<ProductResponse> getProductsByRestaurant(Long restaurantId) {
        return productRepository.findByRestaurantId(restaurantId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .build();
    }
}
