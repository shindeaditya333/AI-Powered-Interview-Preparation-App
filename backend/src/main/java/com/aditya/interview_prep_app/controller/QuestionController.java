package com.aditya.interview_prep_app.controller;

import com.aditya.interview_prep_app.dto.QuestionResponse;
import com.aditya.interview_prep_app.service.QuestionService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;


    @GetMapping("/domain/{domainId}")
    public List<QuestionResponse> getQuestions(
            @PathVariable Long domainId
    ) {

        return questionService
                .getQuestionsByDomain(domainId);
    }


    @GetMapping(
            "/domain/{domainId}/difficulty/{difficulty}"
    )
    public List<QuestionResponse> getQuestionsByDifficulty(
            @PathVariable Long domainId,
            @PathVariable String difficulty
    ) {

        return questionService
                .getQuestionsByDifficulty(
                        domainId,
                        difficulty
                );
    }
}