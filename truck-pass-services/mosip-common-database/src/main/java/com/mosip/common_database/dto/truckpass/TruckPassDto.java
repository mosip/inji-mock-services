package com.mosip.common_database.dto.truckpass;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TruckPassDto {
    private Long id;
    private String truckNumber;
    private String driverName; // Full Name
    private String driverUIN;
    private String phoneNumber;
    private String gender;
    private String emailId;
    private String city;
    private String faceImagePath;
    private String driversLicenseNumber;
    private String passportNumber;
    private LocalDateTime passStartDate;
    private LocalDateTime passEndDate;
    private String createdBy;
    private LocalDateTime createdAt;
    private String status;
}
