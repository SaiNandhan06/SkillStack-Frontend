package com.skillstack.controller;

import com.skillstack.dto.response.UserResponse;
import com.skillstack.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")   // All endpoints in this controller require ADMIN
public class AdminUserController {

    private final UserService userService;

    /**
     * GET /api/v1/admin/users
     * Returns all registered users on the platform.
     */
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * PUT /api/v1/admin/users/{userId}/role
     * Toggles the user between USER and ADMIN roles.
     */
    @PutMapping("/{userId}/role")
    public ResponseEntity<UserResponse> toggleRole(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.toggleRole(userId));
    }

    /**
     * DELETE /api/v1/admin/users/{userId}
     * Permanently deletes a user account and all associated data (cascade).
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
