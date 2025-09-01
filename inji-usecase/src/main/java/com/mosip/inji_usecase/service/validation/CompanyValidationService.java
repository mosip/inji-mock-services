package com.mosip.inji_usecase.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service("companyValidationService")
public class CompanyValidationService extends AbstractValidationService {

    private static final Logger logger = LoggerFactory.getLogger(CompanyValidationService.class);

    public CompanyValidationService(VerifyFieldService verifyFieldService) {
        super(verifyFieldService, "validation/company.json", logger);
    }
}
