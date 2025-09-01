package com.mosip.inji_usecase.entity.driver;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "driver", schema = "driver_registration")
@Data
public class DriverEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "uin", unique = true, nullable = false)
    private String uin;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "gender")
    private String gender;

    @Column(name = "email_id")
    private String emailId;

    @Column(name = "city")
    private String city;

    @Column(name = "face_image")
    private byte[] faceImage;

    @Column(name = "drivers_license_number", nullable = false)
    private String driversLicenseNumber;

    @Column(name = "passport_number", nullable = false)
    private String passportNumber;

    @Column(name = "cpc_certificate", nullable = false)
    private byte[] cpcCertificate;

    @Column(name = "company_id", nullable = false)
    private Integer companyId;
}
