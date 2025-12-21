-- =====================================================
-- USER SERVICE DATABASE - PRODUCTION COMPLETE
-- Database: user_db
-- Created: December 17, 2025
-- Purpose: Identity, KYC, Transaction Limits, User Management
-- =====================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE (Complete with KYC tiers)
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Contact info
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) UNIQUE,
    
    -- Profile
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    nationality VARCHAR(3), -- ISO 3166-1 alpha-3 (USA, VNM, etc.)
    
    -- Authentication
    password_hash VARCHAR(255) NOT NULL,
    
    -- KYC status with tiers
    -- tier_0 = unverified (max $100/day)
    -- tier_1 = basic KYC (max $1000/day)
    -- tier_2 = enhanced KYC (max $10,000/day)
    -- tier_3 = full KYC (max $100,000/day)
    kyc_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    kyc_tier VARCHAR(20) NOT NULL DEFAULT 'TIER_0',
    kyc_verified_at TIMESTAMPTZ,
    kyc_verified_by UUID, -- Admin who verified
    
    -- Account state
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_suspended BOOLEAN NOT NULL DEFAULT false,
    suspension_reason TEXT,
    
    -- Fraud tracking
    fraud_score INT NOT NULL DEFAULT 0 CHECK (fraud_score >= 0 AND fraud_score <= 100),
    
    -- Metadata
    ip_address_registration VARCHAR(50),
    user_agent_registration TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT chk_kyc_status CHECK (kyc_status IN ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED')),
    CONSTRAINT chk_kyc_tier CHECK (kyc_tier IN ('TIER_0', 'TIER_1', 'TIER_2', 'TIER_3')),
    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- =====================================================
-- KYC_DOCUMENTS TABLE
-- Store uploaded identity verification documents
-- =====================================================
CREATE TABLE kyc_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Owner
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Document details
    document_type VARCHAR(50) NOT NULL, -- 'passport', 'drivers_license', 'national_id', 'utility_bill'
    document_number VARCHAR(100),
    document_country VARCHAR(3), -- ISO 3166-1 alpha-3
    
    -- File storage (S3 or local path)
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    
    -- Verification
    verification_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    verification_notes TEXT, -- Admin notes (approval/rejection reason)
    verified_by UUID, -- Admin who verified
    verified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ, -- Document expiration date
    
    -- OCR/Extracted data (optional)
    extracted_data JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_document_type CHECK (document_type IN ('PASSPORT', 'DRIVERS_LICENSE', 'NATIONAL_ID', 'UTILITY_BILL', 'SELFIE')),
    CONSTRAINT chk_verification_status CHECK (verification_status IN ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'))
);

-- =====================================================
-- TRANSACTION_LIMITS TABLE
-- Define per-tier transaction limits
-- =====================================================
CREATE TABLE transaction_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Tier definition
    tier_name VARCHAR(20) NOT NULL UNIQUE,
    
    -- Limits (in cents to avoid floating point issues)
    daily_send_limit_cents BIGINT NOT NULL,
    daily_receive_limit_cents BIGINT NOT NULL,
    single_transaction_max_cents BIGINT NOT NULL,
    monthly_volume_limit_cents BIGINT NOT NULL,
    
    -- Restrictions
    max_transactions_per_day INT NOT NULL DEFAULT 100,
    max_transactions_per_hour INT NOT NULL DEFAULT 10,
    
    -- Features allowed
    can_send_international BOOLEAN NOT NULL DEFAULT false,
    can_receive_merchant_payments BOOLEAN NOT NULL DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_tier_name CHECK (tier_name IN ('TIER_0', 'TIER_1', 'TIER_2', 'TIER_3')),
    CONSTRAINT chk_limits_positive CHECK (
        daily_send_limit_cents > 0 AND 
        daily_receive_limit_cents > 0 AND 
        single_transaction_max_cents > 0
    )
);

