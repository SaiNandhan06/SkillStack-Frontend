package com.skillstack.controller;

import com.skillstack.dto.response.NotificationResponse;
import com.skillstack.entity.User;
import com.skillstack.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * GET /api/v1/notifications
     * Returns user's notifications sorted newest-first.
     */
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(notificationService.getAll(user));
    }

    /**
     * PUT /api/v1/notifications/{id}/read
     * Marks a single notification as read. Returns the updated notification.
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markRead(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markRead(user, id));
    }
}
