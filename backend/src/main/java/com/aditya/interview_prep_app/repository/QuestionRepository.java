package com.aditya.interview_prep_app.repository;

import com.aditya.interview_prep_app.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByDomainId(Long domainId);

    List<Question> findByDomainIdAndDifficulty(
            Long domainId,
            String difficulty
    );
}