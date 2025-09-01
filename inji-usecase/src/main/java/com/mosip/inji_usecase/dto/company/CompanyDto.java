package com.mosip.inji_usecase.dto.company;

import lombok.Data;

@Data
public class CompanyDto {
    private Long id;
    private String companyName;
    private String registrationStatus;
    private String registrationType;
    private String registeredEmail;
}
