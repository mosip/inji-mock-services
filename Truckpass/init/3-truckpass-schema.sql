\c truckpass;

CREATE SCHEMA IF NOT EXISTS company_details;

CREATE TABLE company_details.company (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    registration_status VARCHAR(50) CHECK (registration_status IN ('Active', 'Inactive')) NOT NULL,
    registration_type VARCHAR(100),
    registered_email VARCHAR(255) UNIQUE NOT NULL
);

INSERT INTO company_details.company (company_name, registration_status, registration_type, registered_email) VALUES
('Global Logistics Inc', 'Active', 'Private Limited', 'contact@globallogistics.com'),
('Streamline Freight', 'Active', 'Public Limited', 'info@streamlinefreight.com'),
('Rapid Transport', 'Inactive', 'Sole Proprietorship', 'support@rapidtransport.com');
