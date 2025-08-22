package com.mosip.inji_usecase.dto.truckpass;

import lombok.Data;

@Data
public class DriverDto {
    private Long id;
    private String fullName;
    private String uin;
    private String phoneNumber;
    private String gender;
    private String emailId;
    private String city;
    private String faceImage; // Base64 string
    private String driversLicenseNumber;
    private String passportNumber;
    private String cpcCertificate; // Base64 string
    private Integer companyId;
}
