package com.mosip.inji_usecase.mapper.truckpass;

import java.util.Map;
import org.mapstruct.Mapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosip.inji_usecase.dto.truckpass.CompanyDto;
import com.mosip.inji_usecase.entity.truckpass.CompanyEntity;
import com.mosip.inji_usecase.mapper.MappingUtils;

@Mapper(componentModel = "spring", uses = MappingUtils.class)
public interface CompanyMapper {

    CompanyDto toDto(Map<String, Object> companyMapObject);
    CompanyDto toDto(CompanyEntity companyEntity);
    CompanyEntity toEntity(CompanyDto companyDto);

    default Map<String, Object> toMap(CompanyDto companyDto) {
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> map = objectMapper.convertValue(companyDto, new TypeReference<>() {});
        return map;
    }
}
