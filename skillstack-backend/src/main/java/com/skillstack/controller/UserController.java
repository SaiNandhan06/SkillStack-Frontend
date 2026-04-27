package com.skillstack.controller;

import com.skillstack.dto.request.UserUpdateRequest;
import com.skillstack.dto.response.UserResponse;
import com.skillstack.entity.User;
import com.skillstack.service.UserService;
import com.skillstack.dto.request.ChangePasswordRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * GET /api/v1/users/me
     * Returns the authenticated user's full profile + settings.
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getMe(user));
    }

    /**
     * PUT /api/v1/users/me
     * Body: { name?, bio?, location?, roleTitle?, isPublic? }
     * All fields optional — only provided fields are updated.
     */
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(
            @AuthenticationPrincipal User user,
            @RequestBody UserUpdateRequest req) {
        return ResponseEntity.ok(userService.updateMe(user, req));
    }

    /**
     * PUT /api/v1/users/me/password
     * Body: { currentPassword, newPassword }
     * Changes the user's password securely.
     */
    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest req) {
        userService.changePassword(user, req.currentPassword, req.newPassword);
        return ResponseEntity.noContent().build();
    }
}