-- =====================================================
-- DAILY_USAGE TABLE
-- Track daily transaction volumes for limit enforcement
-- =====================================================
CREATE TABLE daily_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Who and when
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    usage_date DATE NOT NULL,
    
    -- Sent statistics
    total_sent_cents BIGINT NOT NULL DEFAULT 0,
    total_sent_count INT NOT NULL DEFAULT 0,
    
    -- Received statistics
    total_received_cents BIGINT NOT NULL DEFAULT 0,
    total_received_count INT NOT NULL DEFAULT 0,
    
    -- Hourly velocity tracking (JSON for flexibility)
    hourly_sent_counts JSONB NOT NULL DEFAULT '{}', -- {"00": 2, "01": 0, "14": 5}
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Unique constraint: one record per user per day
    CONSTRAINT uq_user_date UNIQUE (user_id, usage_date)
);

-- =====================================================
-- USER_CONTACTS TABLE
-- Store frequently used recipient contacts
-- =====================================================
CREATE TABLE user_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Owner
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Contact details
    contact_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nickname VARCHAR(100), -- "Mom", "Landlord", etc.
    
    -- Usage stats
    total_transactions INT NOT NULL DEFAULT 0,
    last_transaction_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_no_self_contact CHECK (user_id != contact_user_id),
    CONSTRAINT uq_user_contact UNIQUE (user_id, contact_user_id)
);

-- =====================================================
-- USER_PREFERENCES TABLE
-- User settings and preferences
-- =====================================================
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Owner (1:1 relationship)
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification preferences
    email_notifications BOOLEAN NOT NULL DEFAULT true,
    sms_notifications BOOLEAN NOT NULL DEFAULT false,
    push_notifications BOOLEAN NOT NULL DEFAULT true,
    
    -- Transaction preferences
    require_2fa_for_transfers BOOLEAN NOT NULL DEFAULT false,
    default_currency VARCHAR(3) NOT NULL DEFAULT 'VND',
    
    -- Privacy
    show_profile_to_public BOOLEAN NOT NULL DEFAULT false,
    allow_receive_from_strangers BOOLEAN NOT NULL DEFAULT true,
    
    -- Language and timezone
    preferred_language VARCHAR(5) NOT NULL DEFAULT 'en-US',
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
CREATE INDEX idx_users_kyc_tier ON users(kyc_tier);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;
CREATE INDEX idx_users_fraud_score ON users(fraud_score) WHERE fraud_score > 50;

-- KYC Documents
CREATE INDEX idx_kyc_docs_user_id ON kyc_documents(user_id);
CREATE INDEX idx_kyc_docs_status ON kyc_documents(verification_status);
CREATE INDEX idx_kyc_docs_created_at ON kyc_documents(created_at DESC);

-- Daily Usage
CREATE INDEX idx_daily_usage_user_date ON daily_usage(user_id, usage_date DESC);
CREATE INDEX idx_daily_usage_date ON daily_usage(usage_date DESC);

