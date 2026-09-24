package com.aditya.interview_prep_app.service;

import com.aditya.interview_prep_app.entity.Domain;
import com.aditya.interview_prep_app.repository.DomainRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DomainService {

    private final DomainRepository domainRepository;

    public List<Domain> getAllDomains() {

        return domainRepository.findAll();
    }
}