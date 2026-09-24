package com.aditya.interview_prep_app.repository;

import com.aditya.interview_prep_app.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AnswerRepository
        extends JpaRepository<Answer, Long> {

    List<Answer> findByInterviewId(Long interviewId);

    Optional<Answer> findByInterviewIdAndQuestionId(
            Long interviewId,
            Long questionId
    );

    Optional<Answer> findByInterviewIdAndAudioQuestionId(
            Long interviewId,
            Long audioQuestionId
    );
    Optional<Answer> findByInterviewIdAndVideoQuestionId(
            Long interviewId,
            Long videoQuestionId
    );
}