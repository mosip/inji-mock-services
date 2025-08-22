package com.mosip.common_database.mapper.truckpass;

import java.util.Map;
import com.mosip.common_database.dto.truckpass.TruckPassDto;
import org.mapstruct.Mapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosip.common_database.entity.truckpass.TruckPass;
import com.mosip.common_database.mapper.MappingUtils;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Mapper(componentModel = "spring", uses = MappingUtils.class)
public interface TruckPassMapper {

    TruckPassDto toDto(Map<String, Object> truckPassMapObject);

    TruckPassDto toDto(TruckPass truckPassEntity);

    TruckPass toEntity(TruckPassDto truckPassDto);

    default Map<String, Object> toMap(TruckPassDto truckPassDto) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return objectMapper.convertValue(truckPassDto, new TypeReference<Map<String, Object>>() {});
    }
}
