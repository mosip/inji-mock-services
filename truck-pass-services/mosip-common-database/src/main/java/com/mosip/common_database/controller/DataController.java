package com.mosip.common_database.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.mosip.common_database.service.repository.TruckPassRepositoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.mosip.common_database.service.query.SearchCriteria;
import com.mosip.common_database.service.query.SearchDto;
import com.mosip.common_database.service.query.SpecificationBuilder;
import com.mosip.common_database.service.repository.RepositoryService;
import com.mosip.common_database.service.validation.ValidationService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
public class DataController {

    private final Map<String, ValidationService> validationServices;
    private final Map<String, RepositoryService> repositoryServices;

    @GetMapping("/api/data/retrieve/{id}")
    public ResponseEntity<?> retrieveDataById(@PathVariable("id") Long id) {

        List<Map<String, Object>> result = new ArrayList<>();

        System.out.println(repositoryServices.entrySet());
        for (Map.Entry<String, RepositoryService> repository : repositoryServices.entrySet()) {

            Optional<Map<String, Object>> entity = repository.getValue().getById(id);
            // System.out.println("Called from DataController: " + entity);
            entity.ifPresent(object -> result.addLast(object));

        }
        // System.out.println(result);

        return ResponseEntity.ok(result);
    }


    @GetMapping("/api/data/truckpass/uin/{uin}")
    public ResponseEntity<Map<String, Object>> getDriverDetailsByUIN(@PathVariable("uin") String uin) {
        RepositoryService repositoryService = repositoryServices.get("truckpassRepositoryService");

        if (repositoryService instanceof TruckPassRepositoryService) {
            Optional<Map<String, Object>> driverDetails =
                    ((TruckPassRepositoryService) repositoryService).getDriverDetailsByUIN(uin);

            if (driverDetails.isPresent()) {
                return ResponseEntity.ok(driverDetails.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        }

        return ResponseEntity.badRequest().body(Map.of("error", "Repository service not found"));
    }


    @GetMapping("/api/data/query")
    public ResponseEntity<List<Map<String, Object>>> retrieveDataByQuery(@RequestBody SearchDto params) {
        List<Map<String, Object>> result = new ArrayList<>();
        SpecificationBuilder<Object> builder = new SpecificationBuilder<>();
        List<SearchCriteria> criteriaList = params.getSearchCriteria();
        if (criteriaList != null) {
            criteriaList.forEach(x -> {
                x.setDataOption(params
                        .getDataOption());
                builder.with(x);
            });
        }



        for (Map.Entry<String, RepositoryService> repo : repositoryServices.entrySet()) {
            try {
                // System.out.println(repo.getKey() + " " + repo.getValue());
                result.addAll(repo.getValue().getBySearchCriteria(builder.build()));
            } catch (Exception e) {
                System.err.println("Search failed for repository " + repo.getKey() + ": " + e.getMessage());
            }
        }

        return ResponseEntity.ok(result);

    }

    @GetMapping("/api/data/truckpass/email/{emailId}")
    public ResponseEntity<?> getTruckPassByEmail(@PathVariable("emailId") String email) {
        RepositoryService repositoryService = repositoryServices.get("truckpassRepositoryService");

        if (repositoryService instanceof TruckPassRepositoryService) {
            try {
                List<Map<String,Object>> truckPasses =
                        ((TruckPassRepositoryService) repositoryService).getTruckPassByEmail(email);

                if (!truckPasses.isEmpty()) {
                    return ResponseEntity.ok(truckPasses);
                } else {
                    return ResponseEntity.notFound().build();
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to retrieve truck pass: " + e.getMessage()));
            }
        }

        return ResponseEntity.badRequest()
                .body(Map.of("error", "TruckPass repository service not found"));
    }


    @PostMapping("/api/data/ingest")
    public ResponseEntity<?> ingestData(
            @RequestHeader(name = "x-source") String dataSource,
            @RequestBody Map<String, Object> data) {
        ValidationService validationService = validationServices.get(dataSource + "ValidationService");
        RepositoryService repositoryService = repositoryServices.get(dataSource + "RepositoryService");

        if (validationService == null) {
            return ResponseEntity.badRequest().body("Unknown data source: " + dataSource);
        }

        try {

            validationService.validate(data);
            repositoryService.save(data);
            return ResponseEntity.ok().build();

        } catch (IllegalArgumentException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("VALIDATION ERROR:: '" + e.getMessage() + "'");

        }
    }

}
