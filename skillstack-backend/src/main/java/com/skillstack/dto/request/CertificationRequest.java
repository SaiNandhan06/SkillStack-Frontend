package com.skillstack.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CertificationRequest {
    @NotBlank public String name;
    @NotBlank public String issuer;
    @NotNull  public LocalDate issueDate;
              public LocalDate expiryDate; // optional
}
