package com.skillstack.controller;

import com.skillstack.dto.request.VerifyRequest;
import com.skillstack.dto.response.CertificationResponse;
import com.skillstack.dto.response.NotificationResponse;
import com.skillstack.entity.Certification;
import com.skillstack.service.CertificationService;
import com.skillstack.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/certifications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCertificationController {

    private final CertificationService certService;
    private final NotificationService notificationService;

    /**
     * GET /api/v1/admin/certifications
     * Fetches all certifications across all users (global view).
     */
    @GetMapping
    public ResponseEntity<List<CertificationResponse>> getAllGlobal() {
        return ResponseEntity.ok(certService.getAllGlobal());
    }

    /**
     * PUT /api/v1/admin/certifications/{certId}/verify
     * Body: { status: "verified" | "rejected" }
     * Accepts or rejects a pending certification.
     */
    @PutMapping("/{certId}/verify")
    public ResponseEntity<CertificationResponse> verify(
            @PathVariable Long certId,
            @Valid @RequestBody VerifyRequest req) {
        return ResponseEntity.ok(certService.verify(certId, req));
    }

    /**
     * POST /api/v1/admin/certifications/{certId}/remind
     * Sends a renewal reminder notification to the owner of the certification.
     * Typically called when an admin sees an expiring/expired cert.
     */
    @PostMapping("/{certId}/remind")
    public ResponseEntity<NotificationResponse> sendReminder(@PathVariable Long certId) {
        Certification cert = certService.getRawById(certId);
        NotificationResponse notification = notificationService.sendRenewalReminder(
                cert.getUser(),
                cert.getName()
        );
        return ResponseEntity.ok(notification);
    }

    /**
     * POST /api/v1/admin/notifications
     * Body: { userId, message }
     * Sends a custom notification directly to any user.
     */
    @PostMapping("/notifications")
    public ResponseEntity<NotificationResponse> sendNotification(
            @RequestBody AdminNotificationRequest req) {
        return ResponseEntity.ok(
                notificationService.createForUser(req.userId(), req.message())
        );
    }

    // Inline record for the admin notification body
    public record AdminNotificationRequest(Long userId, String message) {}
}
