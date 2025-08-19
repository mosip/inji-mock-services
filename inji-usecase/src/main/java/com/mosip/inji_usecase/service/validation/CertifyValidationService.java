package com.mosip.inji_usecase.service.validation;

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

@Service("certifyValidationService")
public class CertifyValidationService implements ValidationService{

    private final VerifyFieldService verifyFieldService;

    public CertifyValidationService(VerifyFieldService verifyFieldService) {
        this.verifyFieldService = verifyFieldService;
    }

    private Set<String> requiredFields;

    private Map<String, Object> fields;

    private Map<String, Object> readConfig(InputStream in) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(in, new TypeReference<Map<String, Object>>() {
            });
        } catch (IOException e) {
            System.out.println("Given file is empty or invalid");
            return Collections.emptyMap();
        }
    }

    private void loadConfig() {
        
        try {
            InputStream in = getClass().getClassLoader().getResourceAsStream("validation/certify.json");
            if (in == null) {
                throw new RuntimeException("Config file not found: validation/certify.json");
            }
            Map<String, Object> config = readConfig(in);

            requiredFields = new HashSet<>((List<String>) config.get("required"));

            fields = new HashMap<>();
            Map<String, Object> f = (Map<String, Object>) config.get("fields");
            for(Map.Entry<String, Object> entry : f.entrySet()) {
                fields.put(entry.getKey(), entry.getValue());
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to load config for CertifyValidationService", e);
        }

    }

    @Override
    public void validate(Map<String, Object> data){

        loadConfig();
        System.out.println("Called from CertifyValidationService");

        verifyFieldService.verifyRequired(data, requiredFields);
        verifyFieldService.verify(data, fields);


        System.out.println("CertifyValidationService: Validation Passed!");
    }

}
