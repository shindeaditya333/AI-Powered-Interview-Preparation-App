package com.aditya.interview_prep_app.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class InterviewResultResponse {

    private Long interviewId;

    private String domain;

    private String mode;

    private Integer totalQuestions;

    private Integer answeredQuestions;

    private Integer totalScore;

    private Double percentage;

    private String status;

    private List<AnswerResponse> answers;
}