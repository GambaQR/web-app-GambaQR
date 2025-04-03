package com.mi_web.app.services;

import com.mi_web.app.dtos.auth.RestaurantRequest;
import com.mi_web.app.dtos.auth.RestaurantResponse;
import com.mi_web.app.enums.Role;
import com.mi_web.app.exceptions.ResourceNotFoundException;
import com.mi_web.app.models.Restaurant;
import com.mi_web.app.models.User;
import com.mi_web.app.repositories.RestaurantRepository;
import com.mi_web.app.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    @Transactional
    public RestaurantResponse createRestaurant(RestaurantRequest request, String ownerUsername) {
        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Restaurant restaurant = new Restaurant();
        restaurant.setName(request.getName());
        restaurant.setAddress(request.getAddress());
        restaurant.setPhone(request.getPhone());
        restaurant.setEmail(request.getEmail());
        restaurant.setUser(owner);

        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        return convertToResponse(savedRestaurant);
    }

    public List<RestaurantResponse> getAllRestaurants() {
        return restaurantRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    public RestaurantResponse getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurante no encontrado"));
        return convertToResponse(restaurant);
    }

    @Transactional
    public RestaurantResponse updateRestaurant(Long id, RestaurantRequest request, String currentUsername) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurante no encontrado"));

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no válido"));

        // Solo el dueño o admin puede actualizar
        if (!restaurant.getUser().getUsername().equals(currentUsername) &&
                !currentUser.getRole().equals(Role.ADMIN)) {
            throw new AccessDeniedException("No tienes permisos para editar este restaurante");
        }

        restaurant.setName(request.getName());
        restaurant.setAddress(request.getAddress());
        restaurant.setPhone(request.getPhone());
        restaurant.setEmail(request.getEmail());

        return convertToResponse(restaurantRepository.save(restaurant));
    }

    @Transactional
    public void deleteRestaurant(Long id, String currentUsername) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurante no encontrado"));

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no válido"));

        if (!restaurant.getUser().getUsername().equals(currentUsername) &&
                !currentUser.getRole().equals(Role.ADMIN)) {
            throw new AccessDeniedException("No tienes permisos para eliminar este restaurante");
        }

        restaurantRepository.delete(restaurant);
    }

    private RestaurantResponse convertToResponse(Restaurant restaurant) {
        return RestaurantResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .address(restaurant.getAddress())
                .phone(restaurant.getPhone())
                .email(restaurant.getEmail())
                .createdAt(restaurant.getCreatedAt())
                .build();
    }
}