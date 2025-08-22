package com.mosip.inji_usecase.mapper.truckpass;

import java.util.Map;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosip.inji_usecase.dto.truckpass.DriverDto;
import com.mosip.inji_usecase.entity.truckpass.DriverEntity;
import com.mosip.inji_usecase.mapper.MappingUtils;
import com.mosip.inji_usecase.utils.Base64Utils;

@Mapper(componentModel = "spring", uses = {MappingUtils.class})
public abstract class DriverMapper {

    @Autowired
    protected Base64Utils base64Utils;

    public abstract DriverDto toDto(DriverEntity driverEntity);

    @Mapping(target = "faceImage", expression = "java(base64Utils.convertBase64ToByteArray(driverDto.getFaceImage()))")
    @Mapping(target = "cpcCertificate", expression = "java(base64Utils.convertBase64ToByteArray(driverDto.getCpcCertificate()))")
    public abstract DriverEntity toEntity(DriverDto driverDto);

    public DriverDto toDto(Map<String, Object> driverMapObject) {
        DriverDto dto = new DriverDto();
        dto.setId(MappingUtils.mapToLong(driverMapObject.get("id")));
        dto.setFullName(MappingUtils.mapToString(driverMapObject.get("fullName")));
        dto.setUin(MappingUtils.mapToString(driverMapObject.get("uin")));
        dto.setPhoneNumber(MappingUtils.mapToString(driverMapObject.get("phoneNumber")));
        dto.setGender(MappingUtils.mapToString(driverMapObject.get("gender")));
        dto.setEmailId(MappingUtils.mapToString(driverMapObject.get("emailId")));
        dto.setCity(MappingUtils.mapToString(driverMapObject.get("city")));
        dto.setFaceImage(MappingUtils.mapToString(driverMapObject.get("faceImage")));
        dto.setDriversLicenseNumber(MappingUtils.mapToString(driverMapObject.get("driversLicenseNumber")));
        dto.setPassportNumber(MappingUtils.mapToString(driverMapObject.get("passportNumber")));
        dto.setCpcCertificate(MappingUtils.mapToString(driverMapObject.get("cpcCertificate")));
        dto.setCompanyId(MappingUtils.mapToInteger(driverMapObject.get("companyId")));
        return dto;
    }

    public Map<String, Object> toMap(DriverDto driverDto) {
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> map = objectMapper.convertValue(driverDto, new TypeReference<Map<String, Object>>() {});
        return map;
    }
}
