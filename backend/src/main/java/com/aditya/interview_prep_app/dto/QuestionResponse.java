package com.aditya.interview_prep_app.dto;

import com.aditya.interview_prep_app.entity.Question;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class QuestionResponse {

    private Long id;

    private String question;

    private String type;

    private String difficulty;

    private String optionA;

    private String optionB;

    private String optionC;

    private String optionD;

    private Integer marks;


    public static QuestionResponse fromEntity(
            Question question
    ) {

        return QuestionResponse.builder()
                .id(question.getId())
                .question(question.getQuestion())
                .type(question.getType())
                .difficulty(question.getDifficulty())
                .optionA(question.getOptionA())
                .optionB(question.getOptionB())
                .optionC(question.getOptionC())
                .optionD(question.getOptionD())
                .marks(question.getMarks())
                .build();
    }
}