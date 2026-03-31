package com.skillstack;

import com.skillstack.entity.User;
import com.skillstack.entity.UserSettings;
import com.skillstack.repository.UserRepository;
import com.skillstack.repository.UserSettingsRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class SkillStackApplication {
    public static void main(String[] args) {
        SpringApplication.run(SkillStackApplication.class, args);
    }

    @Bean
    CommandLineRunner seedAdmin(UserRepository userRepository,
                                UserSettingsRepository settingsRepository,
                                PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@skillstack.com";
            if (userRepository.existsByEmail(adminEmail)) {
                return;
            }

            User admin = User.builder()
                    .name("Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("Admin123!"))
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);

            UserSettings settings = UserSettings.builder()
                    .user(admin)
                    .isPublic(false)
                    .build();
            settingsRepository.save(settings);
            admin.setSettings(settings);
        };
    }
}
