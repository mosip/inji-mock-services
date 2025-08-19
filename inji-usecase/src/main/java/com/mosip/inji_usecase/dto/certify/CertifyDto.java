package com.mosip.inji_usecase.dto.certify;

import lombok.Data;

@Data
public class CertifyDto {

    private Long uuid;

    private String name;

    private String address;

    private Integer pinCode;

    private String phoneNumber;

    private String email;

}
