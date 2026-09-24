package com.aditya.interview_prep_app.service;

import com.aditya.interview_prep_app.dto.AnswerRequest;
import com.aditya.interview_prep_app.dto.AnswerResponse;
import com.aditya.interview_prep_app.dto.InterviewResultResponse;
import com.aditya.interview_prep_app.dto.InterviewResponse;
import com.aditya.interview_prep_app.repository.VideoQuestionRepository;

import com.aditya.interview_prep_app.entity.*;

import com.aditya.interview_prep_app.repository.*;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;

    private final AnswerRepository answerRepository;

    private final QuestionRepository questionRepository;

    private final DomainRepository domainRepository;

    private final UserRepository userRepository;

    private final GeminiService geminiService;
    private final AudioQuestionRepository audioQuestionRepository;
    private final VideoQuestionRepository videoQuestionRepository;

    // =====================================================
    // START INTERVIEW
    // =====================================================

    public InterviewResponse startInterview(
            String username,
            Long domainId,
            String mode
    ) {

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        Domain domain =
                domainRepository
                        .findById(domainId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Domain not found"
                                )
                        );


        int totalQuestions;


        // =====================================================
        // AUDIO → use ONLY audio_questions table
        // =====================================================

        if ("AUDIO".equalsIgnoreCase(mode)) {

            totalQuestions =
                    (int) audioQuestionRepository
                            .findByDomainId(domainId)
                            .stream()
                            .limit(5)
                            .count();


            if (totalQuestions == 0) {

                throw new RuntimeException(
                        "No audio questions available for this domain"
                );
            }

        }


        else if ("VIDEO".equalsIgnoreCase(mode)) {

            totalQuestions =
                    (int) videoQuestionRepository
                            .findByDomainId(domainId)
                            .stream()
                            .limit(5)
                            .count();

            if (totalQuestions == 0) {
                throw new RuntimeException(
                        "No video questions available"
                );
            }

        }

        // =====================================================
        // MCQ / TEXT → EXISTING questions table
        // =====================================================

        else {

            List<Question> questions =
                    questionRepository
                            .findByDomainId(domainId);


            if (questions.isEmpty()) {

                throw new RuntimeException(
                        "No questions available for this domain"
                );
            }


            totalQuestions =
                    questions.size();
        }


        Interview interview =
                Interview.builder()
                        .user(user)
                        .domain(domain)
                        .mode(mode)
                        .totalQuestions(
                                totalQuestions
                        )
                        .score(0)
                        .status("IN_PROGRESS")
                        .build();


        Interview savedInterview =
                interviewRepository.save(interview);


        return InterviewResponse.fromEntity(
                savedInterview
        );
    }


    // =====================================================
    // SUBMIT ANSWER
    // =====================================================

    @Transactional
    public AnswerResponse saveAnswer(
            String username,
            AnswerRequest request
    ) {

        Interview interview =
                getUserInterview(
                        username,
                        request.getInterviewId()
                );


        if (
                !"IN_PROGRESS".equalsIgnoreCase(
                        interview.getStatus()
                )
        ) {

            throw new RuntimeException(
                    "Interview is already completed"
            );
        }


        // =====================================================
        // AUDIO
        // =====================================================

        if (
                "AUDIO".equalsIgnoreCase(
                        interview.getMode()
                )
        ) {

            AudioQuestion audioQuestion =
                    audioQuestionRepository
                            .findById(
                                    request.getAudioQuestionId()
                            )
                            .orElseThrow(
                                    () -> new RuntimeException(
                                            "Audio question not found"
                                    )
                            );


            String audioUrl =
                    request.getAudioUrl();


            if (
                    audioUrl == null ||
                            audioUrl.isBlank()
            ) {

                throw new RuntimeException(
                        "Audio answer is required"
                );
            }


            Answer answer =
                    answerRepository
                            .findByInterviewIdAndAudioQuestionId(
                                    interview.getId(),
                                    audioQuestion.getId()
                            )
                            .orElse(null);


            if (answer == null) {

                answer =
                        Answer.builder()
                                .interview(interview)
                                .audioQuestion(audioQuestion)
                                .answerText("")
                                .answerAudioUrl(audioUrl)
                                .score(0)
                                .feedback(
                                        "Pending AI evaluation."
                                )
                                .build();

            } else {

                answer.setAnswerAudioUrl(
                        audioUrl
                );
            }


            Answer savedAnswer =
                    answerRepository.save(answer);


            return AnswerResponse.fromEntity(
                    savedAnswer
            );
        }


        if ("VIDEO".equalsIgnoreCase(interview.getMode())) {

            VideoQuestion videoQuestion =
                    videoQuestionRepository
                            .findById(request.getVideoQuestionId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Video question not found"
                                    ));

            if (request.getVideoUrl() == null ||
                    request.getVideoUrl().isBlank()) {

                throw new RuntimeException(
                        "Video answer is required"
                );
            }

            Answer answer =
                    answerRepository
                            .findByInterviewIdAndVideoQuestionId(
                                    request.getInterviewId(),
                                    request.getVideoQuestionId()
                            )
                            .orElse(
                                    Answer.builder()
                                            .interview(interview)
                                            .videoQuestion(videoQuestion)
                                            .build()
                            );

            answer.setAnswerText("");
            answer.setAnswerVideoUrl(
                    request.getVideoUrl()
            );
            answer.setScore(0);
            answer.setFeedback(
                    "Pending AI evaluation."
            );

            return AnswerResponse.fromEntity(
                    answerRepository.save(answer)
            );
        }

        // =====================================================
        // MCQ / TEXT
        // =====================================================
        // EVERYTHING BELOW THIS POINT IS YOUR EXISTING LOGIC
        // =====================================================

        Question question =
                questionRepository
                        .findById(
                                request.getQuestionId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Question not found"
                                )
                        );


        String candidateAnswer =
                request.getAnswer() == null
                        ? ""
                        : request.getAnswer().trim();


        int score;

        String feedback;


        // =====================================================
        // MCQ
        // =====================================================

        if (
                "MCQ".equalsIgnoreCase(
                        question.getType()
                )
        ) {

            if (
                    candidateAnswer.isBlank()
            ) {

                throw new RuntimeException(
                        "MCQ answer cannot be empty"
                );
            }


            if (
                    question.getCorrectOption() == null
            ) {

                throw new RuntimeException(
                        "MCQ correct answer is not configured"
                );
            }


            boolean correct =
                    question
                            .getCorrectOption()
                            .equalsIgnoreCase(
                                    candidateAnswer
                            );


            if (correct) {

                score = 10;

                feedback =
                        "Correct answer.";

            } else {

                score = 0;

                feedback =
                        "Incorrect answer.";
            }


        }

        // =====================================================
        // TEXT / DESCRIPTIVE
        // =====================================================

        else {

            if (
                    candidateAnswer.isBlank()
            ) {

                throw new RuntimeException(
                        "Answer cannot be empty"
                );
            }


            GeminiService.GeminiEvaluation evaluation =
                    geminiService.evaluateAnswer(
                            question.getQuestion(),
                            question.getExpectedAnswer(),
                            candidateAnswer
                    );


            score =
                    evaluation.score();

            feedback =
                    evaluation.feedback();
        }


        // =====================================================
        // EXISTING MCQ / TEXT ANSWER
        // =====================================================

        Answer answer =
                answerRepository
                        .findByInterviewIdAndQuestionId(
                                interview.getId(),
                                question.getId()
                        )
                        .orElse(null);


        if (answer != null) {

            answer.setAnswerText(
                    candidateAnswer
            );

            answer.setScore(
                    score
            );

            answer.setFeedback(
                    feedback
            );

        } else {

            answer =
                    Answer.builder()
                            .interview(interview)
                            .question(question)
                            .answerText(
                                    candidateAnswer
                            )
                            .score(score)
                            .feedback(feedback)
                            .build();
        }


        Answer savedAnswer =
                answerRepository.save(answer);


        return AnswerResponse.fromEntity(
                savedAnswer
        );
    }

    // =====================================================
    // COMPLETE INTERVIEW
    // =====================================================

    @Transactional
    public InterviewResultResponse completeInterview(
            String username,
            Long interviewId
    ) {

        Interview interview =
                getUserInterview(
                        username,
                        interviewId
                );


        if (
                "COMPLETED".equalsIgnoreCase(
                        interview.getStatus()
                )
        ) {

            return buildResult(interview);
        }


        List<Answer> answers =
                answerRepository
                        .findByInterviewId(
                                interviewId
                        );

        if (
                "AUDIO".equalsIgnoreCase(
                        interview.getMode()
                )
        ) {

            List<GeminiService.AudioEvaluation>
                    evaluations =
                    geminiService
                            .evaluateAudioInterview(
                                    answers
                            );

            for (
                    GeminiService.AudioEvaluation evaluation :
                    evaluations
            ) {

                answers.stream()
                        .filter(
                                answer ->
                                        answer
                                                .getAudioQuestion()
                                                .getId()
                                                .equals(
                                                        evaluation
                                                                .questionId()
                                                )
                        )
                        .findFirst()
                        .ifPresent(
                                answer -> {

                                    answer.setAnswerText(
                                            evaluation.transcript()
                                    );

                                    answer.setScore(
                                            evaluation.score()
                                    );

                                    answer.setFeedback(
                                            evaluation.feedback()
                                    );
                                }
                        );
            }

            answerRepository.saveAll(
                    answers
            );
        }

        else if ("VIDEO".equalsIgnoreCase(interview.getMode())) {

            List<GeminiService.VideoEvaluation> evaluations =
                    geminiService.evaluateVideoInterview(
                            answers
                    );

            for (GeminiService.VideoEvaluation evaluation :
                    evaluations) {

                answers.stream()
                        .filter(answer ->
                                answer.getVideoQuestion() != null &&
                                        answer.getVideoQuestion()
                                                .getId()
                                                .equals(
                                                        evaluation.questionId()
                                                )
                        )
                        .findFirst()
                        .ifPresent(answer -> {

                            answer.setAnswerText(
                                    evaluation.transcript()
                            );

                            answer.setScore(
                                    evaluation.score()
                            );

                            answer.setFeedback(
                                    evaluation.feedback()
                            );
                        });
            }

            answerRepository.saveAll(answers);
        }


        int totalScore =
                answers.stream()
                        .mapToInt(
                                answer ->
                                        answer.getScore() == null
                                                ? 0
                                                : answer.getScore()
                        )
                        .sum();


        interview.setScore(totalScore);

        interview.setStatus("COMPLETED");

        interview.setCompletedAt(
                LocalDateTime.now()
        );


        interviewRepository.save(interview);


        return buildResult(interview);
    }


    // =====================================================
    // GET INTERVIEW RESULT
    // =====================================================

    @Transactional
    public InterviewResultResponse getInterviewResult(
            String username,
            Long interviewId
    ) {

        Interview interview =
                getUserInterview(
                        username,
                        interviewId
                );


        return buildResult(interview);
    }


    // =====================================================
    // BUILD RESULT
    // =====================================================

    private InterviewResultResponse buildResult(
            Interview interview
    ) {

        List<Answer> answers =
                answerRepository
                        .findByInterviewId(
                                interview.getId()
                        );


        List<AnswerResponse> answerResponses =
                answers.stream()
                        .map(
                                AnswerResponse::fromEntity
                        )
                        .toList();


        int totalScore =
                answers.stream()
                        .mapToInt(
                                answer ->
                                        answer.getScore() == null
                                                ? 0
                                                : answer.getScore()
                        )
                        .sum();


        int totalQuestions =
                interview.getTotalQuestions() == null
                        ? 0
                        : interview.getTotalQuestions();


        double percentage = 0;

        if (totalQuestions > 0) {

            /*
             * Every question currently has a
             * maximum score of 10.
             */

            double maximumScore =
                    totalQuestions * 10.0;


            percentage =
                    (totalScore / maximumScore) * 100;
        }


        return InterviewResultResponse
                .builder()
                .interviewId(
                        interview.getId()
                )
                .domain(
                        interview
                                .getDomain()
                                .getName()
                )
                .mode(
                        interview.getMode()
                )
                .totalQuestions(
                        totalQuestions
                )
                .answeredQuestions(
                        answers.size()
                )
                .totalScore(
                        totalScore
                )
                .percentage(
                        Math.round(
                                percentage * 100
                        ) / 100.0
                )
                .status(
                        interview.getStatus()
                )
                .answers(
                        answerResponses
                )
                .build();
    }


    // =====================================================
    // SECURITY
    // =====================================================

    private Interview getUserInterview(
            String username,
            Long interviewId
    ) {

        Interview interview =
                interviewRepository
                        .findById(interviewId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Interview not found"
                                )
                        );


        if (
                !interview
                        .getUser()
                        .getUsername()
                        .equals(username)
        ) {

            throw new RuntimeException(
                    "You are not allowed to access this interview"
            );
        }


        return interview;
    }
}