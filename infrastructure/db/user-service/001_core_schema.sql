-- ============================================
-- USER SERVICE DATABASE
-- Database: user_db
-- Owner: user-service ONLY
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Schema Versioning
-- ============================================
CREATE TABLE schema_versions (
    version INT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    checksum VARCHAR(64)
);

INSERT INTO schema_versions (version, service_name, description, checksum)
VALUES (1, 'user-service', 'Core user schema - isolated database', MD5('user_v1'));

CREATE TABLE migration_history (
    id SERIAL PRIMARY KEY,
    version INT NOT NULL REFERENCES schema_versions(version),
    migration_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    duration_ms INT,
    CONSTRAINT chk_status CHECK (status IN ('pending', 'completed', 'failed', 'rolled_back'))
);

-- ============================================
-- USERS TABLE (NO EXTERNAL REFERENCES)
-- ============================================
CREATE TABLE users (
    -- Identity
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    
    -- Profile
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    
    -- KYC/Verification
    kyc_status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- pending, approved, rejected, needs_review
    kyc_verified_at TIMESTAMP WITH TIME ZONE,
    kyc_document_hash VARCHAR(255),
    
    -- Account status
    account_status VARCHAR(50) NOT NULL DEFAULT 'active',  -- active, suspended, closed
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    account_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    account_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',  -- Custom fields, preferences, etc.
    
    CONSTRAINT chk_kyc_status CHECK (kyc_status IN ('pending', 'approved', 'rejected', 'needs_review')),
    CONSTRAINT chk_account_status CHECK (account_status IN ('active', 'suspended', 'closed'))
);

-- ============================================
-- USER PROFILES (Extended user information)
-- ============================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,  -- NO FOREIGN KEY - User Service owns this
    
    -- Address
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(100),
    address_country VARCHAR(100),
    address_postal_code VARCHAR(20),
    
    -- Identity
    identity_document_type VARCHAR(50),  -- passport, national_id, driver_license
    identity_document_number VARCHAR(100),
    identity_verified BOOLEAN DEFAULT FALSE,
    identity_verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Profile
    date_of_birth DATE,
    avatar_url VARCHAR(500),
    biography TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER CREDENTIALS (Password, auth tokens)
-- ============================================
CREATE TABLE user_credentials (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,  -- NO FOREIGN KEY
    password_hash VARCHAR(255) NOT NULL,
    password_salt VARCHAR(255) NOT NULL,
    last_password_change TIMESTAMP WITH TIME ZONE,
    is_password_expired BOOLEAN DEFAULT FALSE,
    
    -- Multi-factor auth
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER AUDIT LOG
-- ============================================
CREATE TABLE user_audit_log (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,  -- NO FOREIGN KEY
    action VARCHAR(100) NOT NULL,  -- login, logout, profile_update, kyc_submitted
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    failure_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
CREATE INDEX idx_users_account_status ON users(account_status);
CREATE INDEX idx_users_created_at ON users(account_created_at DESC);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_identity_verified ON user_profiles(identity_verified);

CREATE INDEX idx_user_audit_user_id ON user_audit_log(user_id);
CREATE INDEX idx_user_audit_created_at ON user_audit_log(created_at DESC);

-- ============================================
-- MIGRATION HISTORY
-- ============================================
INSERT INTO migration_history (version, migration_name, status, completed_at, duration_ms)
VALUES (1, 'V001__user_core_schema.sql', 'completed', NOW(), 0);