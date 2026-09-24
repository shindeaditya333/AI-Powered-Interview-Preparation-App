package com.aditya.interview_prep_app.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerRequest {

    @NotNull
    private Long interviewId;

    private Long questionId;

    private Long audioQuestionId;

    private Long videoQuestionId;

    private String answer;

    private String audioUrl;

    private String videoUrl;
}