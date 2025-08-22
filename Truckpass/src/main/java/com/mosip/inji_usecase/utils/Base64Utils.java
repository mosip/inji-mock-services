package com.mosip.inji_usecase.utils;

import java.util.Base64;
import org.springframework.stereotype.Component;

@Component
public class Base64Utils {

    /**
     * Converts base64 string to byte array with file format validation
     * @param base64String The base64 encoded string
     * @return byte array or null if input is null/empty
     */
    public byte[] convertBase64ToByteArray(String base64String) {
        if (base64String == null || base64String.trim().isEmpty()) {
            return null;
        }

        try {
            String originalString = base64String;

            // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
            if (base64String.contains(",")) {
                String prefix = base64String.substring(0, base64String.indexOf(","));
                base64String = base64String.substring(base64String.indexOf(",") + 1);

                // Validate file types for CPC certificate and face image
                if (prefix.contains("data:")) {
                    if (!isValidFileType(prefix)) {
                        throw new IllegalArgumentException("Unsupported file type. Please upload valid PDF or image documents");
                    }
                }
            }

            return Base64.getDecoder().decode(base64String);

        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("Unsupported file type")) {
                throw e;
            }
            throw new IllegalArgumentException("Invalid file format. Please upload valid PDF or image documents");
        }
    }

    /**
     * Validates if the data URL prefix contains supported file types
     */
    private boolean isValidFileType(String dataUrlPrefix) {
        String[] supportedTypes = {
                "image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp",
                "application/pdf", "image/webp", "image/tiff"
        };

        for (String type : supportedTypes) {
            if (dataUrlPrefix.contains(type)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Converts byte array to base64 string
     * @param byteArray The byte array to convert
     * @return base64 encoded string or null if input is null
     */
    public String convertByteArrayToBase64(byte[] byteArray) {
        if (byteArray == null || byteArray.length == 0) {
            return null;
        }

        return Base64.getEncoder().encodeToString(byteArray);
    }
}
