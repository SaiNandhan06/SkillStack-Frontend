package com.skillstack.controller;

import com.skillstack.dto.request.CertificationRequest;
import com.skillstack.dto.response.CertificationResponse;
import com.skillstack.entity.User;
import com.skillstack.service.CertificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/certifications")
@RequiredArgsConstructor
public class CertificationController {

    private final CertificationService certService;

    /**
     * GET /api/v1/certifications
     * Returns certifications for the authenticated user with effectiveStatus.
     */
    @GetMapping
    public ResponseEntity<List<CertificationResponse>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(certService.getAll(user));
    }

    /**
     * POST /api/v1/certifications
     * Body: { name, issuer, issueDate, expiryDate? }
     * New certs start as PENDING.
     */
    @PostMapping
    public ResponseEntity<CertificationResponse> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CertificationRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(certService.create(user, req));
    }

    /**
     * PUT /api/v1/certifications/{id}
     * Editing a cert resets its status back to PENDING.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CertificationResponse> update(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody CertificationRequest req) {
        return ResponseEntity.ok(certService.update(user, id, req));
    }

    /**
     * DELETE /api/v1/certifications/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        certService.delete(user, id);
        return ResponseEntity.noContent().build();
    }
}
