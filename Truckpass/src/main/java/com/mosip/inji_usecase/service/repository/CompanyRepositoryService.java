package com.mosip.inji_usecase.service.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.mosip.inji_usecase.dto.truckpass.CompanyDto;
import com.mosip.inji_usecase.entity.truckpass.CompanyEntity;
import com.mosip.inji_usecase.mapper.truckpass.CompanyMapper;
import com.mosip.inji_usecase.repository.truckpass.CompanyRepository;
import lombok.AllArgsConstructor;

@Service("companyRepositoryService")
@AllArgsConstructor
public class CompanyRepositoryService implements RepositoryService {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;

    @Override
    @SuppressWarnings("unchecked")
    public Map<String, Object> save(Map obj) {
        CompanyDto companyDto = companyMapper.toDto(obj);
        CompanyEntity companyEntity = companyMapper.toEntity(companyDto);
        CompanyEntity savedEntity = companyRepository.save(companyEntity);
        CompanyDto savedDto = companyMapper.toDto(savedEntity);
        return companyMapper.toMap(savedDto);
    }

    @Override
    public Optional<Map<String, Object>> getById(Long id) {
        Optional<CompanyEntity> company = companyRepository.findById(id);
        return company.map(entity -> {
            CompanyDto companyDto = companyMapper.toDto(entity);
            return companyMapper.toMap(companyDto);
        });
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getBySearchCriteria(Specification spec) {
        List<Map<String, Object>> result = new ArrayList<>();
        companyRepository.findAll((Specification<CompanyEntity>) spec)
                .forEach(companyEntity -> {
                    CompanyDto companyDto = companyMapper.toDto(companyEntity);
                    Map<String, Object> obj = companyMapper.toMap(companyDto);
                    result.add(obj);
                });
        return result;
    }

    public List<Map<String, Object>> getAllCompanies() {
        List<Map<String, Object>> result = new ArrayList<>();
        companyRepository.findAll().forEach(companyEntity -> {
            CompanyDto companyDto = companyMapper.toDto(companyEntity);
            result.add(companyMapper.toMap(companyDto));
        });
        return result;
    }

    public List<Map<String, Object>> searchCompaniesByText(String searchText) {
        List<Map<String, Object>> result = new ArrayList<>();
        companyRepository.findBySearchText(searchText).forEach(companyEntity -> {
            CompanyDto companyDto = companyMapper.toDto(companyEntity);
            result.add(companyMapper.toMap(companyDto));
        });
        return result;
    }
}
