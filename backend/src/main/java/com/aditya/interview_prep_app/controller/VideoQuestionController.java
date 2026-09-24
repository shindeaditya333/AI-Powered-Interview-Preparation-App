package com.aditya.interview_prep_app.controller;

import com.aditya.interview_prep_app.dto.VideoQuestionResponse;
import com.aditya.interview_prep_app.repository.VideoQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/video-questions")
@RequiredArgsConstructor
public class VideoQuestionController {

    private final VideoQuestionRepository videoQuestionRepository;

    @GetMapping("/domain/{domainId}")
    public List<VideoQuestionResponse> getByDomain(
            @PathVariable Long domainId
    ) {
        return videoQuestionRepository
                .findByDomainId(domainId)
                .stream()
                .limit(5)
                .map(VideoQuestionResponse::fromEntity)
                .toList();
    }
}