package com.skillstack.service;

import com.skillstack.dto.request.AuthRequest;
import com.skillstack.dto.response.AuthResponse;
import com.skillstack.dto.response.UserResponse;
import com.skillstack.entity.User;
import com.skillstack.entity.UserSettings;
import com.skillstack.repository.UserRepository;
import com.skillstack.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserSettingsRepository settingsRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(AuthRequest.Register req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .name(req.name())
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .role(User.Role.USER)
                .build();
        userRepository.save(user);

        // Create empty settings for the new user
        UserSettings settings = UserSettings.builder()
                .user(user)
                .isPublic(true)
                .build();
        settingsRepository.save(settings);
        user.setSettings(settings);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, UserResponse.from(user));
    }

    public AuthResponse login(AuthRequest.Login req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );

        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, UserResponse.from(user));
    }
}
