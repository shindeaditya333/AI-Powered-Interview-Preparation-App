package com.aditya.interview_prep_app.controller;

import com.aditya.interview_prep_app.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/transcription")
@RequiredArgsConstructor
public class TranscriptionController {

    private final GeminiService geminiService;


    @PostMapping
    public ResponseEntity<?> transcribe(
            @RequestParam("file") MultipartFile file
    ) {

        try {

            if (file.isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Audio file is empty"
                                )
                        );
            }


            String transcript =
                    geminiService.transcribeAudio(file);


            return ResponseEntity.ok(
                    Map.of(
                            "transcript",
                            transcript
                    )
            );


        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            Map.of(
                                    "message",
                                    "Unable to transcribe audio"
                            )
                    );
        }
    }
}