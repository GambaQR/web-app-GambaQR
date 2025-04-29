package com.mi_web.app.repositories;

import com.mi_web.app.models.EmployeeInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeInfoRepository extends JpaRepository<EmployeeInfo, Long> {
    List<EmployeeInfo> findByUserId(Long userId);
    List<EmployeeInfo> findByRestaurantId(Long restaurantId);
}