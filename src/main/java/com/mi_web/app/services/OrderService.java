package com.mi_web.app.services;

import com.mi_web.app.dtos.auth.OrderItemRequest;
import com.mi_web.app.dtos.auth.OrderRequest;
import com.mi_web.app.models.*;
import com.mi_web.app.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    public Order createOrder(OrderRequest orderRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Restaurant restaurant = restaurantRepository.findById(orderRequest.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurante no encontrado"));

        Order order = new Order();
        order.setOrderCode(UUID.randomUUID().toString().substring(0, 8)); // ejemplo simple
        order.setUser(user);
        order.setRestaurant(restaurant);
        order.setTableNumber(1); // puedes ajustarlo
        order.setStatus("PENDING");

        Order savedOrder = orderRepository.save(order);

        for (OrderItemRequest item : orderRequest.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            OrderDetail detail = new OrderDetail();
            detail.setOrder(savedOrder);
            detail.setProduct(product);
            detail.setQuantity(item.getQuantity());
            detail.setPrice(product.getPrice());
            detail.setTotal(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            detail.setStatus("REQUESTED");

            orderDetailRepository.save(detail);
        }

        return savedOrder;
    }
}