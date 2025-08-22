package com.mosip.inji_usecase.repository.truckpass;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.mosip.inji_usecase.entity.truckpass.DriverEntity;

@Repository
public interface DriverRepository extends JpaRepository<DriverEntity, Long>, JpaSpecificationExecutor<DriverEntity> {

    @Query("SELECT d FROM DriverEntity d WHERE d.uin = :uin")
    Optional<DriverEntity> findByUin(@Param("uin") String uin);

    @Query("SELECT d FROM DriverEntity d WHERE d.emailId = :emailId")
    Optional<DriverEntity> findByEmailId(@Param("emailId") String emailId);

    @Query("SELECT d FROM DriverEntity d WHERE d.driversLicenseNumber = :licenseNumber")
    Optional<DriverEntity> findByDriversLicenseNumber(@Param("licenseNumber") String licenseNumber);
}
