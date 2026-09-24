package com.aditya.interview_prep_app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class EnvTest implements CommandLineRunner {

    @Value("${DB_USERNAME:NOT_FOUND}")
    private String username;

    @Value("${DB_PASSWORD:NOT_FOUND}")
    private String password;

    @Override
    public void run(String... args) {
        System.out.println("DB_USERNAME = " + username);
        System.out.println("DB_PASSWORD loaded = " +
                (!password.equals("NOT_FOUND") && !password.isBlank()));
    }
}