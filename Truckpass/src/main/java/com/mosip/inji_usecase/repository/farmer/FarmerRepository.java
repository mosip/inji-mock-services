package com.mosip.inji_usecase.repository.farmer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.mosip.inji_usecase.entity.farmer.FarmerEntity;

@Repository
public interface FarmerRepository extends JpaRepository<FarmerEntity, Long>, JpaSpecificationExecutor<FarmerEntity> {

}
