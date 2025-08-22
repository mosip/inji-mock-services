package com.mosip.inji_usecase.service.notification;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${kernel.notifier.email.enabled:false}")
    private boolean emailEnabled;

    @Value("${kernel.notifier.email.from}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends registration success email to the driver asynchronously
     * @param driverData Map containing driver information
     */
    @Async
    public CompletableFuture<Void> sendDriverRegistrationEmail(Map<String, Object> driverData) {
        if (!emailEnabled) {
            System.out.println("Email service is disabled. Skipping email notification.");
            return CompletableFuture.completedFuture(null);
        }

        try {
            String fullName = (String) driverData.get("fullName");
            String emailId = (String) driverData.get("emailId");
            String uin = (String) driverData.get("uin");

            if (emailId == null || emailId.trim().isEmpty()) {
                System.err.println("No email address provided for driver: " + fullName);
                return CompletableFuture.completedFuture(null);
            }

            String subject = "Driver Registration Successful - Truck Pass System";
            String message = buildRegistrationEmailContent(fullName, uin);

            sendEmail(emailId, subject, message);
            System.out.println("Registration email sent successfully to: " + emailId);

        } catch (Exception e) {
            System.err.println("Failed to send registration email: " + e.getMessage());
            // Log the error but don't fail the registration process
        }

        return CompletableFuture.completedFuture(null);
    }

    private void sendEmail(String toEmail, String subject, String message) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(fromEmail);
            mailMessage.setTo(toEmail);
            mailMessage.setSubject(subject);
            mailMessage.setText(message);

            mailSender.send(mailMessage);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }

    private String buildRegistrationEmailContent(String fullName, String uin) {
        return String.format(
                "Dear %s,\n\n" +
                        "Congratulations! Your driver registration has been completed successfully.\n\n" +
                        "Registration Details:\n" +
                        "• UIN: %s\n" +
                        "• Registration Date: %s\n" +
                        "• Status: Active\n\n" +
                        "Your driver profile is now ready and you can start using the truck pass system.\n\n" +
                        "Important Notes:\n" +
                        "• Please keep your UIN safe as it will be required for future transactions\n" +
                        "• Contact support if you have any questions\n\n" +
                        "Thank you for registering with our truck pass system.\n\n" +
                        "Best regards,\n" +
                        "Truck Pass System Team\n" +
                        "Email: support@truckpass.com\n" +
                        "Phone: +1-800-TRUCK-PASS",
                fullName,
                uin,
                java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        );
    }

    /**
     * Send a general notification email
     */
    public void sendNotificationEmail(String toEmail, String subject, String message) {
        if (!emailEnabled) {
            System.out.println("Email service is disabled. Skipping email notification.");
            return;
        }

        try {
            sendEmail(toEmail, subject, message);
            System.out.println("Notification email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send notification email: " + e.getMessage());
        }
    }
}
