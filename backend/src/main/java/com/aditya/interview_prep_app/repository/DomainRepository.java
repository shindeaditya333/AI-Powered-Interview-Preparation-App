package com.aditya.interview_prep_app.repository;

import com.aditya.interview_prep_app.entity.Domain;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DomainRepository extends JpaRepository<Domain, Long> {
}