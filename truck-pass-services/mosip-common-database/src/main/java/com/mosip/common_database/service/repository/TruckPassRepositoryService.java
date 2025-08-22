package com.mosip.common_database.service.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.mosip.common_database.dto.truckpass.TruckPassDto;
import com.mosip.common_database.entity.truckpass.TruckPass;
import com.mosip.common_database.mapper.truckpass.TruckPassMapper;
import com.mosip.common_database.repository.truckpass.TruckPassRepository;

import lombok.AllArgsConstructor;

@Service("truckpassRepositoryService")
@AllArgsConstructor
public class TruckPassRepositoryService implements RepositoryService<TruckPass> {

    private final TruckPassRepository truckPassRepository;
    private final TruckPassMapper truckPassMapper;

    @Override
    public Map<String, Object> save(Map<String, Object> truckPassObject) {
        TruckPassDto truckPassDto = truckPassMapper.toDto(truckPassObject);
        TruckPass truckPassEntity = truckPassMapper.toEntity(truckPassDto);
        truckPassRepository.save(truckPassEntity);
        return truckPassMapper.toMap(truckPassDto);
    }

    @Override
    public Optional<Map<String, Object>> getById(Long id) {
        Optional<TruckPass> truckPass = truckPassRepository.findById(id);
        return truckPass
                .map(entity -> {
                    TruckPassDto truckPassDto = truckPassMapper.toDto(entity);
                    return truckPassMapper.toMap(truckPassDto);
                });
    }

    @Override
    public List<Map<String, Object>> getBySearchCriteria(Specification<TruckPass> spec) {
        List<Map<String, Object>> result = new ArrayList<>();
        truckPassRepository.findAll(spec).forEach((truckPassEntity) -> {
            TruckPassDto truckPassDto = truckPassMapper.toDto(truckPassEntity);
            Map<String, Object> obj = truckPassMapper.toMap(truckPassDto);
            result.add(obj);
        });
        return result;
    }

    public Optional<Map<String, Object>> getDriverDetailsByUIN(String driverUIN) {
        Optional<TruckPass> truckPass = truckPassRepository.findByDriverUIN(driverUIN);

        if (truckPass.isPresent()) {
            TruckPassDto dto = truckPassMapper.toDto(truckPass.get());
            return Optional.of(truckPassMapper.toMap(dto));
        }
        return Optional.empty();
    }

    public List<Map<String, Object>> getTruckPassByEmail(String emailId) {
        try {
            List<Map<String, Object>> result = new ArrayList<>();

            if (emailId == null || emailId.trim().isEmpty()) {
                return result;
            }

            List<TruckPass> truckPasses = truckPassRepository.findByEmailId(emailId.trim());

            truckPasses.forEach(truckPassEntity -> {
                TruckPassDto truckPassDto = truckPassMapper.toDto(truckPassEntity);
                Map<String, Object> obj = truckPassMapper.toMap(truckPassDto);
                result.add(obj);
            });

            return result;

        } catch (Exception e) {
            System.err.println("Error fetching truck pass by email: " + e.getMessage());
            throw new RuntimeException("Failed to retrieve truck pass for email: " + emailId, e);
        }
    }

}
