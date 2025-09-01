package com.mosip.inji_usecase.dto.notification;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailResponse {
    private boolean success;
    private String messageId;
    private String message;
    private LocalDateTime timestamp;
    private String errorCode;
    private String errorMessage;
}
