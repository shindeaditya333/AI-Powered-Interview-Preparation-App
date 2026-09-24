package com.aditya.interview_prep_app.service;

import com.aditya.interview_prep_app.dto.QuestionResponse;
import com.aditya.interview_prep_app.entity.Question;
import com.aditya.interview_prep_app.repository.QuestionRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;


    public List<QuestionResponse> getQuestionsByDomain(
            Long domainId
    ) {

        return questionRepository
                .findByDomainId(domainId)
                .stream()
                .map(QuestionResponse::fromEntity)
                .toList();
    }


    public List<QuestionResponse> getQuestionsByDifficulty(
            Long domainId,
            String difficulty
    ) {

        return questionRepository
                .findByDomainIdAndDifficulty(
                        domainId,
                        difficulty
                )
                .stream()
                .map(QuestionResponse::fromEntity)
                .toList();
    }
}