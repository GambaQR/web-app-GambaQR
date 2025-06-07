package com.mi_web.app.services;

import com.mi_web.app.dtos.auth.order.PaymentRequestDTO;
import com.mi_web.app.dtos.auth.order.PaymentResponseDTO;
import com.mi_web.app.models.Order;
import com.mi_web.app.models.OrderDetail;
import com.mi_web.app.models.Payment;
import com.mi_web.app.repositories.OrderDetailRepository;
import com.mi_web.app.repositories.OrderRepository;
import com.mi_web.app.repositories.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    @Value("${stripe.secret.key}") // ✅ Inyectar la clave desde application.properties
    private String stripeSecretKey;


    @Transactional
    public PaymentResponseDTO processPayment(PaymentRequestDTO request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Orden no encontrada"));

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(calculateOrderTotal(order));
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentStatus("COMPLETED");
        payment.setCreatedAt(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);

        return mapToResponse(savedPayment);
    }

    public String createPaymentIntent(BigDecimal amount, String currency) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount.multiply(new BigDecimal(100)).longValue()) // Stripe usa centavos
                .setCurrency(currency)
                .addPaymentMethodType("card")
                .build();

        PaymentIntent intent = PaymentIntent.create(params);
        return intent.getClientSecret();
    }


    private BigDecimal calculateOrderTotal(Order order) {
        return orderDetailRepository.findByOrder(order)
                .stream()
                .map(OrderDetail::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public PaymentResponseDTO getPaymentByOrder(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Pago no encontrado"));
        return mapToResponse(payment);
    }

    public List<PaymentResponseDTO> getPaymentsByUser(Long userId) {
        List<Payment> payments = paymentRepository.findByOrder_UserId(userId);
        return payments.stream().map(this::mapToResponse).toList();
    }

    @Transactional
    public PaymentResponseDTO updatePayment(Long id, PaymentRequestDTO request) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pago no encontrado"));

        Order order = payment.getOrder();

        payment.setAmount(calculateOrderTotal(order));
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentStatus("UPDATED");
        return mapToResponse(paymentRepository.save(payment));
    }

    @Transactional
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pago no encontrado"));
        paymentRepository.delete(payment);
    }

    private PaymentResponseDTO mapToResponse(Payment payment) {
        return new PaymentResponseDTO(payment.getId(), payment.getOrder().getId(),
                payment.getAmount(), payment.getPaymentMethod(), payment.getPaymentStatus(), payment.getCreatedAt());
    }
}
