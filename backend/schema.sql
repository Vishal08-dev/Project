-- BloodLink Database Schema
-- MySQL 5.7+

-- Create database
CREATE DATABASE IF NOT EXISTS blood_donation_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE blood_donation_db;

-- Donors table
CREATE TABLE IF NOT EXISTS donors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    city VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    is_eligible BOOLEAN DEFAULT TRUE,
    last_donation_date DATE NULL,
    total_donations INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_blood_group (blood_group),
    INDEX idx_status (status),
    INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Blood requests table
CREATE TABLE IF NOT EXISTS blood_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    units INT NOT NULL,
    hospital_name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    message TEXT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    urgency VARCHAR(20) DEFAULT 'normal',
    donor_id INT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_blood_group (blood_group),
    INDEX idx_status (status),
    INDEX idx_donor_id (donor_id),
    FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    location VARCHAR(100) NOT NULL,
    units INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'completed',
    donation_date DATE NOT NULL,
    notes TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_donor_id (donor_id),
    INDEX idx_donation_date (donation_date),
    FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Blood stock table
CREATE TABLE IF NOT EXISTS blood_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blood_group VARCHAR(5) UNIQUE NOT NULL,
    units_available INT DEFAULT 0,
    units_reserved INT DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_blood_group (blood_group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO admins (username, email, password_hash, full_name, role)
VALUES (
    'admin',
    'admin@bloodlink.org',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5FS.NwZlRU.HK',
    'System Administrator',
    'admin'
) ON DUPLICATE KEY UPDATE username=username;

-- Insert initial blood stock
INSERT INTO blood_stock (blood_group, units_available, units_reserved) VALUES
    ('A+', 100, 0),
    ('A-', 80, 0),
    ('B+', 120, 0),
    ('B-', 60, 0),
    ('O+', 200, 0),
    ('O-', 50, 0),
    ('AB+', 90, 0),
    ('AB-', 40, 0)
ON DUPLICATE KEY UPDATE blood_group=blood_group;

-- Create views for better querying
CREATE OR REPLACE VIEW active_donors AS
SELECT
    d.*,
    COUNT(dn.id) as donation_count
FROM donors d
LEFT JOIN donations dn ON d.id = dn.donor_id
WHERE d.status = 'approved'
GROUP BY d.id;

CREATE OR REPLACE VIEW pending_requests_summary AS
SELECT
    blood_group,
    COUNT(*) as request_count,
    SUM(units) as total_units_needed
FROM blood_requests
WHERE status = 'pending'
GROUP BY blood_group;

-- Success message
SELECT 'Database schema created successfully!' as message;
SELECT 'Default admin email: admin@bloodlink.org' as info;
SELECT 'Default admin password: admin123' as info;
SELECT 'IMPORTANT: Change the admin password after first login!' as warning;
