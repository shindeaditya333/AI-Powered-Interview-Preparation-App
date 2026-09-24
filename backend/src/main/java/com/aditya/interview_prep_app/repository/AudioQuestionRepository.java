package com.aditya.interview_prep_app.repository;

import com.aditya.interview_prep_app.entity.AudioQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AudioQuestionRepository
        extends JpaRepository<AudioQuestion, Long> {

    List<AudioQuestion> findByDomainId(Long domainId);
}