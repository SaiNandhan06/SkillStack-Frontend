package com.skillstack.service;

import com.skillstack.dto.request.UserUpdateRequest;
import com.skillstack.dto.response.UserResponse;
import com.skillstack.entity.User;
import com.skillstack.entity.UserSettings;
import com.skillstack.exception.ResourceNotFoundException;
import com.skillstack.repository.UserRepository;
import com.skillstack.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserSettingsRepository settingsRepository;

    public UserResponse getMe(User currentUser) {
        // Reload to pick up settings eagerly
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse updateMe(User currentUser, UserUpdateRequest req) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (req.name != null && !req.name.isBlank()) user.setName(req.name);

        // Update or create settings
        UserSettings settings = settingsRepository.findByUserId(user.getId())
                .orElse(UserSettings.builder().user(user).build());

        if (req.bio       != null) settings.setBio(req.bio);
        if (req.location  != null) settings.setLocation(req.location);
        if (req.roleTitle != null) settings.setRoleTitle(req.roleTitle);
        if (req.isPublic  != null) settings.setPublic(req.isPublic);

        settingsRepository.save(settings);
        user.setSettings(settings);
        userRepository.save(user);

        return UserResponse.from(user);
    }

    // ── Admin operations ──────────────────────────────────────────────────────────

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional
    public UserResponse toggleRole(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setRole(user.getRole() == User.Role.ADMIN ? User.Role.USER : User.Role.ADMIN);
        userRepository.save(user);
        return UserResponse.from(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
    }
}
