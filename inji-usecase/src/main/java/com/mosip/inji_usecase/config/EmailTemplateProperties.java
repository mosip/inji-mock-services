package com.mosip.inji_usecase.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "mosip.inji-usecase.templates")
public class EmailTemplateProperties {

    /**
     * Will bind properties under mosip.inji-usecase.templates.email.*
     * e.g. mosip.inji-usecase.templates.email.farmer=...
     */
    private Map<String, String> email = new HashMap<>();

    public Map<String, String> getEmail() {
        return email;
    }

    public void setEmail(Map<String, String> email) {
        this.email = email;
    }

}
