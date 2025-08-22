package com.mosip.common_database.service.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.mosip.common_database.dto.certify.CertifyDto;
import com.mosip.common_database.entity.certify.CertifyEntity;
import com.mosip.common_database.mapper.certify.CertifyMapper;
import com.mosip.common_database.repository.certify.CertifyRepository;

import lombok.AllArgsConstructor;

@Service("certifyRepositoryService")
@AllArgsConstructor
public class CertifyRepositoryService implements RepositoryService<CertifyEntity> {

    private final CertifyRepository certifyRepository;
    private final CertifyMapper certifyMapper;

    @Override
    public Map<String, Object> save(Map<String, Object> certifyObject) {

        CertifyDto certifyDto = certifyMapper.toDto(certifyObject);
        CertifyEntity certifyEntity = certifyMapper.toEntity(certifyDto);

        certifyRepository.save(certifyEntity);

        return certifyMapper.toMap(certifyDto);

    }

    @Override
    public Optional<Map<String, Object>> getById(Long id) {

        Optional<CertifyEntity> certify = certifyRepository.findById(id);
        return certify
            .map(entity -> {
                CertifyDto certifyDto = certifyMapper.toDto(entity);
                return certifyMapper.toMap(certifyDto);
            });
                               
    }

    @Override
    public List<Map<String, Object>> getBySearchCriteria(Specification<CertifyEntity> spec) {
        List<Map<String, Object>> result = new ArrayList<>();
        certifyRepository.findAll(spec).forEach((certifyEntity) -> {
            CertifyDto certifyDto = certifyMapper.toDto(certifyEntity);
            Map<String, Object> obj = certifyMapper.toMap(certifyDto);
            result.add(obj);
        });
        return result;
    }


}
