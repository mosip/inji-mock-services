package com.mosip.inji_usecase.entity.truckpass;

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

    @Column(name = "uin")
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

    @Column(name = "drivers_license_number")
    private String driversLicenseNumber;

    @Column(name = "passport_number")
    private String passportNumber;

    @Column(name = "cpc_certificate")
    private byte[] cpcCertificate;

    @Column(name = "company_id")
    private Integer companyId;
}
