package com.mosip.common_database.service.validation;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;

@Service("truckpassValidationService")
public class TruckpassValidationService implements ValidationService {

    private final VerifyFieldService verifyFieldService;

    private Set<String> requiredFields = new HashSet<>();
    private Map<String, Object> fields = new HashMap<>();

    public TruckpassValidationService(VerifyFieldService verifyFieldService) {
        this.verifyFieldService = verifyFieldService;
    }

    private Map<String, Object> readConfig(InputStream in) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(in, new TypeReference<Map<String, Object>>() {});
        } catch (IOException e) {
            System.out.println("Given file is empty or invalid");
            return Collections.emptyMap();
        }
    }

    @PostConstruct
    private void loadConfig() {
        try {
            InputStream in = getClass().getClassLoader().getResourceAsStream("validation/truckpass.json");
            if (in == null) {
                throw new RuntimeException("Config file not found: validation/truckpass.json");
            }

            Map<String, Object> config = readConfig(in);

            if (config == null || config.isEmpty()) {
                requiredFields = Set.of("truckNumber", "driverName", "driverUIN");
                fields = new HashMap<>();
                return;
            }

            Object requiredObj = config.get("required");
            if (requiredObj instanceof List) {
                @SuppressWarnings("unchecked")
                List<String> reqList = (List<String>) requiredObj;
                requiredFields = new HashSet<>(reqList);
            } else {
                requiredFields = Set.of("truckNumber", "driverName", "driverUIN");
            }

            Object fieldsObj = config.get("fields");
            if (fieldsObj instanceof Map) {
                fields = new HashMap<>();
                @SuppressWarnings("unchecked")
                Map<String, Object> fieldMap = (Map<String, Object>) fieldsObj;
                for (Map.Entry<String, Object> entry : fieldMap.entrySet()) {
                    fields.put(entry.getKey(), entry.getValue());
                }
            } else {
                fields = new HashMap<>();
            }

        } catch (Exception e) {
            System.err.println("Failed to load config, using defaults: " + e.getMessage());
            requiredFields = Set.of("truckNumber", "driverName", "driverUIN");
            fields = new HashMap<>();
        }
    }

    @Override
    public void validate(Map<String, Object> data) { // FIXED - Proper generic type
        System.out.println("Called from TruckpassValidationService");
        verifyFieldService.verifyRequired(data, requiredFields);
        verifyFieldService.verify(data, fields);
        System.out.println("TruckpassValidationService: Validation Passed!");
    }
}
