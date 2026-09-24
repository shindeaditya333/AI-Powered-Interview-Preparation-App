package com.aditya.interview_prep_app.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    /*
     * QUESTION TYPE
     *
     * MCQ
     * TEXT
     */
    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String difficulty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "domain_id")
    private Domain domain;

    /*
     * For subjective/text questions:
     * This acts as a reference answer / evaluation guide.
     *
     * It should NOT be exposed directly to the frontend.
     */
    @Column(columnDefinition = "TEXT")
    private String expectedAnswer;

    /*
     * For MCQ:
     *
     * A
     * B
     * C
     * D
     */
    @Column(columnDefinition = "TEXT")
    private String optionA;

    @Column(columnDefinition = "TEXT")
    private String optionB;

    @Column(columnDefinition = "TEXT")
    private String optionC;

    @Column(columnDefinition = "TEXT")
    private String optionD;

    /*
     * For MCQ only.
     *
     * Example:
     * A
     * B
     * C
     * D
     */
    private String correctOption;

    private Integer marks;
}