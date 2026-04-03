package com.skillstack.service;

import com.skillstack.dto.request.SkillRequest;
import com.skillstack.dto.response.SkillResponse;
import com.skillstack.entity.Skill;
import com.skillstack.entity.User;
import com.skillstack.exception.ResourceNotFoundException;
import com.skillstack.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    public List<SkillResponse> getAll(User user) {
        return skillRepository.findByUserId(user.getId()).stream()
                .map(SkillResponse::from)
                .toList();
    }

    @Transactional
    public SkillResponse create(User user, SkillRequest req) {
        Skill skill = Skill.builder()
                .user(user)
                .name(req.name)
                .category(req.category)
                .proficiency(req.proficiency)
                .build();
        return SkillResponse.from(skillRepository.save(skill));
    }

    @Transactional
    public SkillResponse update(User user, Long id, SkillRequest req) {
        Skill skill = skillRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));

        if (req.name        != null) skill.setName(req.name);
        if (req.category    != null) skill.setCategory(req.category);
        if (req.proficiency != null) skill.setProficiency(req.proficiency);

        return SkillResponse.from(skillRepository.save(skill));
    }

    @Transactional
    public void delete(User user, Long id) {
        Skill skill = skillRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
        skillRepository.delete(skill);
    }
}
