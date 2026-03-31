package com.skillstack.dto.request;

import jakarta.validation.constraints.NotBlank;

public class VerifyRequest {
    @NotBlank public String status;   // "verified" | "rejected" | "pending"
}
