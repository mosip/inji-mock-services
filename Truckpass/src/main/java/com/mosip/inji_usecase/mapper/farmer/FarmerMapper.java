package com.mosip.inji_usecase.mapper.farmer;

import java.util.Map;

import org.mapstruct.Mapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosip.inji_usecase.dto.farmer.FarmerDto;
import com.mosip.inji_usecase.entity.farmer.FarmerEntity;
import com.mosip.inji_usecase.mapper.MappingUtils;

@Mapper(componentModel = "spring", uses = MappingUtils.class)
public interface FarmerMapper {

    FarmerDto toDto(Map<String, Object> farmerMapObject);

    FarmerDto toDto(FarmerEntity farmerMapObject);

    FarmerEntity toEntity(FarmerDto farmerDto);

    default Map<String, Object> toMap(FarmerDto farmerDto) {
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> map = objectMapper.convertValue(farmerDto, new TypeReference<>() {});
        return map;
    }

}
