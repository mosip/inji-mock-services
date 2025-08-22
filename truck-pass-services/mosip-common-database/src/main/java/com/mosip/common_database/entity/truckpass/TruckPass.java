package com.mosip.common_database.entity.truckpass;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;

@Entity
@Table(name = "truck_pass", schema = "truckpass")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TruckPass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "truck_number", nullable = false)
    private String truckNumber;

    @Column(name = "driver_name", nullable = false)
    private String driverName;

    @Column(name = "driveruin", nullable = false, unique = true)
    private String driverUIN;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "gender")
    private String gender;

    @Column(name = "email_id")
    private String emailId;

    @Column(name = "city")
    private String city;

    @Column(name = "face_image_path")
    private String faceImagePath;

    @Column(name = "drivers_license_number")
    private String driversLicenseNumber;

    @Column(name = "passport_number")
    private String passportNumber;

    @Column(name = "pass_start_date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime passStartDate;

    @Column(name = "pass_end_date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime passEndDate;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "status")
    private String status;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "ACTIVE";
    }
}
