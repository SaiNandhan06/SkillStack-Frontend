package com.skillstack.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "certifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String issuer;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    /** Original filename of the uploaded certificate document (nullable). */
    @Column(name = "file_name")
    private String fileName;

    /** Server-relative path / URL to the stored certificate file (nullable). */
    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (verificationStatus == null) verificationStatus = VerificationStatus.PENDING;
    }

    /**
     * Returns effective display status — expired overrides verified/pending
     * when the expiry date has passed.
     */
    @Transient
    public String getEffectiveStatus() {
        if (expiryDate != null && expiryDate.isBefore(LocalDate.now())) {
            return "EXPIRED";
        }
        return verificationStatus.name();
    }

    public enum VerificationStatus { PENDING, VERIFIED, REJECTED }
}
