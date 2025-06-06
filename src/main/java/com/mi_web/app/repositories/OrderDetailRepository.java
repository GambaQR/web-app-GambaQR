package com.mi_web.app.repositories;

import com.mi_web.app.models.Order;
import com.mi_web.app.models.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

    List<OrderDetail> findByOrderId(Integer orderId);
    List<OrderDetail> findByProductId(Integer productId);
    List<OrderDetail> findByOrder(Order order);
    List<OrderDetail> findByOrderId(Long orderId);
    void deleteByOrder(Order order);

}