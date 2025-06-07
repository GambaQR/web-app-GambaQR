package com.mi_web.app.controllers;


import com.mi_web.app.dtos.auth.order.PaymentRequestDTO;
import com.mi_web.app.dtos.auth.order.PaymentResponseDTO;
import com.mi_web.app.services.PaymentService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;
    @Value("${stripe.public.key}")
    private String stripePublicKey;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestParam BigDecimal amount, @RequestParam String currency) {
        try {
            String clientSecret = paymentService.createPaymentIntent(amount, currency);
            return ResponseEntity.ok(clientSecret);
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body("Error procesando el pago: " + e.getMessage());
        }
    }

    @GetMapping("/public-key")
    public ResponseEntity<String> getStripePublicKey() {
        return ResponseEntity.ok(stripePublicKey);
    }

    @PostMapping("/process")
    public ResponseEntity<PaymentResponseDTO> processPayment(@RequestBody PaymentRequestDTO request) {
        return ResponseEntity.ok(paymentService.processPayment(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentResponseDTO>> getPaymentsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getPaymentsByUser(userId));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponseDTO> getPaymentByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.getPaymentByOrder(orderId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<PaymentResponseDTO> updatePayment(@PathVariable Long id, @RequestBody PaymentRequestDTO request) {
        return ResponseEntity.ok(paymentService.updatePayment(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}