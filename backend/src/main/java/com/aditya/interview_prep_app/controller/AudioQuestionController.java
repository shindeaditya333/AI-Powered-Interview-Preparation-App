package com.aditya.interview_prep_app.controller;

import com.aditya.interview_prep_app.dto.AudioQuestionResponse;
import com.aditya.interview_prep_app.repository.AudioQuestionRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audio-questions")
@RequiredArgsConstructor
public class AudioQuestionController {

    private final AudioQuestionRepository audioQuestionRepository;

    @GetMapping("/domain/{domainId}")
    public List<AudioQuestionResponse> getByDomain(
            @PathVariable Long domainId
    ) {

        return audioQuestionRepository
                .findByDomainId(domainId)
                .stream()
                .limit(5)
                .map(AudioQuestionResponse::fromEntity)
                .toList();
    }
}