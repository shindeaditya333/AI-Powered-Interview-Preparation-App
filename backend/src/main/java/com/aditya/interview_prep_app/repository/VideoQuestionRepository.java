package com.aditya.interview_prep_app.repository;

import com.aditya.interview_prep_app.entity.VideoQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VideoQuestionRepository
        extends JpaRepository<VideoQuestion, Long> {

    List<VideoQuestion> findByDomainId(Long domainId);
}