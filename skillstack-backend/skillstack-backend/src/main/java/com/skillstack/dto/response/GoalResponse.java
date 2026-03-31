package com.skillstack.dto.response;

import com.skillstack.entity.Goal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class GoalResponse {
    public Long id;
    public String title;
    public String status;
    public LocalDate targetDate;
    public LocalDateTime createdAt;

    public static GoalResponse from(Goal g) {
        GoalResponse r = new GoalResponse();
        r.id         = g.getId();
        r.title      = g.getTitle();
        r.status     = g.getStatus().name();
        r.targetDate = g.getTargetDate();
        r.createdAt  = g.getCreatedAt();
        return r;
    }
}
