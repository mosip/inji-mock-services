package com.mosip.inji_usecase.mapper.company;

import java.util.Map;

import org.mapstruct.Mapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosip.inji_usecase.dto.company.CompanyDto;
import com.mosip.inji_usecase.entity.company.Company;
import com.mosip.inji_usecase.mapper.MappingUtils;

@Mapper(componentModel = "spring", uses = MappingUtils.class)
public interface CompanyMapper extends com.mosip.inji_usecase.mapper.Mapper<Company, CompanyDto> {

    @Override
    CompanyDto toDto(Company entity);

    @Override
    Company toEntity(CompanyDto dto);

    @Override
    CompanyDto toDto(Map<String, Object> map);

    @Override
    default Map<String, Object> toMap(CompanyDto dto) {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.convertValue(dto, new TypeReference<Map<String, Object>>() {});
    }
}
