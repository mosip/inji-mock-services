package com.mosip.inji_usecase.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mosip.inji_usecase.service.query.SearchCriteria;
import com.mosip.inji_usecase.service.query.SearchDto;
import com.mosip.inji_usecase.service.query.SpecificationBuilder;
import com.mosip.inji_usecase.service.repository.RepositoryService;
import com.mosip.inji_usecase.service.validation.ValidationService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final Map<String, ValidationService> validationServices;
    private final Map<String, RepositoryService> repositoryServices;

    @GetMapping("/{id}")
    public ResponseEntity<?> retrieveCompanyById(@PathVariable("id") Long id) {
        List<Map<String, Object>> result = new ArrayList<>();
        // Only search in company repository
        RepositoryService companyRepo = repositoryServices.get("companyRepositoryService");
        if (companyRepo != null) {
            Optional<Map<String, Object>> entity = companyRepo.getById(id);
            entity.ifPresent(object -> result.add(object));
        }

        if(result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No company found for ID: " + id);
        } else {
            return ResponseEntity.ok(result);
        }
    }

    @GetMapping
    public ResponseEntity<?> retrieveCompaniesByQuery(
            @RequestParam(required = false) List<String> filterKey,
            @RequestParam(required = false) List<String> operation,
            @RequestParam(required = false) List<String> value,
            @RequestParam(required = false) String dataOption) {

        RepositoryService companyRepo = repositoryServices.get("companyRepositoryService");
        if (companyRepo == null) {
            return ResponseEntity.badRequest().body("Company service not available");
        }

        List<Map<String, Object>> result = new ArrayList<>();

        // If no search parameters provided, return all companies
        if (filterKey == null || filterKey.isEmpty()) {
            try {
                result.addAll(companyRepo.getAll());
                if (result.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("No companies found");
                }
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error retrieving companies: " + e.getMessage());
            }
        }

        // Validate that all required search parameters are provided if any are provided
        if (operation == null || value == null ||
                filterKey.size() != operation.size() || filterKey.size() != value.size()) {
            return ResponseEntity.badRequest()
                    .body("If search parameters are provided, filterKey, operation, and value must all be provided with the same number of elements");
        }

        List<SearchCriteria> criterias = new ArrayList<>();
        for(int i = 0; i < filterKey.size(); i++){
            SearchCriteria criteria = new SearchCriteria(
                    filterKey.get(i).toString(),
                    operation.get(i).toString(),
                    value.get(i).toString()
            );
            criteria.setDataOption(dataOption);
            criterias.add(criteria);
        }

        SearchDto params = new SearchDto(criterias, dataOption);
        SpecificationBuilder builder = new SpecificationBuilder<>();
        List<SearchCriteria> criteriaList = params.getSearchCriteria();
        if (criteriaList != null) {
            criteriaList.forEach(x -> {
                x.setDataOption(params.getDataOption());
                builder.with(x);
            });
        }

        try{
            result.addAll(companyRepo.getBySearchCriteria(builder.build()));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Search failed for company repository: " + e.getMessage());
        }

        if(result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No companies found for the given query criteria");
        } else {
            return ResponseEntity.ok(result);
        }
    }

    @PostMapping
    public ResponseEntity<?> ingestCompanyData(
            @RequestHeader(name = "x-source", defaultValue = "company") String dataSource,
            @RequestBody Map<String, Object> data) {

        ValidationService validationService = validationServices.get(dataSource + "ValidationService");
        RepositoryService repositoryService = repositoryServices.get(dataSource + "RepositoryService");

        if(validationService == null){
            return ResponseEntity.badRequest().body("Unknown data source: " + dataSource);
        }

        try{
            validationService.validate(data);
            repositoryService.save(data);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("VALIDATION ERROR:: '" + e.getMessage() + "'");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("SERVER ERROR:: '" + e.getMessage() + "'");
        }
    }

    // Additional company-specific search endpoint
    @GetMapping("/search")
    public ResponseEntity<?> searchCompanies(
            @RequestParam String text, // Changed from searchText to text
            @RequestParam(required = false, defaultValue = "any") String dataOption) {

        try {
            List<SearchCriteria> criterias = new ArrayList<>();
            // Search in company name
            SearchCriteria companyNameCriteria = new SearchCriteria("companyName", "cn", text);
            companyNameCriteria.setDataOption(dataOption);
            criterias.add(companyNameCriteria);

            // Search in registration type
            SearchCriteria registrationTypeCriteria = new SearchCriteria("registrationType", "cn", text);
            registrationTypeCriteria.setDataOption(dataOption);
            criterias.add(registrationTypeCriteria);

            // Search in registered email
            SearchCriteria emailCriteria = new SearchCriteria("registeredEmail", "cn", text);
            emailCriteria.setDataOption(dataOption);
            criterias.add(emailCriteria);

            SpecificationBuilder builder = new SpecificationBuilder<>();
            criterias.forEach(criteria -> builder.with(criteria));

            RepositoryService companyRepositoryService = repositoryServices.get("companyRepositoryService");
            if (companyRepositoryService == null) {
                return ResponseEntity.badRequest().body("Company service not available");
            }

            List<Map<String, Object>> result = companyRepositoryService.getBySearchCriteria(builder.build());
            if (result.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No companies found matching search criteria: " + text);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error searching companies: " + e.getMessage());
        }
    }
}
