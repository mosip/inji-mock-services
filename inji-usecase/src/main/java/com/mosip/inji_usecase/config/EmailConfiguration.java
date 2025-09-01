package com.mosip.inji_usecase.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import lombok.Data;

import java.util.Properties;

@Configuration
@PropertySource({"classpath:email.properties"})
@ConfigurationProperties(prefix = "mosip.kernel.notification.email")
@Data
public class EmailConfiguration {

    private boolean enabled;
    private Smtp smtp = new Smtp();
    private String from;
    private String fromName;
    private Driver driver = new Driver();
    private Admin admin = new Admin();

    @Data
    public static class Smtp {
        private String host;
        private int port;
        private String username;
        private String password;
        private boolean auth;
        private boolean starttlsEnable;
    }

    @Data
    public static class Driver {
        private Registration registration = new Registration();

        @Data
        public static class Registration {
            private String subject;
        }
    }

    @Data
    public static class Admin {
        private boolean notificationEnabled;
        private String email;
    }

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        mailSender.setHost(smtp.getHost());
        mailSender.setPort(smtp.getPort());
        mailSender.setUsername(smtp.getUsername());
        mailSender.setPassword(smtp.getPassword());

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", smtp.isAuth());
        props.put("mail.smtp.starttls.enable", smtp.isStarttlsEnable());
        props.put("mail.debug", "false");

        return mailSender;
    }
}
