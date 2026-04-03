package com.skillstack.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class SkillRequest {
    @NotBlank public String name;
    @NotBlank public String category;
    @NotBlank public String proficiency;
}
