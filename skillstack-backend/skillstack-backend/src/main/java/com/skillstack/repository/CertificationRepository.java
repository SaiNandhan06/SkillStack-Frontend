package com.skillstack.repository;

import com.skillstack.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findByUserId(Long userId);
    Optional<Certification> findByIdAndUserId(Long id, Long userId);
}
