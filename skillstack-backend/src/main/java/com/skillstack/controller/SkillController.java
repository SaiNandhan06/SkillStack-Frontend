package com.skillstack.controller;

import com.skillstack.dto.request.SkillRequest;
import com.skillstack.dto.response.SkillResponse;
import com.skillstack.entity.User;
import com.skillstack.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    /**
     * GET /api/v1/skills
     * Returns all skills belonging to the authenticated user.
     */
    @GetMapping
    public ResponseEntity<List<SkillResponse>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(skillService.getAll(user));
    }

    /**
     * POST /api/v1/skills
     * Body: { name, category, proficiency }
     */
    @PostMapping
    public ResponseEntity<SkillResponse> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody SkillRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(skillService.create(user, req));
    }

    /**
     * PUT /api/v1/skills/{id}
     * Body: { name?, category?, proficiency? }
     */
    @PutMapping("/{id}")
    public ResponseEntity<SkillResponse> update(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody SkillRequest req) {
        return ResponseEntity.ok(skillService.update(user, id, req));
    }

    /**
     * DELETE /api/v1/skills/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        skillService.delete(user, id);
        return ResponseEntity.noContent().build();
    }
}
