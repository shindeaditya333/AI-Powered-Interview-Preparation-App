package com.aditya.interview_prep_app.dto;

import com.aditya.interview_prep_app.entity.AudioQuestion;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AudioQuestionResponse {

    private Long id;
    private String question;
    private String difficulty;
    private Integer marks;

    public static AudioQuestionResponse fromEntity(
            AudioQuestion question
    ) {

        return AudioQuestionResponse.builder()
                .id(question.getId())
                .question(question.getQuestion())
                .difficulty(question.getDifficulty())
                .marks(question.getMarks())
                .build();
    }
}