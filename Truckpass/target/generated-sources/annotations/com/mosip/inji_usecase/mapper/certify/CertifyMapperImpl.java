package com.mosip.inji_usecase.mapper.certify;

import com.mosip.inji_usecase.dto.certify.CertifyDto;
import com.mosip.inji_usecase.entity.certify.CertifyEntity;
import com.mosip.inji_usecase.mapper.MappingUtils;
import java.util.Map;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-08-22T14:14:30+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.8 (Ubuntu)"
)
@Component
public class CertifyMapperImpl implements CertifyMapper {

    @Override
    public CertifyDto toDto(Map<String, Object> certifyMapObject) {
        if ( certifyMapObject == null ) {
            return null;
        }

        CertifyDto certifyDto = new CertifyDto();

        if ( certifyMapObject.containsKey( "uuid" ) ) {
            certifyDto.setUuid( MappingUtils.mapToLong( certifyMapObject.get( "uuid" ) ) );
        }
        if ( certifyMapObject.containsKey( "name" ) ) {
            certifyDto.setName( MappingUtils.mapToString( certifyMapObject.get( "name" ) ) );
        }
        if ( certifyMapObject.containsKey( "address" ) ) {
            certifyDto.setAddress( MappingUtils.mapToString( certifyMapObject.get( "address" ) ) );
        }
        if ( certifyMapObject.containsKey( "pinCode" ) ) {
            certifyDto.setPinCode( MappingUtils.mapToInteger( certifyMapObject.get( "pinCode" ) ) );
        }
        if ( certifyMapObject.containsKey( "phoneNumber" ) ) {
            certifyDto.setPhoneNumber( MappingUtils.mapToString( certifyMapObject.get( "phoneNumber" ) ) );
        }
        if ( certifyMapObject.containsKey( "email" ) ) {
            certifyDto.setEmail( MappingUtils.mapToString( certifyMapObject.get( "email" ) ) );
        }

        return certifyDto;
    }

    @Override
    public CertifyDto toDto(CertifyEntity certifyMapObject) {
        if ( certifyMapObject == null ) {
            return null;
        }

        CertifyDto certifyDto = new CertifyDto();

        certifyDto.setUuid( MappingUtils.mapToLong( certifyMapObject.getUuid() ) );
        certifyDto.setName( MappingUtils.mapToString( certifyMapObject.getName() ) );
        certifyDto.setAddress( MappingUtils.mapToString( certifyMapObject.getAddress() ) );
        certifyDto.setPinCode( MappingUtils.mapToInteger( certifyMapObject.getPinCode() ) );
        certifyDto.setPhoneNumber( MappingUtils.mapToString( certifyMapObject.getPhoneNumber() ) );
        certifyDto.setEmail( MappingUtils.mapToString( certifyMapObject.getEmail() ) );

        return certifyDto;
    }

    @Override
    public CertifyEntity toEntity(CertifyDto certifyDto) {
        if ( certifyDto == null ) {
            return null;
        }

        CertifyEntity certifyEntity = new CertifyEntity();

        certifyEntity.setUuid( MappingUtils.mapToLong( certifyDto.getUuid() ) );
        certifyEntity.setName( MappingUtils.mapToString( certifyDto.getName() ) );
        certifyEntity.setAddress( MappingUtils.mapToString( certifyDto.getAddress() ) );
        certifyEntity.setPinCode( MappingUtils.mapToInteger( certifyDto.getPinCode() ) );
        certifyEntity.setPhoneNumber( MappingUtils.mapToString( certifyDto.getPhoneNumber() ) );
        certifyEntity.setEmail( MappingUtils.mapToString( certifyDto.getEmail() ) );

        return certifyEntity;
    }
}
