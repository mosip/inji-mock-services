package com.mosip.inji_usecase.mapper.truckpass;

import com.mosip.inji_usecase.dto.truckpass.DriverDto;
import com.mosip.inji_usecase.entity.truckpass.DriverEntity;
import com.mosip.inji_usecase.mapper.MappingUtils;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-08-22T14:14:30+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.8 (Ubuntu)"
)
@Component
public class DriverMapperImpl extends DriverMapper {

    @Override
    public DriverDto toDto(DriverEntity driverEntity) {
        if ( driverEntity == null ) {
            return null;
        }

        DriverDto driverDto = new DriverDto();

        driverDto.setId( MappingUtils.mapToLong( driverEntity.getId() ) );
        driverDto.setFullName( MappingUtils.mapToString( driverEntity.getFullName() ) );
        driverDto.setUin( MappingUtils.mapToString( driverEntity.getUin() ) );
        driverDto.setPhoneNumber( MappingUtils.mapToString( driverEntity.getPhoneNumber() ) );
        driverDto.setGender( MappingUtils.mapToString( driverEntity.getGender() ) );
        driverDto.setEmailId( MappingUtils.mapToString( driverEntity.getEmailId() ) );
        driverDto.setCity( MappingUtils.mapToString( driverEntity.getCity() ) );
        driverDto.setFaceImage( MappingUtils.mapToString( driverEntity.getFaceImage() ) );
        driverDto.setDriversLicenseNumber( MappingUtils.mapToString( driverEntity.getDriversLicenseNumber() ) );
        driverDto.setPassportNumber( MappingUtils.mapToString( driverEntity.getPassportNumber() ) );
        driverDto.setCpcCertificate( MappingUtils.mapToString( driverEntity.getCpcCertificate() ) );
        driverDto.setCompanyId( MappingUtils.mapToInteger( driverEntity.getCompanyId() ) );

        return driverDto;
    }

    @Override
    public DriverEntity toEntity(DriverDto driverDto) {
        if ( driverDto == null ) {
            return null;
        }

        DriverEntity driverEntity = new DriverEntity();

        driverEntity.setId( MappingUtils.mapToLong( driverDto.getId() ) );
        driverEntity.setFullName( MappingUtils.mapToString( driverDto.getFullName() ) );
        driverEntity.setUin( MappingUtils.mapToString( driverDto.getUin() ) );
        driverEntity.setPhoneNumber( MappingUtils.mapToString( driverDto.getPhoneNumber() ) );
        driverEntity.setGender( MappingUtils.mapToString( driverDto.getGender() ) );
        driverEntity.setEmailId( MappingUtils.mapToString( driverDto.getEmailId() ) );
        driverEntity.setCity( MappingUtils.mapToString( driverDto.getCity() ) );
        driverEntity.setDriversLicenseNumber( MappingUtils.mapToString( driverDto.getDriversLicenseNumber() ) );
        driverEntity.setPassportNumber( MappingUtils.mapToString( driverDto.getPassportNumber() ) );
        driverEntity.setCompanyId( MappingUtils.mapToInteger( driverDto.getCompanyId() ) );

        driverEntity.setFaceImage( base64Utils.convertBase64ToByteArray(driverDto.getFaceImage()) );
        driverEntity.setCpcCertificate( base64Utils.convertBase64ToByteArray(driverDto.getCpcCertificate()) );

        return driverEntity;
    }
}
