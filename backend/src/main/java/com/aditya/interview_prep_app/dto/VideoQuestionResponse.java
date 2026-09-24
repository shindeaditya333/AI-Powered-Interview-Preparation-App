package com.aditya.interview_prep_app.dto;

import com.aditya.interview_prep_app.entity.VideoQuestion;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VideoQuestionResponse {

    private Long id;
    private String question;
    private String difficulty;
    private Integer marks;

    public static VideoQuestionResponse fromEntity(
            VideoQuestion question
    ) {
        return VideoQuestionResponse.builder()
                .id(question.getId())
                .question(question.getQuestion())
                .difficulty(question.getDifficulty())
                .marks(question.getMarks())
                .build();
    }
}