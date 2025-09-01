package com.mosip.inji_usecase.service.notification;

import com.mosip.inji_usecase.config.EmailConfiguration;
import com.mosip.inji_usecase.dto.notification.EmailRequest;
import com.mosip.inji_usecase.dto.notification.EmailResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class KernelNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(KernelNotificationService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailConfiguration emailConfig;

    @Autowired
    private EmailTemplateService templateService;

    @Async
    public CompletableFuture<EmailResponse> sendDriverRegistrationEmail(Map<String, Object> driverData) {
        try {
            if (!emailConfig.isEnabled()) {
                logger.info("Email notifications are disabled");
                return CompletableFuture.completedFuture(
                        EmailResponse.builder()
                                .success(false)
                                .message("Email notifications are disabled")
                                .timestamp(LocalDateTime.now())
                                .build()
                );
            }

            String driverEmail = (String) driverData.get("emailId");
            if (driverEmail == null || driverEmail.trim().isEmpty()) {
                logger.warn("Driver email is empty, cannot send notification");
                return CompletableFuture.completedFuture(
                        EmailResponse.builder()
                                .success(false)
                                .message("Driver email is empty")
                                .timestamp(LocalDateTime.now())
                                .errorCode("MISSING_EMAIL")
                                .build()
                );
            }

            // Generate email template
            String emailBody = templateService.generateDriverRegistrationTemplate(driverData);

            // Create email request
            EmailRequest emailRequest = EmailRequest.builder()
                    .to(List.of(driverEmail))
                    .subject(emailConfig.getDriver().getRegistration().getSubject())
                    .body(emailBody)
                    .isHtml(true)
                    .build();

            // Send email
            EmailResponse response = sendEmail(emailRequest);

            if (response.isSuccess()) {
                logger.info("Driver registration email sent successfully to: {}", driverEmail);

                // Also send admin notification
                if (emailConfig.getAdmin().isNotificationEnabled()) {
                    sendAdminNotificationAsync(driverData);
                }
            } else {
                logger.error("Failed to send driver registration email: {}", response.getErrorMessage());
            }

            return CompletableFuture.completedFuture(response);

        } catch (Exception e) {
            logger.error("Error sending driver registration email", e);
            return CompletableFuture.completedFuture(
                    EmailResponse.builder()
                            .success(false)
                            .message("Failed to send email")
                            .errorMessage(e.getMessage())
                            .timestamp(LocalDateTime.now())
                            .errorCode("EMAIL_SEND_ERROR")
                            .build()
            );
        }
    }

    @Async
    public void sendAdminNotificationAsync(Map<String, Object> driverData) {
        try {
            String adminEmail = emailConfig.getAdmin().getEmail();
            if (adminEmail == null || adminEmail.trim().isEmpty()) {
                logger.warn("Admin email not configured, skipping admin notification");
                return;
            }

            String emailBody = templateService.generateAdminNotificationTemplate(driverData);
            String driverName = (String) driverData.get("fullName");

            EmailRequest adminEmailRequest = EmailRequest.builder()
                    .to(List.of(adminEmail))
                    .subject("🔔 New Driver Registration: " + driverName + " - Action Required")
                    .body(emailBody)
                    .isHtml(true)
                    .build();

            EmailResponse adminResponse = sendEmail(adminEmailRequest);

            if (adminResponse.isSuccess()) {
                logger.info("Admin notification email sent successfully for driver registration");
            } else {
                logger.error("Failed to send admin notification email: {}", adminResponse.getErrorMessage());
            }

        } catch (Exception e) {
            logger.error("Error sending admin notification email", e);
        }
    }

    private EmailResponse sendEmail(EmailRequest emailRequest) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Set sender
            helper.setFrom(emailConfig.getFrom(), emailConfig.getFromName());

            // Set recipients
            if (emailRequest.getTo() != null && !emailRequest.getTo().isEmpty()) {
                helper.setTo(emailRequest.getTo().toArray(new String[0]));
            }

            if (emailRequest.getCc() != null && !emailRequest.getCc().isEmpty()) {
                helper.setCc(emailRequest.getCc().toArray(new String[0]));
            }

            if (emailRequest.getBcc() != null && !emailRequest.getBcc().isEmpty()) {
                helper.setBcc(emailRequest.getBcc().toArray(new String[0]));
            }

            // Set subject and body
            helper.setSubject(emailRequest.getSubject());
            helper.setText(emailRequest.getBody(), emailRequest.isHtml());

            // Send email
            mailSender.send(message);

            String messageId = UUID.randomUUID().toString();
            logger.info("Email sent successfully with message ID: {}", messageId);

            return EmailResponse.builder()
                    .success(true)
                    .messageId(messageId)
                    .message("Email sent successfully")
                    .timestamp(LocalDateTime.now())
                    .build();

        } catch (MessagingException e) {
            logger.error("Failed to send email", e);
            return EmailResponse.builder()
                    .success(false)
                    .message("Failed to send email")
                    .errorMessage(e.getMessage())
                    .timestamp(LocalDateTime.now())
                    .errorCode("MESSAGING_ERROR")
                    .build();
        } catch (Exception e) {
            logger.error("Unexpected error while sending email", e);
            return EmailResponse.builder()
                    .success(false)
                    .message("Unexpected error occurred")
                    .errorMessage(e.getMessage())
                    .timestamp(LocalDateTime.now())
                    .errorCode("UNEXPECTED_ERROR")
                    .build();
        }
    }

    // Public method for generic email sending
    public EmailResponse sendGenericEmail(EmailRequest emailRequest) {
        if (!emailConfig.isEnabled()) {
            logger.info("Email notifications are disabled");
            return EmailResponse.builder()
                    .success(false)
                    .message("Email notifications are disabled")
                    .timestamp(LocalDateTime.now())
                    .build();
        }

        return sendEmail(emailRequest);
    }
}
