package com.mosip.inji_usecase.controller;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mosip.inji_usecase.service.repository.DriverRepositoryService;
import com.mosip.inji_usecase.service.validation.DriverValidationService;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverValidationService driverValidationService;
    private final DriverRepositoryService driverRepositoryService;

    @PostMapping("/register")
    public ResponseEntity<Object> registerDriver(@RequestBody Map<String, Object> driverData) {
        try {
            // Validate driver data
            driverValidationService.validate(driverData);

            // Save driver and send email notification
            Map<String, Object> savedDriver = driverRepositoryService.save(driverData);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Driver registration successful.",
                    "data", savedDriver
            ));

        } catch (IllegalArgumentException e) {
            String errorMessage = e.getMessage().toLowerCase();

            // Check for specific error types and return appropriate messages
            if (errorMessage.contains("missing required field") ||
                    errorMessage.contains("must be") ||
                    errorMessage.contains("does not match pattern") ||
                    errorMessage.contains("failed length validation") ||
                    errorMessage.contains("cannot be empty")) {

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                        "error", "Please fill all required fields correctly before submitting.",
                        "details", e.getMessage()
                ));
            }

            if (errorMessage.contains("already exists") ||
                    errorMessage.contains("already registered")) {

                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                        "error", "Driver with this UIN is already registered.",
                        "details", e.getMessage()
                ));
            }

            if (errorMessage.contains("invalid base64") ||
                    errorMessage.contains("unsupported file") ||
                    errorMessage.contains("file format") ||
                    errorMessage.contains("invalid file type")) {

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                        "error", "Unsupported file type. Please upload valid PDF or image documents",
                        "details", e.getMessage()
                ));
            }

            // Default validation error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "error", "Please fill all required fields correctly before submitting.",
                    "details", e.getMessage()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "error", "Registration failed due to server error. Please try again.",
                    "details", e.getMessage()
            ));
        }
    }
}
