package com.skillstack.dto.response;

import com.skillstack.entity.Skill;
import java.time.LocalDateTime;

public class SkillResponse {
    public Long id;
    public String name;
    public String category;
    public String proficiency;
    public LocalDateTime createdAt;

    public static SkillResponse from(Skill s) {
        SkillResponse r = new SkillResponse();
        r.id          = s.getId();
        r.name        = s.getName();
        r.category    = s.getCategory();
        r.proficiency = s.getProficiency();
        r.createdAt   = s.getCreatedAt();
        return r;
    }
}
