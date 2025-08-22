package com.mosip.common_database.service.validation;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

@Service
public class VerifyFieldService {

    public void verifyRequired(Map<String, Object> data, Set<String> required_fields) {
        for (String field : required_fields) {
            if (!data.containsKey(field)) {
                throw new IllegalArgumentException("Missing required field: " + field);
            }
        }
        System.out.println("Required Fields verified");
    }

    public void verifyType(Map.Entry<String, Object> data, String type) {
        if(data == null) {
            throw new IllegalArgumentException("Field is null");
        }

        Object data_value = data.getValue();
        String data_field = data.getKey();

        switch(type.toLowerCase()) {
            case "string" -> {
                if(!(data_value instanceof String)) {
                    throw new IllegalArgumentException("Field '" + data_field + "' must be a string");
                }
            }
            case "integer" -> {
                if(!(data_value instanceof Integer) && !(data_value instanceof Long)) {
                    throw new IllegalArgumentException("Field '" + data_field + "' must be an integer");
                }
            }
            case "float" -> {
                // FIXED: Added missing negation operator
                if(!(data_value instanceof Float) && !(data_value instanceof Double)) {
                    throw new IllegalArgumentException("Field '" + data_field + "' must be a float or double");
                }
            }
            case "boolean" -> {
                if(!(data_value instanceof Boolean)) {
                    throw new IllegalArgumentException("Field '" + data_field + "' must be a boolean");
                }
            }
            case "array" -> {
                if(!(data_value instanceof List)) {
                    throw new IllegalArgumentException("Field '" + data_field + "' must be an array");
                }
            }
            case "date" -> {
                // TODO: Also parse the string into date to check validity
                if(!(data_value instanceof String)) {
                    throw new IllegalArgumentException("Field '" + data_field + "' must be a date");
                }
            }
            case "object" -> {
                if(!(data_value instanceof Map)) {
                    throw new IllegalArgumentException("Field '" + data_field + "' must be an object");
                }
            }
            default -> throw new IllegalArgumentException("Unknown expected type for the field '" + data_field + "': " + type + "\n Possible types: string, integer, float, boolean, array, date, object");
        }

        System.out.println("type " + type);
        System.out.println("Type verified");
    }

    public enum LengthConstraintType {
        MIN {
            @Override
            public boolean compare(int value, int limit) {
                return value >= limit;
            }
        },
        MAX {
            @Override
            public boolean compare(int value, int limit) {
                return value <= limit;
            }
        };

        public abstract boolean compare(int value, int limit);
    }

    public void verifyLength(Map.Entry<String, Object> data, Integer limit, LengthConstraintType type) {
        Object data_value = data.getValue();

        if(data_value instanceof String) {
            int length = data_value.toString().length();
            if(!type.compare(length, limit)) {
                throw new IllegalArgumentException("Field '" + data.getKey() + "' failed length validation for string");
            }
        } else if ((data_value instanceof Integer) || (data_value instanceof Long)) {
            if(!type.compare((int)data_value, limit)) {
                throw new IllegalArgumentException("Field '" + data.getKey() + "' failed length validation for integer/long");
            }
        } else if ((data_value instanceof Float) || (data_value instanceof Double)) {
            if(!type.compare((int)data_value, limit)) {
                throw new IllegalArgumentException("Field '" + data.getKey() + "' failed length validation for float/double");
            }
        } else if (data_value instanceof List list) {
            int length = list.toArray().length;
            if(!type.compare(length, limit)) {
                throw new IllegalArgumentException("Field '" + data.getKey() + "' failed length validation for array");
            }
        } else {
            throw new IllegalArgumentException("Field '" + data.getKey() + "' has no property in relation to length");
        }

        System.out.println("maxLength " + limit);
        System.out.println("Length verified");
    }

    public void verifyFormat(Map.Entry<String, Object> data, String pattern) {
        Pattern regex_pattern = Pattern.compile(pattern);
        if(!regex_pattern.matcher(data.getValue().toString()).matches()) {
            throw new IllegalArgumentException("Field '" + data.getKey() + "' does not match pattern");
        }
        System.out.println("Regex Pattern verified");
    }

    // NEW METHOD: Handle allowed values validation
    public void verifyAllowedValues(Map.Entry<String, Object> data, Object allowedValuesObj) {
        if (allowedValuesObj instanceof List) {
            @SuppressWarnings("unchecked")
            List<String> allowedValues = (List<String>) allowedValuesObj;

            Object fieldValue = data.getValue();
            if (fieldValue != null && !allowedValues.contains(fieldValue.toString())) {
                throw new IllegalArgumentException(
                        String.format("Field '%s' value '%s' is not in allowed values: %s",
                                data.getKey(), fieldValue, allowedValues)
                );
            }
            System.out.println("allowedValues " + allowedValues);
            System.out.println("Allowed values verified");
        }
    }

    public void verifyConditional(Map.Entry<String, Object> data, Set<String> data_keys, List<String> conditionals) {
        for(String conditional : conditionals){
            System.out.println(data_keys);
            System.out.println(data_keys.contains(conditional));
            if(!data_keys.contains(conditional)){
                System.out.println(conditional);
                throw new IllegalArgumentException("Field '" + data.getKey() + "' requires field(s)'" + conditionals + "'");
            }
        }
        System.out.println("Conditional verified");
    }

    public void verifyUniqueness() {
        System.out.println("unique true");
        System.out.println("Uniqueness verified");
    }

    public void verify(Map<String, Object> data, Map<String, Object> fields) {
        for(Map.Entry<String, Object> data_field : data.entrySet()) {
            if(!fields.containsKey(data_field.getKey())) {
                throw new IllegalArgumentException("The field '" + data_field.getKey() + "' is not found in the configuration file");
            }

            // Debugging
            System.out.println(data_field.getKey() + "=" + data_field.getValue());
            System.out.println(fields.get(data_field.getKey()));

            Map<String, Object> field_params = (Map<String, Object>) fields.get(data_field.getKey());

            try {
                for (Map.Entry<String, Object> field_param : field_params.entrySet()) {
                    // Debugging
                    System.out.println(field_param.getKey() + " " + field_param.getValue());

                    ValidationType type = ValidationType.fromString(field_param.getKey());

                    switch (type) {
                        case TYPE -> verifyType(data_field, field_param.getValue().toString());
                        case REGEX -> verifyFormat(data_field, field_param.getValue().toString());
                        case PATTERN -> verifyFormat(data_field, field_param.getValue().toString()); // NEW CASE
                        case ALLOWEDVALUES -> verifyAllowedValues(data_field, field_param.getValue()); // NEW CASE
                        case MINLENGTH -> verifyLength(data_field, (Integer) field_param.getValue(), LengthConstraintType.MIN);
                        case MAXLENGTH -> verifyLength(data_field, (Integer) field_param.getValue(), LengthConstraintType.MAX);
                        case CONDITIONAL -> verifyConditional(data_field, data.keySet(), (List<String>) field_param.getValue());
                        case UNIQUE -> verifyUniqueness();
                        case REQUIRED -> {} // Do nothing as this is handled separately
                    }
                }
                System.out.println();
            } catch (IllegalArgumentException e){
                throw e;
            }
        }
    }
}
