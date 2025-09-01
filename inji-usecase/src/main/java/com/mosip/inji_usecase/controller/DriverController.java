package com.mosip.inji_usecase.controller;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mosip.inji_usecase.service.repository.DriverRepositoryService;
import com.mosip.inji_usecase.service.validation.DriverValidationService;
import com.mosip.inji_usecase.service.notification.KernelNotificationService;
import com.mosip.inji_usecase.dto.notification.EmailResponse;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private static final Logger logger = LoggerFactory.getLogger(DriverController.class);

    private final DriverValidationService driverValidationService;
    private final DriverRepositoryService driverRepositoryService;

    @Autowired
    private KernelNotificationService notificationService;

    @PostMapping("/register")
    public ResponseEntity<Object> registerDriver(@RequestBody Map<String, Object> driverData) {
        try {
            // Validate driver data
            driverValidationService.validate(driverData);

            // Save driver
            Map<String, Object> savedDriver = driverRepositoryService.save(driverData);

            // Send email notification asynchronously (non-blocking)
            if (savedDriver.get("emailId") != null) {
                CompletableFuture<EmailResponse> emailFuture =
                        notificationService.sendDriverRegistrationEmail(savedDriver);

                // Log email status (non-blocking)
                emailFuture.thenAccept(emailResponse -> {
                    if (emailResponse.isSuccess()) {
                        logger.info("Registration email sent successfully for driver ID: {}",
                                savedDriver.get("id"));
                    } else {
                        logger.warn("Failed to send registration email for driver ID: {}. Error: {}",
                                savedDriver.get("id"), emailResponse.getErrorMessage());
                    }
                }).exceptionally(throwable -> {
                    logger.error("Exception occurred while sending email for driver ID: {}",
                            savedDriver.get("id"), throwable);
                    return null;
                });
            }

            // ✅ SUCCESS RESPONSE - Exact message as specified
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Driver registration successful.",
                    "data", savedDriver
            ));

        } catch (IllegalArgumentException e) {
            String errorMessage = e.getMessage().toLowerCase();

            // ✅ REQUIRED FIELDS OR VALIDATION ERRORS
            if (errorMessage.contains("missing required field") ||
                    errorMessage.contains("must be") ||
                    errorMessage.contains("does not match pattern") ||
                    errorMessage.contains("failed length validation") ||
                    errorMessage.contains("cannot be empty") ||
                    errorMessage.contains("field") && errorMessage.contains("required")) {

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                        "error", "Please fill all required fields correctly before submitting.",
                        "details", e.getMessage()
                ));
            }

            // ✅ DRIVER ALREADY REGISTERED - Updated to match UIN specifically
            if (errorMessage.contains("already exists") ||
                    errorMessage.contains("already registered")) {

                // Check if it's specifically a UIN error
                if (errorMessage.contains("uin")) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                            "error", "Driver with this UIN is already registered.",
                            "details", e.getMessage()
                    ));
                }
                // For other already registered errors (email, license)
                else {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                            "error", "Driver with this information is already registered.",
                            "details", e.getMessage()
                    ));
                }
            }

            // ✅ INVALID FILE FORMAT - Exact message as specified
            if (errorMessage.contains("invalid file type") ||
                    errorMessage.contains("unsupported file") ||
                    errorMessage.contains("file format") ||
                    errorMessage.contains("upload valid pdf or image documents")) {

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                        "error", "Unsupported file type. Please upload valid PDF or image documents.",
                        "details", e.getMessage()
                ));
            }

            // Default validation error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "error", "Please fill all required fields correctly before submitting.",
                    "details", e.getMessage()
            ));

        } catch (Exception e) {
            logger.error("Unexpected error during driver registration", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "error", "Registration failed due to server error. Please try again.",
                    "details", e.getMessage()
            ));
        }
    }

    // Alternative endpoint compatible with DataController pattern
    @PostMapping
    public ResponseEntity<Object> ingestDriverData(
            @RequestHeader(name = "x-source", defaultValue = "driver") String dataSource,
            @RequestBody Map<String, Object> data) {

        if (!"driver".equals(dataSource)) {
            return ResponseEntity.badRequest()
                    .body("Invalid data source. Expected 'driver'.");
        }

        return registerDriver(data);
    }
}
