package com.skillstack.controller;

import com.skillstack.dto.request.GoalRequest;
import com.skillstack.dto.response.GoalResponse;
import com.skillstack.entity.User;
import com.skillstack.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    /**
     * GET /api/v1/goals
     */
    @GetMapping
    public ResponseEntity<List<GoalResponse>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(goalService.getAll(user));
    }

    /**
     * POST /api/v1/goals
     * Body: { title, status?, targetDate? }
     */
    @PostMapping
    public ResponseEntity<GoalResponse> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody GoalRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(goalService.create(user, req));
    }

    /**
     * PUT /api/v1/goals/{id}
     * Body: { title?, status?, targetDate? }
     */
    @PutMapping("/{id}")
    public ResponseEntity<GoalResponse> update(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody GoalRequest req) {
        return ResponseEntity.ok(goalService.update(user, id, req));
    }

    /**
     * DELETE /api/v1/goals/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        goalService.delete(user, id);
        return ResponseEntity.noContent().build();
    }
}
