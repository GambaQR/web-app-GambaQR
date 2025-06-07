package com.mi_web.app.controllers;

import com.mi_web.app.dtos.auth.QrCodeRequest;
import com.mi_web.app.dtos.auth.QrCodeResponse;
import com.mi_web.app.dtos.auth.order.PaymentRequestDTO;
import com.mi_web.app.dtos.auth.order.PaymentResponseDTO;
import com.mi_web.app.models.QrCode;
import com.mi_web.app.services.PaymentService;
import com.mi_web.app.services.QrCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/qrcodes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QrCodeController {

    private final QrCodeService qrCodeService;

    @PostMapping("/create")
    public ResponseEntity<?> createQrCode(@RequestBody QrCodeRequest request) {
        try {
            QrCodeResponse response = qrCodeService.createQrCode(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/lookup")
    public ResponseEntity<QrCodeResponse> getQrCodeByQrUrl(@RequestParam String qrUrl) {
        Optional<QrCode> qrCode = qrCodeService.findByQrUrl(qrUrl);

        return qrCode.map(code -> ResponseEntity.ok(new QrCodeResponse(
                code.getId(),
                code.getRestaurant().getId(),
                code.getTableNumber(),
                code.getQrUrl(),
                code.getIsGeneral(),
                code.getCreatedAt()
        ))).orElse(ResponseEntity.notFound().build());
    }

}

