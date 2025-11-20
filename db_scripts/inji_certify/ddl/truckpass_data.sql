-- Create driver table
CREATE TABLE certify.driver (
    id BIGSERIAL PRIMARY KEY,
    uin VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    gender VARCHAR(20),
    email_id VARCHAR(255),
    city VARCHAR(100),
    face_image_path VARCHAR(255),
    driver_license_number VARCHAR(100),
    passport_number VARCHAR(100)
);

-- Create truck_pass table
CREATE TABLE certify.truck_pass (
    id BIGSERIAL PRIMARY KEY,
    driver_uin VARCHAR(255),
    driver_name VARCHAR(255),
    phone_number VARCHAR(50),
    gender VARCHAR(20),
    email_id VARCHAR(255),
    city VARCHAR(100),
    face_image_path VARCHAR(255),
    driver_license_number VARCHAR(100),
    passport_number VARCHAR(100),
    invoice_number VARCHAR(100),
    cmr_waybill VARCHAR(100),
    customs_documentation VARCHAR(255),
    weight_certificate_path VARCHAR(255),
    vehicle_type VARCHAR(50),
    axle_size VARCHAR(50),
    vehicle_registration_docs_path VARCHAR(255),
    truck_license_plate VARCHAR(50),
    exporter_name VARCHAR(255),
    importer_name VARCHAR(255),
    entry_exit_point VARCHAR(100),
    country_origin VARCHAR(100),
    country_destination VARCHAR(100),
    date_departure VARCHAR(50),
    date_return VARCHAR(50)
);
