package com.aditya.interview_prep_app.dto;

import com.aditya.interview_prep_app.entity.Interview;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class InterviewResponse {

    private Long id;

    private Long domainId;

    private String domainName;

    private String mode;

    private Integer totalQuestions;

    private Integer score;

    private String status;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;


    public static InterviewResponse fromEntity(
            Interview interview
    ) {

        return InterviewResponse.builder()
                .id(interview.getId())
                .domainId(
                        interview.getDomain().getId()
                )
                .domainName(
                        interview.getDomain().getName()
                )
                .mode(interview.getMode())
                .totalQuestions(
                        interview.getTotalQuestions()
                )
                .score(interview.getScore())
                .status(interview.getStatus())
                .startedAt(interview.getStartedAt())
                .completedAt(interview.getCompletedAt())
                .build();
    }
}