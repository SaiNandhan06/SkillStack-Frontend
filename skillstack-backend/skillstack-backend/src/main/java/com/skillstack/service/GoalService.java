package com.skillstack.service;

import com.skillstack.dto.request.GoalRequest;
import com.skillstack.dto.response.GoalResponse;
import com.skillstack.entity.Goal;
import com.skillstack.entity.User;
import com.skillstack.exception.ResourceNotFoundException;
import com.skillstack.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;

    public List<GoalResponse> getAll(User user) {
        return goalRepository.findByUserId(user.getId()).stream()
                .map(GoalResponse::from)
                .toList();
    }

    @Transactional
    public GoalResponse create(User user, GoalRequest req) {
        Goal.GoalStatus status = parseStatus(req.status);

        Goal goal = Goal.builder()
                .user(user)
                .title(req.title)
                .status(status)
                .targetDate(req.targetDate)
                .build();
        return GoalResponse.from(goalRepository.save(goal));
    }

    @Transactional
    public GoalResponse update(User user, Long id, GoalRequest req) {
        Goal goal = goalRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));

        if (req.title      != null) goal.setTitle(req.title);
        if (req.targetDate != null) goal.setTargetDate(req.targetDate);
        if (req.status     != null) goal.setStatus(parseStatus(req.status));

        return GoalResponse.from(goalRepository.save(goal));
    }

    @Transactional
    public void delete(User user, Long id) {
        Goal goal = goalRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));
        goalRepository.delete(goal);
    }

    private Goal.GoalStatus parseStatus(String raw) {
        if (raw == null) return Goal.GoalStatus.NOT_STARTED;
        try {
            return Goal.GoalStatus.valueOf(raw.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                "Invalid goal status: " + raw + ". Use NOT_STARTED, IN_PROGRESS, or COMPLETED");
        }
    }
}
