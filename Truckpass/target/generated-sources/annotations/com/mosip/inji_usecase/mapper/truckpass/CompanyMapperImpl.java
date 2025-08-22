package com.mosip.inji_usecase.mapper.truckpass;

import com.mosip.inji_usecase.dto.truckpass.CompanyDto;
import com.mosip.inji_usecase.entity.truckpass.CompanyEntity;
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
public class CompanyMapperImpl implements CompanyMapper {

    @Override
    public CompanyDto toDto(Map<String, Object> companyMapObject) {
        if ( companyMapObject == null ) {
            return null;
        }

        CompanyDto companyDto = new CompanyDto();

        if ( companyMapObject.containsKey( "id" ) ) {
            companyDto.setId( MappingUtils.mapToLong( companyMapObject.get( "id" ) ) );
        }
        if ( companyMapObject.containsKey( "companyName" ) ) {
            companyDto.setCompanyName( MappingUtils.mapToString( companyMapObject.get( "companyName" ) ) );
        }
        if ( companyMapObject.containsKey( "registrationStatus" ) ) {
            companyDto.setRegistrationStatus( MappingUtils.mapToString( companyMapObject.get( "registrationStatus" ) ) );
        }
        if ( companyMapObject.containsKey( "registrationType" ) ) {
            companyDto.setRegistrationType( MappingUtils.mapToString( companyMapObject.get( "registrationType" ) ) );
        }
        if ( companyMapObject.containsKey( "registeredEmail" ) ) {
            companyDto.setRegisteredEmail( MappingUtils.mapToString( companyMapObject.get( "registeredEmail" ) ) );
        }

        return companyDto;
    }

    @Override
    public CompanyDto toDto(CompanyEntity companyEntity) {
        if ( companyEntity == null ) {
            return null;
        }

        CompanyDto companyDto = new CompanyDto();

        companyDto.setId( MappingUtils.mapToLong( companyEntity.getId() ) );
        companyDto.setCompanyName( MappingUtils.mapToString( companyEntity.getCompanyName() ) );
        companyDto.setRegistrationStatus( MappingUtils.mapToString( companyEntity.getRegistrationStatus() ) );
        companyDto.setRegistrationType( MappingUtils.mapToString( companyEntity.getRegistrationType() ) );
        companyDto.setRegisteredEmail( MappingUtils.mapToString( companyEntity.getRegisteredEmail() ) );

        return companyDto;
    }

    @Override
    public CompanyEntity toEntity(CompanyDto companyDto) {
        if ( companyDto == null ) {
            return null;
        }

        CompanyEntity companyEntity = new CompanyEntity();

        companyEntity.setId( MappingUtils.mapToLong( companyDto.getId() ) );
        companyEntity.setCompanyName( MappingUtils.mapToString( companyDto.getCompanyName() ) );
        companyEntity.setRegistrationStatus( MappingUtils.mapToString( companyDto.getRegistrationStatus() ) );
        companyEntity.setRegistrationType( MappingUtils.mapToString( companyDto.getRegistrationType() ) );
        companyEntity.setRegisteredEmail( MappingUtils.mapToString( companyDto.getRegisteredEmail() ) );

        return companyEntity;
    }
}
