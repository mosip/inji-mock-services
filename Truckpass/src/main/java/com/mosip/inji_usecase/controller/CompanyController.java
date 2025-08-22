package com.mosip.inji_usecase.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.mosip.inji_usecase.service.repository.CompanyRepositoryService;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyRepositoryService companyRepositoryService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllCompanies() {
        List<Map<String, Object>> companies = companyRepositoryService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchCompanies(
            @RequestParam("text") String searchText) {
        List<Map<String, Object>> companies = companyRepositoryService.searchCompaniesByText(searchText);
        return ResponseEntity.ok(companies);
    }
}
