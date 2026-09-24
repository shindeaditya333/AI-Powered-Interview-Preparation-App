package com.aditya.interview_prep_app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    private final Path audioDirectory =
            Paths.get("uploads/audio")
                    .toAbsolutePath()
                    .normalize();

    private final Path videoDirectory =
            Paths.get("uploads/video")
                    .toAbsolutePath()
                    .normalize();


    @PostMapping("/audio")
    public ResponseEntity<?> uploadAudio(
            @RequestParam("file")
            MultipartFile file
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


            Files.createDirectories(
                    audioDirectory
            );


            String originalName =
                    file.getOriginalFilename();


            String extension =
                    ".webm";


            if (
                    originalName != null &&
                            originalName.contains(".")
            ) {

                extension =
                        originalName.substring(
                                originalName.lastIndexOf(".")
                        );
            }


            String fileName =
                    UUID.randomUUID()
                            + extension;


            Path target =
                    audioDirectory.resolve(
                            fileName
                    );


            file.transferTo(
                    target.toFile()
            );


            String url =
                    "/uploads/audio/"
                            + fileName;


            return ResponseEntity.ok(
                    Map.of(
                            "url",
                            url
                    )
            );

        } catch (IOException e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            Map.of(
                                    "message",
                                    "Unable to upload audio"
                            )
                    );
        }
    }

    @PostMapping("/video")
    public ResponseEntity<?> uploadVideo(
            @RequestParam("file")
            MultipartFile file
    ) {

        try {

            if (file.isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Video file is empty"
                                )
                        );
            }

            Files.createDirectories(
                    videoDirectory
            );

            String originalName =
                    file.getOriginalFilename();

            String extension =
                    ".webm";

            if (
                    originalName != null &&
                            originalName.contains(".")
            ) {

                extension =
                        originalName.substring(
                                originalName.lastIndexOf(".")
                        );
            }

            String fileName =
                    UUID.randomUUID()
                            + extension;

            Path target =
                    videoDirectory.resolve(
                            fileName
                    );

            file.transferTo(
                    target.toFile()
            );

            String url =
                    "/uploads/video/"
                            + fileName;

            return ResponseEntity.ok(
                    Map.of(
                            "url",
                            url
                    )
            );

        } catch (IOException e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            Map.of(
                                    "message",
                                    "Unable to upload video"
                            )
                    );
        }
    }
}