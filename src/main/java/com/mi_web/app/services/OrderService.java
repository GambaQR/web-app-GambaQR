package com.mi_web.app.services;

import com.mi_web.app.dtos.auth.order.OrderRequestDTO;
import com.mi_web.app.dtos.auth.order.OrderResponseDTO;
import com.mi_web.app.dtos.auth.order.OrderDetailDTO;
import com.mi_web.app.dtos.auth.order.OrderDetailSimplifiedDTO;
import com.mi_web.app.models.*;
import com.mi_web.app.repositories.*;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final ComboRepository comboRepository;
    private final ProductPromotionRepository productPromotionRepository;
    private final ComboPromotionRepository comboPromotionRepository;

    public OrderResponseDTO createOrder(OrderRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new IllegalArgumentException("Restaurante no encontrado"));

        Order order = new Order();
        order.setUser(user);
        order.setRestaurant(restaurant);
        order.setTableNumber(request.getTableNumber());
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);
        associateOrderDetails(savedOrder, request.getOrderDetails());

        return mapToResponse(savedOrder);
    }

    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<OrderResponseDTO> getOrdersByUser(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream().map(this::mapToResponse).toList();
    }

    public Optional<OrderResponseDTO> getOrderById(Integer id) {
        return orderRepository.findById(id).map(this::mapToResponse);
    }

    public OrderResponseDTO updateOrder(Integer id, OrderRequestDTO request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Orden no encontrada"));

        order.setTableNumber(request.getTableNumber());
        order.setUpdatedAt(LocalDateTime.now());

        orderDetailRepository.deleteByOrder(order);
        associateOrderDetails(order, request.getOrderDetails());

        return mapToResponse(orderRepository.save(order));
    }

    public void deleteOrder(Integer id) {
        orderRepository.deleteById(id);
    }

    private void associateOrderDetails(Order order, List<OrderDetailDTO> details) {
    List<OrderDetail> orderDetails = details.stream()
            .map(dto -> {
                OrderDetail detail = new OrderDetail();
                detail.setOrder(order);
                detail.setQuantity(dto.getQuantity());

                if (dto.getProductId() != null) { 
                    Product product = productRepository.findById(dto.getProductId())
                            .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));

                    BigDecimal price = applyPromotionToProduct(product); 
                    detail.setProduct(product);
                    detail.setPrice(price);
                    detail.setTotal(price.multiply(BigDecimal.valueOf(dto.getQuantity())));
                } else if (dto.getComboId() != null) { 
                    Combo combo = comboRepository.findById(dto.getComboId())
                            .orElseThrow(() -> new IllegalArgumentException("Combo no encontrado"));

                    BigDecimal price = applyPromotionToCombo(combo); 
                    detail.setCombo(combo);
                    detail.setPrice(price);
                    detail.setTotal(price.multiply(BigDecimal.valueOf(dto.getQuantity())));
                }

                return detail;
            }).toList();

    orderDetailRepository.saveAll(orderDetails);
}
private BigDecimal applyPromotionToProduct(Product product) {
    Optional<ProductPromotion> activePromotion = productPromotionRepository.findByProductId(product.getId())
            .stream()
            .filter(pp -> pp.getPromotion().getIsActive()) 
            .findFirst();

    return activePromotion.map(pp -> 
        product.getPrice().subtract(product.getPrice().multiply(pp.getPromotion().getDiscount().divide(BigDecimal.valueOf(100)))))
        .orElse(product.getPrice());
}

private BigDecimal applyPromotionToCombo(Combo combo) {
    Optional<ComboPromotion> activePromotion = comboPromotionRepository.findByComboId(combo.getId())
            .stream()
            .filter(cp -> cp.getPromotion().getIsActive())
            .findFirst();

    return activePromotion.map(cp -> 
        combo.getPrice().subtract(combo.getPrice().multiply(cp.getPromotion().getDiscount().divide(BigDecimal.valueOf(100)))))
        .orElse(combo.getPrice());
}


   private OrderResponseDTO mapToResponse(Order order) {
    List<OrderDetailSimplifiedDTO> products = orderDetailRepository.findByOrder(order)
            .stream()
            .filter(detail -> detail.getProduct() != null)
            .map(detail -> {
                OrderDetailSimplifiedDTO dto = new OrderDetailSimplifiedDTO();
                dto.setId(detail.getId());
                dto.setProductId(detail.getProduct().getId());
                dto.setProductName(detail.getProduct().getName());
                dto.setQuantity(detail.getQuantity());
                dto.setPrice(detail.getPrice().setScale(2, RoundingMode.HALF_UP)); // solo 2 decimales
                dto.setTotal(detail.getTotal().setScale(2, RoundingMode.HALF_UP)); 
                return dto;
            })
            .toList();

    List<OrderDetailSimplifiedDTO> combos = orderDetailRepository.findByOrder(order)
            .stream()
            .filter(detail -> detail.getCombo() != null)
            .map(detail -> {
                OrderDetailSimplifiedDTO dto = new OrderDetailSimplifiedDTO();
                dto.setId(detail.getId());
                dto.setComboId(detail.getCombo().getId());
                dto.setComboName(detail.getCombo().getName());
                dto.setQuantity(detail.getQuantity());
                dto.setPrice(detail.getPrice().setScale(2, RoundingMode.HALF_UP)); 
                dto.setTotal(detail.getTotal().setScale(2, RoundingMode.HALF_UP)); 
                return dto;
            })
            .toList();

    BigDecimal totalAmount = products.stream()
            .map(OrderDetailSimplifiedDTO::getTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add)
            .add(combos.stream()
            .map(OrderDetailSimplifiedDTO::getTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add)).setScale(2, RoundingMode.HALF_UP);

    return new OrderResponseDTO(order.getId(), order.getUser().getId(), order.getRestaurant().getId(),
            order.getTableNumber(), order.getStatus(), order.getCreatedAt(), order.getUpdatedAt(), totalAmount, products, combos);
}

}
