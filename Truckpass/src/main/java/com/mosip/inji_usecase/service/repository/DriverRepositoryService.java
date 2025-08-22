package com.mosip.inji_usecase.service.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.mosip.inji_usecase.dto.truckpass.DriverDto;
import com.mosip.inji_usecase.entity.truckpass.DriverEntity;
import com.mosip.inji_usecase.mapper.truckpass.DriverMapper;
import com.mosip.inji_usecase.repository.truckpass.DriverRepository;
import com.mosip.inji_usecase.service.notification.EmailService;

import lombok.AllArgsConstructor;

@Service("driverRepositoryService")
@AllArgsConstructor
public class DriverRepositoryService implements RepositoryService {

    private final DriverRepository driverRepository;
    private final DriverMapper driverMapper;
    private final EmailService emailService;

    @Override
    public Map<String, Object> save(Map obj) {
        validateUniqueFields(obj);

        DriverDto driverDto = driverMapper.toDto(obj);
        DriverEntity driverEntity = driverMapper.toEntity(driverDto);
        DriverEntity savedEntity = driverRepository.save(driverEntity);
        DriverDto savedDto = driverMapper.toDto(savedEntity);
        Map<String, Object> result = driverMapper.toMap(savedDto);

        try {
            emailService.sendDriverRegistrationEmail(result);
        } catch (Exception e) {
            System.err.println("Email notification failed, but registration was successful: " + e.getMessage());
        }

        return result;
    }

    @Override
    public Optional<Map<String, Object>> getById(Long id) {
        Optional<DriverEntity> entityOpt = driverRepository.findById(id);
        if (entityOpt.isPresent()) {
            DriverDto dto = driverMapper.toDto(entityOpt.get());
            Map<String, Object> map = driverMapper.toMap(dto);
            return Optional.of(map);
        } else {
            return Optional.empty();
        }
    }

    @Override
    public List<Map<String, Object>> getBySearchCriteria(Specification spec) {
        List<Map<String, Object>> result = new ArrayList<>();
        driverRepository.findAll((Specification<DriverEntity>) spec)
                .forEach(driverEntity -> {
                    DriverDto driverDto = driverMapper.toDto(driverEntity);
                    Map<String, Object> obj = driverMapper.toMap(driverDto);
                    result.add(obj);
                });
        return result;
    }

    private void validateUniqueFields(Map obj) {
        String uin = (String) obj.get("uin");
        String emailId = (String) obj.get("emailId");
        String driversLicenseNumber = (String) obj.get("driversLicenseNumber");

        if (uin != null && driverRepository.findByUin(uin).isPresent()) {
            throw new IllegalArgumentException("Driver with this UIN is already registered");
        }

        if (emailId != null && driverRepository.findByEmailId(emailId).isPresent()) {
            throw new IllegalArgumentException("Driver with email '" + emailId + "' already exists");
        }

        if (driversLicenseNumber != null
                && driverRepository.findByDriversLicenseNumber(driversLicenseNumber).isPresent()) {
            throw new IllegalArgumentException("Driver with license number '" + driversLicenseNumber + "' already exists");
        }
    }
}
