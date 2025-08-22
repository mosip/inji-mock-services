package com.mosip.inji_usecase.repository.certify;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.mosip.inji_usecase.entity.certify.CertifyEntity;

@Repository
public interface CertifyRepository extends JpaRepository<CertifyEntity, Long>, JpaSpecificationExecutor<CertifyEntity> {

}
