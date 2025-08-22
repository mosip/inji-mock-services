package com.mosip.inji_usecase.repository.truckpass;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.mosip.inji_usecase.entity.truckpass.CompanyEntity;

@Repository
public interface CompanyRepository extends JpaRepository<CompanyEntity, Long>, JpaSpecificationExecutor<CompanyEntity> {

    @Query("SELECT c FROM CompanyEntity c WHERE " +
            "LOWER(c.companyName) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(c.registrationType) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(c.registeredEmail) LIKE LOWER(CONCAT('%', :searchText, '%'))")
    List<CompanyEntity> findBySearchText(@Param("searchText") String searchText);
}
