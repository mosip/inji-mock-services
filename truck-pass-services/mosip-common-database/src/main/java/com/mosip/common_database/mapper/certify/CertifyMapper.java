package com.mosip.common_database.mapper.certify;

import java.util.Map;

import org.mapstruct.Mapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosip.common_database.dto.certify.CertifyDto;
import com.mosip.common_database.entity.certify.CertifyEntity;
import com.mosip.common_database.mapper.MappingUtils;

@Mapper(componentModel = "spring", uses = MappingUtils.class)
public interface CertifyMapper {

    CertifyDto toDto(Map<String, Object> certifyMapObject);

    CertifyDto toDto(CertifyEntity certifyMapObject);

    CertifyEntity toEntity(CertifyDto certifyDto);

    default Map<String, Object> toMap(CertifyDto certifyDto) {
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> map = objectMapper.convertValue(certifyDto, new TypeReference<>() {});
        return map;
    }

}
