package com.skillstack.repository;

import com.skillstack.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByUserId(Long userId);
    Optional<Skill> findByIdAndUserId(Long id, Long userId);
}
