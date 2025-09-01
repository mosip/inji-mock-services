package com.mosip.inji_usecase.service.repository;

import org.springframework.stereotype.Service;

import com.mosip.inji_usecase.dto.company.CompanyDto;
import com.mosip.inji_usecase.entity.company.Company;
import com.mosip.inji_usecase.mapper.company.CompanyMapper;
import com.mosip.inji_usecase.repository.company.CompanyRepository;

@Service("companyRepositoryService")
public class CompanyRepositoryService
        extends AbstractRepositoryService<Company, Long, CompanyDto, CompanyRepository, CompanyMapper> {

    public CompanyRepositoryService(CompanyRepository companyRepository, CompanyMapper companyMapper) {
        super(companyRepository, companyMapper);
    }
}
