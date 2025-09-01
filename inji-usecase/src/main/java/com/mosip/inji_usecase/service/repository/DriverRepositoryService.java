package com.mosip.inji_usecase.service.repository;

import org.springframework.stereotype.Service;
import com.mosip.inji_usecase.dto.driver.DriverDto;
import com.mosip.inji_usecase.entity.driver.DriverEntity;
import com.mosip.inji_usecase.mapper.driver.DriverMapper;
import com.mosip.inji_usecase.repository.driver.DriverRepository;

@Service("driverRepositoryService")
public class DriverRepositoryService
        extends AbstractRepositoryService<DriverEntity, Long, DriverDto,DriverRepository,  DriverMapper> {

    public DriverRepositoryService(DriverRepository driverRepository, DriverMapper driverMapper) {
        super(driverRepository, driverMapper);
    }
}
