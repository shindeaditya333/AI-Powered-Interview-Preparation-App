package com.aditya.interview_prep_app.service;

import com.aditya.interview_prep_app.entity.Answer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import com.google.genai.types.UploadFileConfig;


@Service
public class GeminiService {

    private final Client client;

    private final String model;

    private final String transcriptionModel;


    public GeminiService(
            @Value("${gemini.api-key}") String apiKey,
            @Value("${gemini.model}") String model,
            @Value("${gemini.transcription-model}") String transcriptionModel
    ) {

        if (apiKey == null || apiKey.isBlank()) {

            throw new IllegalStateException(
                    "GEMINI_API_KEY is not configured"
            );
        }

        this.client =
                Client.builder()
                        .apiKey(apiKey)
                        .build();

        this.model = model;
        this.transcriptionModel = transcriptionModel;
    }


    // =========================================================
    // TEXT ANSWER EVALUATION
    // =========================================================

    public GeminiEvaluation evaluateAnswer(
            String question,
            String expectedAnswer,
            String candidateAnswer
    ) {

        String prompt = """
                You are an expert technical interviewer.

                Evaluate the candidate's answer.

                INTERVIEW QUESTION:
                %s

                REFERENCE ANSWER:
                %s

                CANDIDATE ANSWER:
                %s

                Evaluate the candidate based on:

                1. Correctness
                2. Technical understanding
                3. Completeness
                4. Clarity
                5. Technical accuracy

                Give a score from 0 to 10.

                Give concise and constructive feedback.

                Return ONLY:

                SCORE: <number>
                FEEDBACK: <feedback>
                """.formatted(
                question,
                expectedAnswer,
                candidateAnswer
        );


        GenerateContentResponse response =
                client.models.generateContent(
                        model,
                        prompt,
                        null
                );


        String result =
                response.text();


        return parseEvaluation(result);
    }


    // =========================================================
    // AUDIO TRANSCRIPTION
    // =========================================================

    public String transcribeAudio(MultipartFile audioFile) {

        try {

            byte[] audioBytes =
                    audioFile.getBytes();

            com.google.genai.types.File uploadedFile =
                    client.files.upload(
                            audioBytes,
                            UploadFileConfig.builder()
                                    .mimeType("audio/webm")
                                    .build()
                    );

            String fileUri =
                    uploadedFile.uri()
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Gemini did not return a file URI"
                                    )
                            );

            String mimeType =
                    uploadedFile.mimeType()
                            .orElse("audio/webm");

            Content content =
                    Content.fromParts(
                            Part.fromUri(
                                    fileUri,
                                    mimeType
                            )
                    );

            GenerateContentResponse response =
                    client.models.generateContent(
                            "gemini-3.5-transcribe",
                            content,
                            null
                    );

            return response.text();

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "Unable to transcribe audio: "
                            + e.getMessage(),
                    e
            );
        }
    }


    // =========================================================
