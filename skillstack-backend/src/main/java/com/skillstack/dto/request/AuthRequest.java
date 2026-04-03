package com.skillstack.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthRequest {

    public record Register(
        @NotBlank(message = "Name is required")
        String name,

        @NotBlank @Email(message = "Valid email required")
        String email,

        @NotBlank @Size(min = 6, message = "Password must be at least 6 characters")
        String password
    ) {}

    public record Login(
        @NotBlank @Email
        String email,

        @NotBlank
        String password
    ) {}
}
