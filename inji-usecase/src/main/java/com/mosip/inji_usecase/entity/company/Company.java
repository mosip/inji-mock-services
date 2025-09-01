package com.mosip.inji_usecase.entity.company;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "company", schema = "company_details")
@Data
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "registration_status")
    private String registrationStatus;

    @Column(name = "registration_type")
    private String registrationType;

    @Column(name = "registered_email", unique = true, nullable = false)
    private String registeredEmail;
}
