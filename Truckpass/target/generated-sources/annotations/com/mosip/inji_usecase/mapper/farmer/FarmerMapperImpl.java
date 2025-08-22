package com.mosip.inji_usecase.mapper.farmer;

import com.mosip.inji_usecase.dto.farmer.FarmerDto;
import com.mosip.inji_usecase.entity.farmer.FarmerEntity;
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
public class FarmerMapperImpl implements FarmerMapper {

    @Override
    public FarmerDto toDto(Map<String, Object> farmerMapObject) {
        if ( farmerMapObject == null ) {
            return null;
        }

        FarmerDto farmerDto = new FarmerDto();

        if ( farmerMapObject.containsKey( "farmerId" ) ) {
            farmerDto.setFarmerId( MappingUtils.mapToLong( farmerMapObject.get( "farmerId" ) ) );
        }
        if ( farmerMapObject.containsKey( "name" ) ) {
            farmerDto.setName( MappingUtils.mapToString( farmerMapObject.get( "name" ) ) );
        }
        if ( farmerMapObject.containsKey( "address" ) ) {
            farmerDto.setAddress( MappingUtils.mapToString( farmerMapObject.get( "address" ) ) );
        }
        if ( farmerMapObject.containsKey( "phoneNumber" ) ) {
            farmerDto.setPhoneNumber( MappingUtils.mapToString( farmerMapObject.get( "phoneNumber" ) ) );
        }
        if ( farmerMapObject.containsKey( "landId" ) ) {
            farmerDto.setLandId( MappingUtils.mapToString( farmerMapObject.get( "landId" ) ) );
        }

        return farmerDto;
    }

    @Override
    public FarmerDto toDto(FarmerEntity farmerMapObject) {
        if ( farmerMapObject == null ) {
            return null;
        }

        FarmerDto farmerDto = new FarmerDto();

        farmerDto.setFarmerId( MappingUtils.mapToLong( farmerMapObject.getFarmerId() ) );
        farmerDto.setName( MappingUtils.mapToString( farmerMapObject.getName() ) );
        farmerDto.setAddress( MappingUtils.mapToString( farmerMapObject.getAddress() ) );
        farmerDto.setPhoneNumber( MappingUtils.mapToString( farmerMapObject.getPhoneNumber() ) );
        farmerDto.setLandId( MappingUtils.mapToString( farmerMapObject.getLandId() ) );

        return farmerDto;
    }

    @Override
    public FarmerEntity toEntity(FarmerDto farmerDto) {
        if ( farmerDto == null ) {
            return null;
        }

        FarmerEntity farmerEntity = new FarmerEntity();

        farmerEntity.setFarmerId( MappingUtils.mapToLong( farmerDto.getFarmerId() ) );
        farmerEntity.setName( MappingUtils.mapToString( farmerDto.getName() ) );
        farmerEntity.setAddress( MappingUtils.mapToString( farmerDto.getAddress() ) );
        farmerEntity.setPhoneNumber( MappingUtils.mapToString( farmerDto.getPhoneNumber() ) );
        farmerEntity.setLandId( MappingUtils.mapToString( farmerDto.getLandId() ) );

        return farmerEntity;
    }
}
