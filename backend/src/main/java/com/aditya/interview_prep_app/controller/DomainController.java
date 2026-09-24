package com.aditya.interview_prep_app.controller;

import com.aditya.interview_prep_app.entity.Domain;
import com.aditya.interview_prep_app.service.DomainService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/domains")
@RequiredArgsConstructor
public class DomainController {

    private final DomainService domainService;


    @GetMapping
    public List<Domain> getDomains() {

        return domainService.getAllDomains();
    }
}