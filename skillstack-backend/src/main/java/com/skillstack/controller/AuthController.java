package com.skillstack.controller;

import com.skillstack.dto.request.AuthRequest;
import com.skillstack.dto.response.AuthResponse;
import com.skillstack.repository.UserRepository;
import com.skillstack.service.AuthService;
import com.skillstack.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;
    private final UserRepository userRepository;

    // ── Direct register (kept for internal/admin use) ─────────────────────────────

    /**
     * POST /api/v1/auth/register
     * Deprecated direct register — use send-register-otp + verify-register instead.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequest.Register req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(req));
    }

    /**
     * POST /api/v1/auth/login  (direct, no OTP — kept for backward compatibility)
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest.Login req) {
        return ResponseEntity.ok(authService.login(req));
    }

    // ── OTP Login flow ───────────────────────────────────────────────────────────

    /**
     * POST /api/v1/auth/send-otp
     * Step 1: Validates credentials, then emails a 6-digit login OTP.
     */
    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, Object>> sendOtp(@Valid @RequestBody AuthRequest.Login req) {
        authService.validateCredentials(req);
        otpService.generateAndSendLoginOtp(req.email());
        return otpResponse(req.email());
    }

    /**
     * POST /api/v1/auth/verify-otp-login
     * Step 2: Verifies login OTP and issues a JWT on success.
     */
    @PostMapping("/verify-otp-login")
    public ResponseEntity<AuthResponse> verifyOtpAndLogin(@Valid @RequestBody AuthRequest.OtpLogin req) {
        if (!otpService.verifyLoginOtp(req.email(), req.otp())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        return ResponseEntity.ok(authService.login(new AuthRequest.Login(req.email(), req.password())));
    }

    // ── OTP Registration flow ────────────────────────────────────────────────────

    /**
     * POST /api/v1/auth/send-register-otp
     * Body: { email }
     * Step 1: Validates that the email is not already registered, then emails an OTP.
     * Returns 409 if email already exists.
     */
    @PostMapping("/send-register-otp")
    public ResponseEntity<Map<String, Object>> sendRegisterOtp(
            @Valid @RequestBody AuthRequest.SendRegisterOtp req) {
        if (userRepository.existsByEmail(req.email())) {
            Map<String, Object> body = new HashMap<>();
            body.put("error", "Email already registered. Please log in instead.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
        }
        otpService.generateAndSendRegisterOtp(req.email());
        return otpResponse(req.email());
    }

    /**
     * POST /api/v1/auth/verify-register
     * Body: { name, email, password, otp }
     * Step 2: Verifies the registration OTP, then creates the account and returns a JWT.
     * Returns 401 on wrong/expired OTP.
     */
    @PostMapping("/verify-register")
    public ResponseEntity<AuthResponse> verifyAndRegister(
            @Valid @RequestBody AuthRequest.OtpRegister req) {
        if (!otpService.verifyRegisterOtp(req.email(), req.otp())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        AuthResponse response = authService.register(
                new AuthRequest.Register(req.name(), req.email(), req.password()));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────────

    private ResponseEntity<Map<String, Object>> otpResponse(String email) {
        boolean smtpOn = otpService.isSmtpConfigured();
        Map<String, Object> body = new HashMap<>();
        body.put("message", smtpOn
                ? "Verification code sent to " + email
                : "SMTP not configured — OTP printed to backend console");
        body.put("smtpConfigured", smtpOn);
        return ResponseEntity.ok(body);
    }
}
