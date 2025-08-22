package com.mosip.common_database.service.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.mosip.common_database.dto.farmer.FarmerDto;
import com.mosip.common_database.entity.farmer.FarmerEntity;
import com.mosip.common_database.mapper.farmer.FarmerMapper;
import com.mosip.common_database.repository.farmer.FarmerRepository;

import lombok.AllArgsConstructor;

@Service("farmerRepositoryService")
@AllArgsConstructor
public class FarmerRepositoryService implements RepositoryService<FarmerEntity> {

    private final FarmerRepository farmerRepository;
    private final FarmerMapper farmerMapper;

    @Override
    public Map<String, Object> save(Map<String, Object> farmerObject) {
        FarmerDto farmerDto = farmerMapper.toDto(farmerObject);
        FarmerEntity farmerEntity = farmerMapper.toEntity(farmerDto);

        farmerRepository.save(farmerEntity);

        return farmerMapper.toMap(farmerDto);
    }

    @Override
    public Optional<Map<String, Object>> getById(Long id) {

        Optional<FarmerEntity> farmer = farmerRepository.findById(id);
        return farmer
            .map(entity -> {
                FarmerDto farmerDto = farmerMapper.toDto(entity);
                return farmerMapper.toMap(farmerDto);
            });
    }

    @Override
    public List<Map<String, Object>> getBySearchCriteria(Specification<FarmerEntity> spec) {
        List<Map<String, Object>> result = new ArrayList<>();
        farmerRepository.findAll(spec).forEach((certifyEntity) -> {
            FarmerDto farmerDto = farmerMapper.toDto(certifyEntity);
            Map<String, Object> obj = farmerMapper.toMap(farmerDto);
            result.add(obj);
        });
        return result;
    }
}
