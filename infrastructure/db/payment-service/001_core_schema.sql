-- ============================================
-- PAYMENT SERVICE DATABASE
-- Database: payment_db
-- Owner: payment-service ONLY
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Schema Versioning (REQUIRED in all services)
-- ============================================
CREATE TABLE schema_versions (
    version INT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    checksum VARCHAR(64)
);

INSERT INTO schema_versions (version, service_name, description, checksum)
VALUES (1, 'payment-service', 'Core payment schema - isolated database', MD5('payment_v1'));

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
-- PAYMENTS TABLE (CORE - NO FOREIGN KEYS!)
-- ============================================
-- Note: from_user_id, to_user_id are UUIDs but NOT foreign keys
-- User existence is validated via gRPC call to User Service
-- ============================================
CREATE TABLE payments (
    -- Identifiers
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User references (NO FOREIGN KEYS - validated via gRPC)
    from_user_id UUID NOT NULL,  -- Validated by User Service
    to_user_id UUID NOT NULL,    -- Validated by User Service
    
    -- Snapshot data (for audit trail if users are deleted)
    from_user_email_snapshot VARCHAR(255),
    to_user_email_snapshot VARCHAR(255),
    
    -- Payment amount
    amount_cents BIGINT NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    
    -- Payment method
    payment_method VARCHAR(50) NOT NULL,  -- card, bank_transfer, wallet, crypto
    payment_method_id UUID,
    
    -- Status workflow
    status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- pending, processing, completed, failed, cancelled, reversed
    reason_code VARCHAR(100),
    reason_message TEXT,
    
    -- Fraud check results
    fraud_check_status VARCHAR(50) DEFAULT 'not_checked',  -- not_checked, approved, review, blocked
    fraud_check_score DECIMAL(5, 2),
    fraud_rule_violations JSONB DEFAULT '[]',
    fraud_checked_at TIMESTAMP WITH TIME ZONE,
    
    -- Idempotency (CRITICAL for payment safety)
    idempotency_key UUID NOT NULL UNIQUE,
    
    -- Tracing
    trace_id VARCHAR(100),
    correlation_id VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    description TEXT,
    metadata JSONB DEFAULT '{}',
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    
    -- Constraints (NO Foreign Keys to other services!)
    CONSTRAINT chk_amount CHECK (amount_cents > 0),
    CONSTRAINT chk_status CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'reversed')),
    CONSTRAINT chk_fraud_status CHECK (fraud_check_status IN ('not_checked', 'approved', 'review', 'blocked')),
    CONSTRAINT chk_payment_method CHECK (payment_method IN ('card', 'bank_transfer', 'wallet', 'crypto'))
);

-- ============================================
-- PAYMENT REVERSALS/REFUNDS
-- ============================================
CREATE TABLE payment_reversals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_payment_id UUID NOT NULL,  -- Reference to payment, but NOT enforced as FK
    reversal_amount_cents BIGINT NOT NULL,
    reason_code VARCHAR(100) NOT NULL,
    reason_message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- pending, completed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    initiated_by UUID,  -- User who initiated reversal (not from User table)
    
    CONSTRAINT chk_reversal_amount CHECK (reversal_amount_cents > 0),
    CONSTRAINT chk_reversal_status CHECK (status IN ('pending', 'completed', 'failed'))
);

-- ============================================
-- IDEMPOTENCY CACHE (Prevent duplicate payments)
-- ============================================
CREATE TABLE idempotency_cache (
    id SERIAL PRIMARY KEY,
    idempotency_key UUID NOT NULL UNIQUE,
    service_name VARCHAR(100) NOT NULL,
    request_hash VARCHAR(64) NOT NULL,
    response JSONB NOT NULL,
    response_status INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
    
    CONSTRAINT chk_response_status CHECK (response_status > 0)
);

-- ============================================
-- PAYMENT WALLET (Local balance tracking)
-- ============================================
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,  -- NO FOREIGN KEY - referenced user must exist in User Service
    balance_cents BIGINT NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'active',  -- active, frozen, closed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT chk_balance CHECK (balance_cents >= 0),
    CONSTRAINT chk_wallet_status CHECK (status IN ('active', 'frozen', 'closed'))
);

-- ============================================
-- DAILY VOLUME LIMITS (Fraud prevention)
-- ============================================
CREATE TABLE daily_volume_limits (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,  -- NO FOREIGN KEY
    daily_limit_cents BIGINT NOT NULL,
    transaction_count_limit INT NOT NULL DEFAULT 100,
    current_volume_cents BIGINT NOT NULL DEFAULT 0,
    transaction_count INT NOT NULL DEFAULT 0,
    limit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reset_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 day'),
    
    CONSTRAINT chk_daily_limit CHECK (daily_limit_cents > 0),
    CONSTRAINT chk_trans_count_limit CHECK (transaction_count_limit > 0)
);

-- ============================================
-- AUDIT LOG (Local audit trail)
-- ============================================
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    payment_id UUID,  -- Reference to payment
    action VARCHAR(100) NOT NULL,  -- created, updated, reversed, cancelled
    actor_user_id UUID,  -- User who initiated action (NO FK)
    actor_service VARCHAR(100),  -- Which service made the change
    old_value JSONB,
    new_value JSONB,
    change_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- ============================================
-- INDEXES (CRITICAL - no FKs means manual indexing)
-- ============================================
CREATE INDEX idx_payments_from_user ON payments(from_user_id);
CREATE INDEX idx_payments_to_user ON payments(to_user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_fraud_status ON payments(fraud_check_status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX idx_payments_idempotency_key ON payments(idempotency_key);
CREATE INDEX idx_payments_trace_id ON payments(trace_id);
CREATE INDEX idx_payments_user_status ON payments(from_user_id, status);

CREATE INDEX idx_reversals_original_payment ON payment_reversals(original_payment_id);
CREATE INDEX idx_reversals_status ON payment_reversals(status);

CREATE INDEX idx_idempotency_key ON idempotency_cache(idempotency_key);
CREATE INDEX idx_idempotency_expires ON idempotency_cache(expires_at);

CREATE INDEX idx_wallets_user_id ON wallets(user_id);

CREATE INDEX idx_audit_payment_id ON audit_log(payment_id);
CREATE INDEX idx_audit_created_at ON audit_log(created_at DESC);

CREATE INDEX idx_daily_limits_user_reset ON daily_volume_limits(user_id, reset_at);

-- ============================================
-- MIGRATION HISTORY
-- ============================================
INSERT INTO migration_history (version, migration_name, status, completed_at, duration_ms)
VALUES (1, 'V001__payment_core_schema.sql', 'completed', NOW(), 0);