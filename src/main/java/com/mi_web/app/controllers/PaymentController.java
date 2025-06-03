package com.mi_web.app.controllers;
import com.mi_web.app.dtos.auth.PaymentRequest;
import com.mi_web.app.models.Order;
import com.mi_web.app.models.Payment;
import com.mi_web.app.repositories.OrderRepository;
import com.mi_web.app.repositories.PaymentRepository;
import com.mi_web.app.repositories.RestaurantRepository;
import com.mi_web.app.services.PaymentService;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private PaymentRepository paymentRepository;

    @PostMapping("/create-payment-intent")
    public String createPaymentIntent(@RequestParam Long amount, @RequestParam String currency) throws StripeException {
        return paymentService.createPaymentIntent(amount, currency);
    }

    @PostMapping("/save")
    public ResponseEntity<String> savePayment(@RequestBody PaymentRequest request) {
        Optional<Order> orderOpt = orderRepository.findById(request.getOrderId());

        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }

        Payment payment = new Payment();
        payment.setOrder(orderOpt.get());
        payment.setAmount(BigDecimal.valueOf(request.getAmount()));
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentStatus(request.getPaymentStatus());

        paymentRepository.save(payment);
        return ResponseEntity.ok("Payment saved successfully");
    }

}
