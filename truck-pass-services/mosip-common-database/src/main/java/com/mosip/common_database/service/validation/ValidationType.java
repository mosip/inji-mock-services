package com.mosip.common_database.service.validation;

public enum ValidationType {
    REQUIRED,
    TYPE,
    REGEX,
    PATTERN,        // ADD THIS
    MINLENGTH,
    MAXLENGTH,
    CONDITIONAL,
    UNIQUE,
    ALLOWEDVALUES;  // ADD THIS

    public static ValidationType fromString(String key) {
        try {
            return ValidationType.valueOf(key.toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Unknown validation type " + key);
        }
    }
}
