package com.skillstack.dto.response;

import com.skillstack.entity.Notification;
import java.time.LocalDateTime;

public class NotificationResponse {
    public Long id;
    public String message;
    public boolean read;
    public LocalDateTime createdAt;

    public static NotificationResponse from(Notification n) {
        NotificationResponse r = new NotificationResponse();
        r.id        = n.getId();
        r.message   = n.getMessage();
        r.read      = n.isRead();
        r.createdAt = n.getCreatedAt();
        return r;
    }
}
