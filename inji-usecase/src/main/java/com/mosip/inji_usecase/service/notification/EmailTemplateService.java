package com.mosip.inji_usecase.service.notification;

import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class EmailTemplateService {

    public String generateDriverRegistrationTemplate(Map<String, Object> templateData) {
        String driverName = (String) templateData.get("fullName");
        String uin = (String) templateData.get("uin");
        String licenseNumber = (String) templateData.get("driversLicenseNumber");
        Long driverId = (Long) templateData.get("id");

        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px; margin-bottom: 20px; }
                    .content { line-height: 1.6; color: #333; }
                    .info-box { background-color: #f8f9fa; padding: 15px; border-left: 4px solid #4CAF50; margin: 15px 0; }
                    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #666; }
                    .button { display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🚛 TruckPass Registration Successful!</h1>
                    </div>
                    
                    <div class="content">
                        <h2>Welcome to TruckPass, %s!</h2>
                        
                        <p>Congratulations! Your driver registration has been successfully completed. You can now start using our TruckPass services.</p>
                        
                        <div class="info-box">
                            <h3>📋 Registration Details:</h3>
                            <ul>
                                <li><strong>Driver ID:</strong> #%d</li>
                                <li><strong>Full Name:</strong> %s</li>
                                <li><strong>UIN:</strong> %s</li>
                                <li><strong>License Number:</strong> %s</li>
                                <li><strong>Registration Date:</strong> %s</li>
                            </ul>
                        </div>
                        
                        <h3>🎯 What's Next?</h3>
                        <ul>
                            <li>Your application is now under review by our team</li>
                            <li>You will receive another email once verification is complete</li>
                            <li>Keep your documents ready for any additional verification</li>
                            <li>You can track your application status using your Driver ID</li>
                        </ul>
                        
                        <h3>📞 Need Help?</h3>
                        <p>If you have any questions or need assistance, please contact our support team:</p>
                        <ul>
                            <li><strong>Email:</strong> support@truckpass.com</li>
                            <li><strong>Phone:</strong> +1-800-TRUCKPASS</li>
                            <li><strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM</li>
                        </ul>
                    </div>
                    
                    <div class="footer">
                        <p>© 2025 TruckPass Registration System. All rights reserved.</p>
                        <p>This is an automated message. Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
            """,
                driverName, driverId, driverName, uin, licenseNumber,
                java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a"))
        );
    }

    public String generateAdminNotificationTemplate(Map<String, Object> templateData) {
        String driverName = (String) templateData.get("fullName");
        String uin = (String) templateData.get("uin");
        String emailId = (String) templateData.get("emailId");
        Long driverId = (Long) templateData.get("id");
        Integer companyId = (Integer) templateData.get("companyId");

        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; }
                    .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px; }
                    .urgent { background-color: #ff9800; color: white; padding: 10px; text-align: center; border-radius: 5px; margin-bottom: 20px; }
                    .info-table { width: 100%%; border-collapse: collapse; margin: 20px 0; }
                    .info-table th, .info-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                    .info-table th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔔 New Driver Registration</h1>
                    </div>
                    
                    <div class="urgent">
                        <strong>⚡ ADMIN NOTIFICATION - Immediate Review Required</strong>
                    </div>
                    
                    <p>A new driver has successfully registered in the TruckPass system and requires admin review.</p>
                    
                    <table class="info-table">
                        <tr><th>Field</th><th>Value</th></tr>
                        <tr><td>Driver ID</td><td>#%d</td></tr>
                        <tr><td>Full Name</td><td>%s</td></tr>
                        <tr><td>UIN</td><td>%s</td></tr>
                        <tr><td>Email</td><td>%s</td></tr>
                        <tr><td>Company ID</td><td>%d</td></tr>
                        <tr><td>Registration Time</td><td>%s</td></tr>
                    </table>
                    
                    <h3>📋 Required Actions:</h3>
                    <ul>
                        <li>Review driver documentation</li>
                        <li>Verify company association</li>
                        <li>Approve or reject the application</li>
                        <li>Send notification to driver</li>
                    </ul>
                    
                    <p><strong>Please log into the admin panel to review this registration.</strong></p>
                </div>
            </body>
            </html>
            """,
                driverId, driverName, uin, emailId, companyId,
                java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a"))
        );
    }
}
