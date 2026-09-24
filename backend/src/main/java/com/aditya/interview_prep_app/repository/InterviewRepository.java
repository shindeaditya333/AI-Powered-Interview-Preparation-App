package com.aditya.interview_prep_app.repository;

import com.aditya.interview_prep_app.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewRepository
        extends JpaRepository<Interview, Long> {

    List<Interview> findByUserIdOrderByStartedAtDesc(
            Long userId
    );
}