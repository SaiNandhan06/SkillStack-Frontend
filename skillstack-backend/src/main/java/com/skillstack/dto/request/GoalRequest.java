package com.skillstack.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class GoalRequest {
    @NotBlank public String title;
              public String status;      // NOT_STARTED | IN_PROGRESS | COMPLETED
              public LocalDate targetDate;
}
