package com.skillstack.service;

import com.skillstack.dto.response.NotificationResponse;
import com.skillstack.entity.Notification;
import com.skillstack.entity.User;
import com.skillstack.exception.ResourceNotFoundException;
import com.skillstack.repository.NotificationRepository;
import com.skillstack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<NotificationResponse> getAll(User user) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(NotificationResponse::from)
                .toList();
    }

    @Transactional
    public NotificationResponse markRead(User user, Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));

        // Ensure users can only mark their own notifications
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Notification not found with id: " + id);
        }

        notification.setRead(true);
        return NotificationResponse.from(notificationRepository.save(notification));
    }

    // ── Admin: create a notification for any user ─────────────────────────────────

    @Transactional
    public NotificationResponse createForUser(Long targetUserId, String message) {
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + targetUserId));

        Notification notification = Notification.builder()
                .user(targetUser)
                .message(message)
                .read(false)
                .build();
        return NotificationResponse.from(notificationRepository.save(notification));
    }

    // ── Admin: send renewal reminder for a specific certification ─────────────────

    @Transactional
    public NotificationResponse sendRenewalReminder(User certOwner, String certName) {
        String message = "Your certification \"" + certName + "\" is expiring soon. Please renew it.";
        Notification notification = Notification.builder()
                .user(certOwner)
                .message(message)
                .read(false)
                .build();
        return NotificationResponse.from(notificationRepository.save(notification));
    }
}
