package com.skillstack.controller;

import com.skillstack.dto.request.CertificationRequest;
import com.skillstack.dto.response.CertificationResponse;
import com.skillstack.entity.User;
import com.skillstack.service.CertificationService;
import com.skillstack.service.FileStorageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/v1/certifications")
@RequiredArgsConstructor
public class CertificationController {

    private final CertificationService certService;
    private final FileStorageService fileStorageService;

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

    // ── File upload ──────────────────────────────────────────────────────────────

    /**
     * POST /api/v1/certifications/{id}/upload
     * Multipart: file=<PDF or image>
     * Attaches a digital copy of the certificate document to the record.
     */
    @PostMapping(value = "/{id}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CertificationResponse> uploadFile(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        CertificationResponse response = fileStorageService.uploadFile(user, id, file);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/certifications/files/{filename}
     * Serves a previously uploaded certificate file for download/view.
     */
    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path filePath = fileStorageService.resolveFilePath(filename);
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }
            String contentType = determineContentType(filename);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resource.getFilename() + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────────────────

    private String determineContentType(String filename) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".pdf"))  return "application/pdf";
        if (lower.endsWith(".png"))  return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".gif"))  return "image/gif";
        if (lower.endsWith(".webp")) return "image/webp";
        return "application/octet-stream";
    }
}
