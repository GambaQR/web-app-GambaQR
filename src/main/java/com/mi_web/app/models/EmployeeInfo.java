package com.mi_web.app.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "employee_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;

    public EmployeeInfo(Long userId, Long restaurantId) {
        this.user = new User();
        this.user.setId(userId);
        this.restaurant = new Restaurant();
        this.restaurant.setId(restaurantId);
    }

}
