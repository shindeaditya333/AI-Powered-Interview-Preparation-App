package com.aditya.interview_prep_app.entity;

import jakarta.persistence.*;
import lombok.*;
import com.aditya.interview_prep_app.entity.VideoQuestion;

@Entity
@Table(name = "answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    private Interview interview;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audio_question_id")
    private AudioQuestion audioQuestion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "video_question_id")
    private VideoQuestion videoQuestion;

    @Column(columnDefinition = "TEXT")
    private String answerText;

    private String answerAudioUrl;

    private String answerVideoUrl;

    private Integer score;

    @Column(columnDefinition = "TEXT")
    private String feedback;
}