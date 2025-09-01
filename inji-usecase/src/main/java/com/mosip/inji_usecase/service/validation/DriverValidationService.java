
package com.mosip.inji_usecase.service.validation;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mosip.inji_usecase.repository.driver.DriverRepository;
import com.mosip.inji_usecase.repository.company.CompanyRepository;

@Service("driverValidationService")
public class DriverValidationService extends AbstractValidationService {

    private static final Logger logger = LoggerFactory.getLogger(DriverValidationService.class);

    @Autowired(required = false)
    private DriverRepository driverRepository;

    @Autowired(required = false)
    private CompanyRepository companyRepository;

    public DriverValidationService(VerifyFieldService verifyFieldService) {
        super(verifyFieldService, "validation/driver.json", logger);
    }

    @Override
    public void validate(Map<String, Object> data) {
        // First perform standard validations
        super.validate(data);

        // Additional custom validations
        validateUniqueFields(data);
        validateCompanyExists(data);
        validateFileFormats(data);
    }

    private void validateUniqueFields(Map<String, Object> data) {
        if (driverRepository == null) return;

        // ✅ Check UIN uniqueness - Updated message
        if (data.containsKey("uin")) {
            String uin = data.get("uin").toString();
            if (driverRepository.findByUin(uin).isPresent()) {
                throw new IllegalArgumentException("Driver with UIN " + uin + " already exists");
            }
        }

        // Check email uniqueness
        if (data.containsKey("emailId")) {
            String emailId = data.get("emailId").toString();
            if (driverRepository.findByEmailId(emailId).isPresent()) {
                throw new IllegalArgumentException("Driver with email " + emailId + " already registered");
            }
        }

        // Check driver license uniqueness
        if (data.containsKey("driversLicenseNumber")) {
            String licenseNumber = data.get("driversLicenseNumber").toString();
            if (driverRepository.findByDriversLicenseNumber(licenseNumber).isPresent()) {
                throw new IllegalArgumentException("Driver with license number " + licenseNumber + " already exists");
            }
        }
    }

    private void validateCompanyExists(Map<String, Object> data) {
        if (companyRepository == null || !data.containsKey("companyId")) return;

        try {
            Long companyId = Long.valueOf(data.get("companyId").toString());
            if (!companyRepository.existsById(companyId)) {
                throw new IllegalArgumentException("Company with ID " + companyId + " does not exist");
            }
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid company ID format");
        }
    }

    private void validateFileFormats(Map<String, Object> data) {
        // Validate face image format
        if (data.containsKey("faceImage")) {
            validateBase64File(data.get("faceImage"), "faceImage");
        }

        // Validate CPC certificate format
        if (data.containsKey("cpcCertificate")) {
            validateBase64File(data.get("cpcCertificate"), "cpcCertificate");
        }
    }

    private void validateBase64File(Object fileData, String fieldName) {
        if (fileData == null) return;

        String base64String = fileData.toString();
        if (base64String.trim().isEmpty()) return;

        // Basic Base64 validation
        if (base64String.contains(",")) {
            String prefix = base64String.substring(0, base64String.indexOf(","));
            if (!isValidFileType(prefix)) {
                // ✅ Updated to match exact error message
                throw new IllegalArgumentException("Invalid file type for " + fieldName + ". Please upload valid PDF or image documents");
            }
        }
    }

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
}
