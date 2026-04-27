package com.skillstack.service;

import com.skillstack.dto.response.CertificationResponse;
import com.skillstack.entity.Certification;
import com.skillstack.entity.User;
import com.skillstack.exception.ResourceNotFoundException;
import com.skillstack.repository.CertificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Handles file upload for certification documents.
 * Files are stored on the local filesystem under {@code app.upload.dir}.
 */
@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final CertificationRepository certRepository;

    @Value("${app.upload.dir:uploads/certifications}")
    private String uploadDir;

    // ── Public API ───────────────────────────────────────────────────────────────

    /**
     * Saves the uploaded file to disk and updates the certification record
     * with the filename and URL path.
     *
     * @param user   authenticated user (ownership check)
     * @param certId target certification ID
     * @param file   uploaded multipart file
     * @return updated {@link CertificationResponse}
     */
    @Transactional
    public CertificationResponse uploadFile(User user, Long certId, MultipartFile file) {
        Certification cert = certRepository.findByIdAndUserId(certId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Certification not found with id: " + certId));

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file must not be empty");
        }

        String contentType = file.getContentType();
        if (contentType == null ||
            (!contentType.startsWith("image/") &&
             !contentType.equals("application/pdf"))) {
            throw new IllegalArgumentException(
                "Only PDF or image files are accepted. Received: " + contentType);
        }

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // Build a unique storage filename: <certId>_<uuid>.<ext>
            String originalName = file.getOriginalFilename() != null
                    ? file.getOriginalFilename() : "cert";
            String ext = originalName.contains(".")
                    ? originalName.substring(originalName.lastIndexOf('.'))
                    : "";
            String storedName = certId + "_" + UUID.randomUUID() + ext;

            Path targetPath = uploadPath.resolve(storedName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Remove old file if one existed
            if (cert.getFileUrl() != null) {
                try {
                    Path oldFile = uploadPath.resolve(
                            Paths.get(cert.getFileUrl()).getFileName());
                    Files.deleteIfExists(oldFile);
                } catch (Exception ignored) { /* best-effort cleanup */ }
            }

            cert.setFileName(originalName);
            cert.setFileUrl("/api/v1/certifications/files/" + storedName);
            return CertificationResponse.from(certRepository.save(cert));

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

    /**
     * Resolves the absolute {@link Path} for a stored file by its storage filename.
     *
     * @param storedFileName filename as returned in {@code fileUrl}
     * @return resolved path
     */
    public Path resolveFilePath(String storedFileName) {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        return uploadPath.resolve(storedFileName).normalize();
    }
}