-- User Contacts
CREATE INDEX idx_contacts_user_id ON user_contacts(user_id);
CREATE INDEX idx_contacts_contact_id ON user_contacts(contact_user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Updated_at trigger for users
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyc_documents_updated_at
    BEFORE UPDATE ON kyc_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transaction_limits_updated_at
    BEFORE UPDATE ON transaction_limits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_usage_updated_at
    BEFORE UPDATE ON daily_usage
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Get user's current tier limits
CREATE OR REPLACE FUNCTION get_user_limits(p_user_id UUID)
RETURNS TABLE (
    daily_send_limit_cents BIGINT,
    daily_receive_limit_cents BIGINT,
    single_transaction_max_cents BIGINT,
    daily_sent_so_far_cents BIGINT,
    can_send_international BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tl.daily_send_limit_cents,
        tl.daily_receive_limit_cents,
        tl.single_transaction_max_cents,
        COALESCE(du.total_sent_cents, 0) AS daily_sent_so_far_cents,
        tl.can_send_international
    FROM users u
    JOIN transaction_limits tl ON tl.tier_name = u.kyc_tier
    LEFT JOIN daily_usage du ON du.user_id = u.id AND du.usage_date = CURRENT_DATE
    WHERE u.id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Check if user can transact
CREATE OR REPLACE FUNCTION can_user_transact(p_user_id UUID, p_amount_cents BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
    v_is_active BOOLEAN;
    v_is_suspended BOOLEAN;
    v_kyc_status VARCHAR(20);
    v_daily_limit BIGINT;
    v_daily_sent BIGINT;
BEGIN
    -- Get user status
    SELECT is_active, is_suspended, kyc_status
    INTO v_is_active, v_is_suspended, v_kyc_status
    FROM users
    WHERE id = p_user_id;
    
    -- Check basic conditions
    IF NOT v_is_active OR v_is_suspended OR v_kyc_status != 'approved' THEN
        RETURN false;
    END IF;
    
    -- Check limits
    SELECT daily_send_limit_cents, daily_sent_so_far_cents
    INTO v_daily_limit, v_daily_sent
    FROM get_user_limits(p_user_id);
    
    IF (v_daily_sent + p_amount_cents) > v_daily_limit THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SEED DATA (Transaction Limits)
-- =====================================================
INSERT INTO transaction_limits (tier_name, daily_send_limit_cents, daily_receive_limit_cents, single_transaction_max_cents, monthly_volume_limit_cents, max_transactions_per_day, max_transactions_per_hour, can_send_international, can_receive_merchant_payments)
VALUES 
    ('TIER_0', 10000, 10000, 5000, 100000, 5, 2, false, false),           -- $100/day, $50/txn
    ('TIER_1', 100000, 200000, 50000, 2000000, 20, 5, false, true),       -- $1,000/day, $500/txn
    ('TIER_2', 1000000, 2000000, 500000, 20000000, 50, 10, true, true),   -- $10,000/day, $5,000/txn
    ('TIER_3', 10000000, 20000000, 5000000, 100000000, 200, 50, true, true); -- $100,000/day, $50,000/txn

-- =====================================================
-- SEED DATA (Test Users)
-- =====================================================
INSERT INTO users (id, email, phone, first_name, last_name, password_hash, kyc_status, kyc_tier, is_active, fraud_score)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'alice@example.com', '0901234567', 'Alice', 'Nguyen', '$2a$10$dummy_hash_alice', 'APPROVED', 'TIER_2', true, 10),
    ('22222222-2222-2222-2222-222222222222', 'bob@example.com', '0907654321', 'Bob', 'Tran', '$2a$10$dummy_hash_bob', 'APPROVED', 'TIER_2', true, 5),
    ('33333333-3333-3333-3333-333333333333', 'charlie@example.com', '0909876543', 'Charlie', 'Le', '$2a$10$dummy_hash_charlie', 'PENDING', 'TIER_0', true, 0);

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE users IS 'Core user accounts with KYC tiers and fraud tracking';
COMMENT ON TABLE kyc_documents IS 'Identity verification documents (passport, ID, etc.)';
COMMENT ON TABLE transaction_limits IS 'Per-tier transaction limits and restrictions';
COMMENT ON TABLE daily_usage IS 'Daily transaction volume tracking for limit enforcement';
COMMENT ON TABLE user_contacts IS 'Frequently used recipient contacts';
COMMENT ON TABLE user_preferences IS 'User settings and preferences';
COMMENT ON COLUMN users.kyc_tier IS 'TIER_0=unverified, TIER_1=basic, TIER_2=enhanced, TIER_3=full KYC';
COMMENT ON COLUMN users.fraud_score IS '0-100 risk score, higher = more suspicious';
COMMENT ON COLUMN daily_usage.hourly_sent_counts IS 'JSON tracking hourly velocity: {"00": 2, "14": 5}';
