package com.mosip.common_database.repository.truckpass;

import com.mosip.common_database.entity.truckpass.TruckPass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TruckPassRepository extends JpaRepository<TruckPass, Long>, JpaSpecificationExecutor<TruckPass> {

    // Find by driver UIN
    Optional<TruckPass> findByDriverUIN(String driverUIN);

    // Find by driver license number
    Optional<TruckPass> findByDriversLicenseNumber(String licenseNumber);

    // Find by passport number
    Optional<TruckPass> findByPassportNumber(String passportNumber);

    // Custom query to get driver details by UIN for auto-population
    @Query("SELECT tp FROM TruckPass tp WHERE tp.driverUIN = :uin")
    Optional<TruckPass> findDriverDetailsByUIN(@Param("uin") String uin);

    List<TruckPass> findByEmailId(String emailId);

}