// AUDIO INTERVIEW EVALUATION
// =========================================================

    public List<AudioEvaluation> evaluateAudioInterview(
            List<Answer> answers
    ) {

        try {

            List<Part> parts = new ArrayList<>();

            String prompt = """
                You are an expert technical interviewer.

                You are evaluating an audio-based technical interview.

                For each question:

                1. Listen to the candidate's audio answer.
                2. Transcribe the candidate's spoken answer accurately.
                3. Evaluate the answer based ONLY on the question.
                4. Give a score from 0 to 10.
                5. Give concise and constructive feedback.

                Do NOT use any reference answer.

                Return ONLY valid JSON in this exact format:

                {
                  "evaluations": [
                    {
                      "questionId": 1,
                      "transcript": "candidate's complete spoken answer",
                      "score": 8,
                      "feedback": "Good explanation of the concept."
                    }
                  ]
                }

                Evaluate every audio question provided.
                """;

            parts.add(Part.fromText(prompt));

            for (Answer answer : answers) {

                if (answer.getAudioQuestion() == null) {
                    continue;
                }

                String audioUrl =
                        answer.getAnswerAudioUrl();

                if (audioUrl == null || audioUrl.isBlank()) {
                    continue;
                }

                Long questionId =
                        answer.getAudioQuestion().getId();

                String question =
                        answer.getAudioQuestion().getQuestion();

                parts.add(
                        Part.fromText(
                                "QUESTION ID: "
                                        + questionId
                                        + "\nQUESTION: "
                                        + question
                        )
                );

                Path audioPath =
                        getAudioPath(audioUrl);

                byte[] audioBytes =
                        Files.readAllBytes(audioPath);

                parts.add(
                        Part.fromBytes(
                                audioBytes,
                                "audio/webm"
                        )
                );
            }

            Content content =
                    Content.fromParts(
                            parts.toArray(new Part[0])
                    );

            GenerateContentConfig config =
                    GenerateContentConfig.builder()
                            .responseMimeType("application/json")
                            .temperature(0.1f)
                            .maxOutputTokens(5000)
                            .build();

            GenerateContentResponse response =
                    client.models.generateContent(
                            model,
                            content,
                            config
                    );

            String json =
                    response.text()
                            .replace("```json", "")
                            .replace("```", "")
                            .trim();

            ObjectMapper mapper =
                    new ObjectMapper();

            JsonNode root =
                    mapper.readTree(json);

            List<AudioEvaluation> evaluations =
                    new ArrayList<>();

            for (JsonNode node :
                    root.get("evaluations")) {

                evaluations.add(
                        new AudioEvaluation(
                                node.get("questionId").asLong(),
                                node.get("transcript").asText(),
                                node.get("score").asInt(),
                                node.get("feedback").asText()
                        )
                );
            }

            return evaluations;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Audio interview evaluation failed: "
                            + e.getMessage(),
                    e
            );
        }
    }

    private Path getAudioPath(String audioUrl) {

        Path uploadDirectory =
                Paths.get("uploads")
                        .toAbsolutePath()
                        .normalize();

        String relativePath =
                audioUrl.replaceFirst(
                        "^/uploads/",
                        ""
                );

        Path audioPath =
                uploadDirectory
                        .resolve(relativePath)
                        .normalize();

        if (!audioPath.startsWith(uploadDirectory)) {

            throw new RuntimeException(
                    "Invalid audio path"
            );
        }

        return audioPath;
    }

    public List<VideoEvaluation> evaluateVideoInterview(
            List<Answer> answers
    ) {
        try {

            List<Part> parts = new ArrayList<>();

            StringBuilder prompt = new StringBuilder();

            prompt.append("""
                You are an expert technical interviewer.

                Evaluate the candidate's video-based technical interview.

                For every question:
                1. Listen to the candidate's spoken answer.
                2. Transcribe the spoken answer accurately.
                3. Evaluate the technical answer based ONLY on the question.
                4. Give a score from 0 to 10.
                5. Give concise constructive feedback.

                Do not evaluate:
                - appearance
                - attractiveness
                - ethnicity
                - physical characteristics

                Return ONLY valid JSON.

                {
                  "evaluations": [
                    {
                      "questionId": 1,
                      "transcript": "...",
                      "score": 8,
                      "feedback": "..."
                    }
                  ]
                }

                QUESTIONS AND VIDEOS:

                """);

            for (Answer answer : answers) {

                if (answer.getVideoQuestion() == null) {
                    continue;
                }

                Long questionId =
                        answer.getVideoQuestion().getId();

                String question =
                        answer.getVideoQuestion().getQuestion();

                prompt.append("\nQuestion ID: ")
                        .append(questionId)
                        .append("\nQuestion: ")
                        .append(question)
                        .append("\n");

                Path videoPath =
                        getVideoPath(
                                answer.getAnswerVideoUrl()
                        );

                byte[] videoBytes =
                        Files.readAllBytes(videoPath);

                parts.add(
                        Part.fromBytes(
                                videoBytes,
                                "video/webm"
                        )
                );
            }

            Content content =
                    Content.builder()
                            .role("user")
                            .parts(
                                    parts
                            )
                            .build();

            // Put the prompt before the video parts
            List<Part> allParts =
                    new ArrayList<>();

            allParts.add(
                    Part.fromText(
                            prompt.toString()
                    )
            );

            allParts.addAll(parts);

            content =
                    Content.builder()
                            .role("user")
                            .parts(allParts)
                            .build();

            GenerateContentConfig config =
                    GenerateContentConfig.builder()
                            .responseMimeType(
                                    "application/json"
                            )
                            .maxOutputTokens(5000)
                            .build();

            GenerateContentResponse response =
                    client.models.generateContent(
                            model,
                            content,
                            config
                    );

            String json =
                    response.text();

            ObjectMapper mapper =
                    new ObjectMapper();

            JsonNode root =
                    mapper.readTree(json);

            List<VideoEvaluation> evaluations =
                    new ArrayList<>();

            for (JsonNode node :
                    root.get("evaluations")) {

                evaluations.add(
                        new VideoEvaluation(
                                node.get("questionId")
                                        .asLong(),

                                node.get("transcript")
                                        .asText(),

                                node.get("score")
                                        .asInt(),

                                node.get("feedback")
                                        .asText()
                        )
                );
            }

            return evaluations;

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "Video evaluation failed: " + e.getMessage(),
                    e
            );
        }
    }


    private Path getVideoPath(String videoUrl) {

        String relativePath =
                videoUrl.replace(
                        "/uploads/",
                        ""
                );

        return Paths.get(
                "uploads",
                relativePath
        );
    }

    // =========================================================
    // PARSE GEMINI EVALUATION
    // =========================================================

    private GeminiEvaluation parseEvaluation(
            String response
    ) {

        int score = 0;

        String feedback =
                "Unable to generate feedback.";


        String[] lines =
                response.split("\\R");


        for (String line : lines) {

            String trimmed =
                    line.trim();


            if (
                    trimmed
                            .toUpperCase()
                            .startsWith("SCORE:")
            ) {

                try {

                    String scoreText =
                            trimmed
                                    .substring(
                                            "SCORE:".length()
                                    )
                                    .trim();


                    score =
                            Integer.parseInt(
                                    scoreText
                            );


                    score =
                            Math.max(0, Math.min(10, score));

                } catch (NumberFormatException ignored) {
                }
            }


            if (
                    trimmed
                            .toUpperCase()
                            .startsWith("FEEDBACK:")
            ) {

                feedback =
                        trimmed
                                .substring(
                                        "FEEDBACK:".length()
                                )
                                .trim();
            }
        }


        return new GeminiEvaluation(
                score,
                feedback
        );
    }


    public record GeminiEvaluation(
            int score,
            String feedback
    ) {
    }

    public record AudioEvaluation(
            Long questionId,
            String transcript,
            int score,
            String feedback
    ) {
    }

    public record VideoEvaluation(
            Long questionId,
            String transcript,
            int score,
            String feedback
    ) {}
}