package com.mosip.inji_usecase.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mosip.inji_usecase.service.query.SearchCriteria;
import com.mosip.inji_usecase.service.query.SearchDto;
import com.mosip.inji_usecase.service.query.SpecificationBuilder;
import com.mosip.inji_usecase.service.repository.RepositoryService;
import com.mosip.inji_usecase.service.validation.ValidationService;
import com.mosip.inji_usecase.service.EmailService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
public class DataController {

    private static final Logger LOGGER = LoggerFactory.getLogger(DataController.class);

    private final Map<String, ValidationService> validationServices;
    private final Map<String, RepositoryService> repositoryServices;
    private final EmailService emailService;

    @GetMapping("/api/data/{id}")
    public ResponseEntity<?> retrieveDataById(@PathVariable("id") Long id) {

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, RepositoryService> repository : repositoryServices.entrySet()) {

            Optional<Map<String, Object>> entity = repository.getValue().getById(id);
            entity.ifPresent(object -> result.addLast(object));
        }

        if (result.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No data found for ID: " + id);
        else
            return ResponseEntity.ok(result);
    }

    @GetMapping("/api/data")
    public ResponseEntity<?> retrieveDataByQuery(@RequestParam List filterKey,
            @RequestParam List operation,
            @RequestParam List value,
            @RequestParam(required = false) String dataOption) {

        List<SearchCriteria> criterias = new ArrayList<>();
        for (int i = 0; i < filterKey.size(); i++) {
            SearchCriteria criteria = new SearchCriteria();
            criteria.setFilterKey(filterKey.get(i).toString());
            criteria.setOperation(operation.get(i).toString());
            criteria.setValue(value.get(i).toString());
            criteria.setDataOption(dataOption);
            criterias.add(criteria);
        }
        SearchDto params = new SearchDto(criterias, dataOption);
        List<Map<String, Object>> result = new ArrayList<>();
        SpecificationBuilder<?> builder = new SpecificationBuilder<>();
        List<SearchCriteria> criteriaList = params.getSearchCriteria();
        if (criteriaList != null) {
            criteriaList.forEach(x -> {
                x.setDataOption(params.getDataOption());
                builder.with(x);
            });
        }

        for (Map.Entry<String, RepositoryService> repo : repositoryServices.entrySet()) {
            try {
                result.addAll(repo.getValue().getBySearchCriteria(builder.build()));
            } catch (Exception e) {
                LOGGER.error("Search failed for repository {}: {}", repo.getKey(), e.getMessage(), e);
            }
        }

        if (result.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No data found for the given query criteria");
        else
            return ResponseEntity.ok(result);

    }

    @PostMapping("/api/data")
    public ResponseEntity<?> ingestData(
            @RequestHeader(name = "x-source") String dataSource,
            @RequestParam(required = false) String notifyEmail,
            @RequestBody Map<String, Object> data) {

        ValidationService validationService = validationServices.get(dataSource + "ValidationService");
        RepositoryService repositoryService = repositoryServices.get(dataSource + "RepositoryService");

        if (validationService == null) {
            return ResponseEntity.badRequest().body("Unknown data source: " + dataSource);
        }

        try {
            validationService.validate(data);
            repositoryService.save(data);

            // ---------- EMAIL TRIGGER: query-param support + recipient resolution
            // ----------
            String recipient = null;

            // 1) If notifyEmail query param provided, use it (highest priority)
            if (notifyEmail != null && !notifyEmail.trim().isEmpty()) {
                recipient = notifyEmail.trim();
            } else {
                // 2) Fallback: derive from x-source and request body
                String ds = (dataSource == null) ? "" : dataSource.trim().replaceAll("[^a-zA-Z]", "").toLowerCase();

                if ("farmer".equals(ds)) {
                    Object emailObj = data.get("email");
                    if (emailObj != null) {
                        String e = emailObj.toString().trim();
                        if (!e.isEmpty())
                            recipient = e;
                    }
                } else if ("driver".equals(ds) || "truckpass".equals(ds)) {
                    Object emailObj = data.get("driverEmailId");
                    if (emailObj != null) {
                        String e = emailObj.toString().trim();
                        if (!e.isEmpty())
                            recipient = e;
                    }
                }
            }

            // Only log when recipient not found — do NOT log email addresses or other
            // secrets
            if (recipient == null || recipient.isBlank()) {
                String dsForTemplate = (dataSource == null) ? ""
                        : dataSource.trim().replaceAll("[^a-zA-Z]", "").toLowerCase();
                LOGGER.warn("No valid recipient found; skipping email trigger for x-source: {}", dsForTemplate);
                return ResponseEntity.ok().build();
            }

            final String to = recipient;
            final String subject;
            final StringBuilder body = new StringBuilder();

            // choose template based on x-source (use cleaned ds for template selection)
            String dsForTemplate = (dataSource == null) ? ""
                    : dataSource.trim().replaceAll("[^a-zA-Z]", "").toLowerCase();
            if ("farmer".equals(dsForTemplate)) {
                subject = "Hello Farmer!";
                body.append("Dear Farmer,\r\n\r\n")
                        .append("Thank you for registering with us. Your details have been successfully recorded.\r\n\r\n")
                        .append("We appreciate your contribution to our agricultural community.\r\n\r\n")
                        .append("Warm regards,\r\nThe Farmer Support Team");
            } else if ("driver".equals(dsForTemplate) || "truckpass".equals(dsForTemplate)) {
                subject = "Your Truckpass is Ready";
                body.append("Hello,\r\n\r\nYour truckpass has been created and is ready.\r\n\r\n");
                if (data.get("truckpassId") != null) {
                    body.append("Truckpass ID: ").append(data.get("truckpassId").toString()).append("\r\n");
                }
                if (data.get("vehicleNumber") != null) {
                    body.append("Vehicle: ").append(data.get("vehicleNumber").toString()).append("\r\n");
                }
                body.append("\r\nRegards,\r\nTruckpass Team");
            } else {
                subject = "Data Received";
                body.append("Hello,\r\n\r\nYour data has been successfully recorded.\r\n\r\nRegards,\r\nTeam");
            }

            // send async so request returns immediately; do not print sensitive info
            java.util.concurrent.CompletableFuture.runAsync(() -> {
                try {
                    emailService.sendEmail(to, subject, body.toString());
                    // intentionally no logging of success/failure containing email addresses
                } catch (Exception e) {
                    // log generic error and include exception for troubleshooting (no sensitive
                    // data)
                    LOGGER.error("Failed to send notification email (non-sensitive error).", e);
                }
            });

            // return success immediately
            return ResponseEntity.ok().build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("VALIDATION ERROR:: '" + e.getMessage() + "'");
        }
    }

}
