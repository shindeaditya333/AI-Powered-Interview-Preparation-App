package com.aditya.interview_prep_app.controller;

import com.aditya.interview_prep_app.dto.LoginRequest;
import com.aditya.interview_prep_app.dto.RegisterRequest;
import com.aditya.interview_prep_app.service.AuthService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;


    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        String token =
                authService.register(request);

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "username",
                        request.getUsername()
                )
        );
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request
    ) {

        String token =
                authService.login(request);

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "username",
                        request.getUsername()
                )
        );
    }
}