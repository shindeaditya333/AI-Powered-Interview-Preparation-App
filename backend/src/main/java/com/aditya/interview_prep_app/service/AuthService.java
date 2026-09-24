package com.aditya.interview_prep_app.service;

import com.aditya.interview_prep_app.dto.LoginRequest;
import com.aditya.interview_prep_app.dto.RegisterRequest;
import com.aditya.interview_prep_app.entity.User;
import com.aditya.interview_prep_app.repository.UserRepository;
import com.aditya.interview_prep_app.security.JwtService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    public String register(
            RegisterRequest request
    ) {

        if (
                userRepository.existsByUsername(
                        request.getUsername()
                )
        ) {

            throw new IllegalArgumentException(
                    "Username already exists"
            );
        }

        User user =
                User.builder()
                        .username(
                                request.getUsername()
                        )
                        .password(
                                passwordEncoder.encode(
                                        request.getPassword()
                                )
                        )
                        .role("USER")
                        .build();

        userRepository.save(user);

        return jwtService.generateToken(
                createUserDetails(user)
        );
    }

    public String login(
            LoginRequest request
    ) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user =
                userRepository
                        .findByUsername(
                                request.getUsername()
                        )
                        .orElseThrow();

        return jwtService.generateToken(
                createUserDetails(user)
        );
    }

    private UserDetails createUserDetails(
            User user
    ) {

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                List.of(
                        new SimpleGrantedAuthority(
                                "ROLE_" + user.getRole()
                        )
                )
        );
    }
}