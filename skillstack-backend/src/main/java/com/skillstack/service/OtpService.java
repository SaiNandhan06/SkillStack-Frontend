package com.skillstack.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Manages 6-digit email OTPs for both login verification and account registration.
 *
 * <p>Two separate namespaced stores are used so login and registration OTPs
 * can coexist without collision:</p>
 * <ul>
 *   <li>{@code login:<email>}    — issued during the login flow</li>
 *   <li>{@code register:<email>} — issued during the registration flow</li>
 * </ul>
 *
 * <p>If SMTP is not configured the OTP is still generated and logged to the
 * console (DEV mode) so the feature is testable without email credentials.</p>
 */
@Service
@RequiredArgsConstructor
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    /** OTP expiry duration in milliseconds (5 minutes). */
    private static final long OTP_TTL_MS = 5 * 60 * 1000L;

    private static final String NS_LOGIN    = "login:";
    private static final String NS_REGISTER = "register:";

    private final SecureRandom random = new SecureRandom();

    /** Unified map of namespaced key → {otp, expiresAt}. */
    private final Map<String, OtpEntry> store = new ConcurrentHashMap<>();

    // ── Public API ───────────────────────────────────────────────────────────────

    /**
     * Returns true if a real SMTP address is configured (not the placeholder default).
     */
    public boolean isSmtpConfigured() {
        return fromAddress != null
                && !fromAddress.isBlank()
                && !fromAddress.contains("your-email");
    }

    /**
     * Generates and sends (or logs) a login OTP for the given email.
     */
    public void generateAndSendLoginOtp(String email) {
        generateAndSend(NS_LOGIN + email.toLowerCase(), email, "Login");
    }

    /**
     * Generates and sends (or logs) a registration OTP for the given email.
     */
    public void generateAndSendRegisterOtp(String email) {
        generateAndSend(NS_REGISTER + email.toLowerCase(), email, "Registration");
    }

    /**
     * Verifies a login OTP.
     *
     * @return true if valid and not expired
     */
    public boolean verifyLoginOtp(String email, String otp) {
        return verifyInternal(NS_LOGIN + email.toLowerCase(), otp);
    }

    /**
     * Verifies a registration OTP.
     *
     * @return true if valid and not expired
     */
    public boolean verifyRegisterOtp(String email, String otp) {
        return verifyInternal(NS_REGISTER + email.toLowerCase(), otp);
    }

    // ── Legacy alias kept for backward compatibility ──────────────────────────────
    /** @deprecated Use {@link #generateAndSendLoginOtp(String)} */
    @Deprecated
    public void generateAndSend(String email) {
        generateAndSendLoginOtp(email);
    }

    /** @deprecated Use {@link #verifyLoginOtp(String, String)} */
    @Deprecated
    public boolean verify(String email, String otp) {
        return verifyLoginOtp(email, otp);
    }

    // ── Private helpers ──────────────────────────────────────────────────────────

    private void generateAndSend(String key, String email, String purpose) {
        String otp = String.format("%06d", random.nextInt(1_000_000));
        long expiresAt = Instant.now().toEpochMilli() + OTP_TTL_MS;
        store.put(key, new OtpEntry(otp, expiresAt));

        if (isSmtpConfigured()) {
            sendOtpEmail(key, email, otp, purpose);
        } else {
            log.warn("==========================================================");
            log.warn("  SMTP NOT CONFIGURED — {} OTP for {} : {}", purpose, email, otp);
            log.warn("  Set MAIL_USERNAME and MAIL_PASSWORD env vars for email.");
            log.warn("==========================================================");
        }
    }

    private boolean verifyInternal(String key, String otp) {
        OtpEntry entry = store.get(key);
        if (entry == null) return false;
        if (Instant.now().toEpochMilli() > entry.expiresAt()) {
            store.remove(key);
            return false;
        }
        boolean valid = entry.otp().equals(otp.trim());
        if (valid) store.remove(key);
        return valid;
    }

    private void sendOtpEmail(String key, String toEmail, String otp, String purpose) {
        try {
            String subject = purpose.equals("Login")
                    ? "SkillStack — Your Login Verification Code"
                    : "SkillStack — Verify Your Email Address";

            String body = purpose.equals("Login")
                    ? "Hi,\n\nYour SkillStack login verification code is:\n\n  " + otp
                      + "\n\nThis code expires in 5 minutes. If you did not request this, "
                      + "please ignore this email.\n\n— The SkillStack Team"
                    : "Hi,\n\nWelcome to SkillStack! Please verify your email address "
                      + "by entering the code below:\n\n  " + otp
                      + "\n\nThis code expires in 5 minutes.\n\n— The SkillStack Team";

            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromAddress);
            msg.setTo(toEmail);
            msg.setSubject(subject);
            msg.setText(body);
            mailSender.send(msg);
            log.info("{} OTP email sent to {}", purpose, toEmail);
        } catch (MailException e) {
            store.remove(key);
            log.error("Failed to send {} OTP email to {}: {}", purpose, toEmail, e.getMessage());
            throw new RuntimeException(
                "Failed to send verification email. Please check SMTP configuration. ("
                + e.getMessage() + ")", e);
        }
    }

    // ── Internal class ──────────────────────────────────────────────────────────

    private record OtpEntry(String otp, long expiresAt) {}
}
