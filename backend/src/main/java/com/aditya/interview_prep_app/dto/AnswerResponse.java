package com.aditya.interview_prep_app.dto;

import com.aditya.interview_prep_app.entity.Answer;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AnswerResponse {

    private Long id;

    private Long questionId;

    private String question;

    private String answer;

    private String correctOption;
    private String correctAnswer;

    private Integer score;

    private String feedback;

    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;

    private String audioUrl;
    private String videoUrl;

    public static AnswerResponse fromEntity(
            Answer answer
    ) {
        if (answer.getAudioQuestion() != null) {

            return AnswerResponse.builder()
                    .id(answer.getId())
                    .questionId(
                            answer
                                    .getAudioQuestion()
                                    .getId()
                    )
                    .question(
                            answer
                                    .getAudioQuestion()
                                    .getQuestion()
                    )
                    .answer(
                            answer.getAnswerText()
                    )
                    .score(
                            answer.getScore()
                    )
                    .feedback(
                            answer.getFeedback()
                    )
                    .audioUrl(
                            answer.getAnswerAudioUrl()
                    )
                    .videoUrl(
                            answer.getAnswerVideoUrl()
                    )
                    .build();
        }

        if (answer.getVideoQuestion() != null) {

            return AnswerResponse.builder()
                    .id(answer.getId())
                    .questionId(answer.getVideoQuestion().getId())
                    .question(answer.getVideoQuestion().getQuestion())
                    .answer(answer.getAnswerText())
                    .score(answer.getScore())
                    .feedback(answer.getFeedback())
                    .audioUrl(answer.getAnswerAudioUrl())
                    .videoUrl(answer.getAnswerVideoUrl())
                    .build();
        }

        // EXISTING MCQ/TEXT LOGIC BELOW

        String correctOption =
                answer.getQuestion().getCorrectOption();

        String correctAnswer = null;

        if ("A".equalsIgnoreCase(correctOption)) {
            correctAnswer =
                    answer.getQuestion().getOptionA();
        } else if ("B".equalsIgnoreCase(correctOption)) {
            correctAnswer =
                    answer.getQuestion().getOptionB();
        } else if ("C".equalsIgnoreCase(correctOption)) {
            correctAnswer =
                    answer.getQuestion().getOptionC();
        } else if ("D".equalsIgnoreCase(correctOption)) {
            correctAnswer =
                    answer.getQuestion().getOptionD();
        }

        return AnswerResponse.builder()
                .id(answer.getId())
                .questionId(
                        answer.getQuestion().getId()
                )
                .question(
                        answer.getQuestion().getQuestion()
                )
                .answer(
                        answer.getAnswerText()
                )
                .correctOption(
                        correctOption
                )
                .correctAnswer(
                        correctAnswer
                ).optionA(
                        answer.getQuestion().getOptionA()
                )
                .optionB(
                        answer.getQuestion().getOptionB()
                )
                .optionC(
                        answer.getQuestion().getOptionC()
                )
                .optionD(
                        answer.getQuestion().getOptionD()
                )
                .score(
                        answer.getScore()
                )
                .feedback(
                        answer.getFeedback()
                )
                .audioUrl(
                        answer.getAnswerAudioUrl()
                )
                .videoUrl(
                        answer.getAnswerVideoUrl()
                )
                .build();
    }
}