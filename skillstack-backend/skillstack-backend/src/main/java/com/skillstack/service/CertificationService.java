package com.skillstack.service;

import com.skillstack.dto.request.CertificationRequest;
import com.skillstack.dto.request.VerifyRequest;
import com.skillstack.dto.response.CertificationResponse;
import com.skillstack.entity.Certification;
import com.skillstack.entity.User;
import com.skillstack.exception.ResourceNotFoundException;
import com.skillstack.repository.CertificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificationService {

    private final CertificationRepository certRepository;

    // ── User operations ───────────────────────────────────────────────────────────

    public List<CertificationResponse> getAll(User user) {
        return certRepository.findByUserId(user.getId()).stream()
                .map(CertificationResponse::from)
                .toList();
    }

    @Transactional
    public CertificationResponse create(User user, CertificationRequest req) {
        Certification cert = Certification.builder()
                .user(user)
                .name(req.name)
                .issuer(req.issuer)
                .issueDate(req.issueDate)
                .expiryDate(req.expiryDate)
                .verificationStatus(Certification.VerificationStatus.PENDING)
                .build();
        return CertificationResponse.from(certRepository.save(cert));
    }

    @Transactional
    public CertificationResponse update(User user, Long id, CertificationRequest req) {
        Certification cert = certRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found with id: " + id));

        if (req.name       != null) cert.setName(req.name);
        if (req.issuer     != null) cert.setIssuer(req.issuer);
        if (req.issueDate  != null) cert.setIssueDate(req.issueDate);
        if (req.expiryDate != null) cert.setExpiryDate(req.expiryDate);

        // Reset to pending when the user edits their cert
        cert.setVerificationStatus(Certification.VerificationStatus.PENDING);

        return CertificationResponse.from(certRepository.save(cert));
    }

    @Transactional
    public void delete(User user, Long id) {
        Certification cert = certRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found with id: " + id));
        certRepository.delete(cert);
    }

    // ── Admin operations ──────────────────────────────────────────────────────────

    public List<CertificationResponse> getAllGlobal() {
        return certRepository.findAll().stream()
                .map(CertificationResponse::from)
                .toList();
    }

    @Transactional
    public CertificationResponse verify(Long certId, VerifyRequest req) {
        Certification cert = certRepository.findById(certId)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found with id: " + certId));

        Certification.VerificationStatus newStatus =
                switch (req.status.toLowerCase()) {
                case "pending" -> Certification.VerificationStatus.PENDING;
                    case "verified" -> Certification.VerificationStatus.VERIFIED;
                    case "rejected" -> Certification.VerificationStatus.REJECTED;
                    default -> throw new IllegalArgumentException(
                    "Invalid status: " + req.status + ". Use 'pending', 'verified', or 'rejected'");
                };

        cert.setVerificationStatus(newStatus);
        return CertificationResponse.from(certRepository.save(cert));
    }

    public Certification getRawById(Long certId) {
        return certRepository.findById(certId)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found with id: " + certId));
    }
}
