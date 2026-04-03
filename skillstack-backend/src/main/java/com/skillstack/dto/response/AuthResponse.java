package com.skillstack.dto.response;

import com.skillstack.entity.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

// ── Auth ───────────────────────────────────────────────────────────────────────
public class AuthResponse {
    public String token;
    public UserResponse user;

    public AuthResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
    }
}
