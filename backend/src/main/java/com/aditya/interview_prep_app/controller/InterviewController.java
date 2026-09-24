package com.aditya.interview_prep_app.controller;

import com.aditya.interview_prep_app.dto.AnswerRequest;
import com.aditya.interview_prep_app.dto.AnswerResponse;
import com.aditya.interview_prep_app.dto.InterviewResponse;
import com.aditya.interview_prep_app.dto.InterviewResultResponse;
import com.aditya.interview_prep_app.service.InterviewService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;


    // =====================================================
    // START
    // =====================================================

    @PostMapping("/start")
    public ResponseEntity<InterviewResponse> startInterview(
            Authentication authentication,
            @RequestParam Long domainId,
            @RequestParam String mode
    ) {

        InterviewResponse response =
                interviewService.startInterview(
                        authentication.getName(),
                        domainId,
                        mode
                );


        return ResponseEntity.ok(response);
    }


    // =====================================================
    // SUBMIT ANSWER
    // =====================================================

    @PostMapping("/answer")
    public ResponseEntity<AnswerResponse> submitAnswer(
            Authentication authentication,
            @Valid @RequestBody AnswerRequest request
    ) {

        AnswerResponse response =
                interviewService.saveAnswer(
                        authentication.getName(),
                        request
                );


        return ResponseEntity.ok(response);
    }


    // =====================================================
    // COMPLETE
    // =====================================================

    @PostMapping("/{interviewId}/complete")
    public ResponseEntity<InterviewResultResponse>
    completeInterview(
            Authentication authentication,
            @PathVariable Long interviewId
    ) {

        InterviewResultResponse response =
                interviewService.completeInterview(
                        authentication.getName(),
                        interviewId
                );


        return ResponseEntity.ok(response);
    }


    // =====================================================
    // RESULT
    // =====================================================

    @GetMapping("/{interviewId}/result")
    public ResponseEntity<InterviewResultResponse>
    getResult(
            Authentication authentication,
            @PathVariable Long interviewId
    ) {

        InterviewResultResponse response =
                interviewService.getInterviewResult(
                        authentication.getName(),
                        interviewId
                );


        return ResponseEntity.ok(response);
    }
}