package com.mi_web.app.controllers;

import com.mi_web.app.dtos.auth.OrderRequest;
import com.mi_web.app.models.Order;
import com.mi_web.app.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<Long> createOrder(@RequestBody OrderRequest request,
                                            @RequestParam Long userId) {
        Order newOrder = orderService.createOrder(request, userId);
        return ResponseEntity.ok(newOrder.getId());
    }
}