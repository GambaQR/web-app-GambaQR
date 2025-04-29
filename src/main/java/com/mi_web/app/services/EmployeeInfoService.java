package com.mi_web.app.services;

import com.mi_web.app.models.EmployeeInfo;
import com.mi_web.app.repositories.EmployeeInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeInfoService {

    private final EmployeeInfoRepository employeeInfoRepository;

    public void createEmployeeInfo(EmployeeInfo employeeInfo) {
        employeeInfoRepository.save(employeeInfo);
    }
    public List<EmployeeInfo> getEmployeesByRestaurant(Long restaurantId) {
        return employeeInfoRepository.findByRestaurantId(restaurantId);
    }
}
