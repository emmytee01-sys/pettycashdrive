-- PettyCash Database Schema

CREATE DATABASE IF NOT EXISTS pettycash;
USE pettycash;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'user') DEFAULT 'user',
    credit_score INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Loans Table
CREATE TABLE IF NOT EXISTS loans (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    tenure INT NOT NULL, -- months
    status ENUM('pending', 'approved', 'disbursed', 'rejected', 'completed') DEFAULT 'pending',
    loan_reference VARCHAR(50) UNIQUE NOT NULL,
    admin_notes TEXT,
    -- Payout Bank Details
    bank_name VARCHAR(100),
    account_number VARCHAR(20),
    account_name VARCHAR(255),
    nin VARCHAR(20),
    bvn VARCHAR(20),
    -- Next of Kin Details
    nok_name VARCHAR(255),
    nok_phone VARCHAR(20),
    nok_email VARCHAR(100),
    nok_address TEXT,
    nok_city VARCHAR(100),
    nok_state VARCHAR(100),
    nok_country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Car Details Table
CREATE TABLE IF NOT EXISTS car_details (
    id CHAR(36) PRIMARY KEY,
    loan_id CHAR(36) NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    condition_text VARCHAR(50),
    plate_number VARCHAR(20),
    is_owner BOOLEAN DEFAULT TRUE,
    insurance_type VARCHAR(50),
    valuation DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE
);

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id CHAR(36) PRIMARY KEY,
    loan_id CHAR(36) NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- e.g. 'roadworthiness', 'license', 'proof_of_ownership', 'front_photo', 'back_photo'
    file_url TEXT NOT NULL,
    status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id CHAR(36) PRIMARY KEY,
    loan_id CHAR(36) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status ENUM('pending', 'successful', 'failed') DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id CHAR(36) PRIMARY KEY,
    admin_id CHAR(36) NOT NULL,
    loan_id CHAR(36) NOT NULL,
    action VARCHAR(100) NOT NULL, -- e.g. 'status_change', 'note_added'
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE
);
