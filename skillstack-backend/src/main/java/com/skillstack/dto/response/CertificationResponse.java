package com.skillstack.dto.response;

import com.skillstack.entity.Certification;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CertificationResponse {
    public Long id;
    public Long userId;
    public String userName;
    public String name;
    public String issuer;
    public LocalDate issueDate;
    public LocalDate expiryDate;
    public String verifyStatus;   // "pending", "verified", "rejected"
    public String status;         // "active" or "expired"
    public LocalDateTime createdAt;
    public String fileName;       // original uploaded file name (nullable)
    public String fileUrl;        // URL to download/view the file (nullable)

    public static CertificationResponse from(Certification c) {
        CertificationResponse r = new CertificationResponse();
        r.id                 = c.getId();
        r.userId             = c.getUser().getId();
        r.userName           = c.getUser().getName();
        r.name               = c.getName();
        r.issuer             = c.getIssuer();
        r.issueDate          = c.getIssueDate();
        r.expiryDate         = c.getExpiryDate();
        r.verifyStatus       = c.getVerificationStatus().name().toLowerCase();
        r.status             = c.getEffectiveStatus().equalsIgnoreCase("EXPIRED") ? "expired" : "active";
        r.createdAt          = c.getCreatedAt();
        r.fileName           = c.getFileName();
        r.fileUrl            = c.getFileUrl();
        return r;
    }
}
