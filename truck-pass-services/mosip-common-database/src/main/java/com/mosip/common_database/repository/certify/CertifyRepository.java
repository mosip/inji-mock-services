package com.mosip.common_database.repository.certify;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.mosip.common_database.entity.certify.CertifyEntity;

@Repository
public interface CertifyRepository extends JpaRepository<CertifyEntity, Long>, JpaSpecificationExecutor<CertifyEntity> {

}
