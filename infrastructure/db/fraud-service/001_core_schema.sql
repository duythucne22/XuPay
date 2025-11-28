-- ============================================
-- FRAUD DETECTION SERVICE DATABASE
-- Database: fraud_db
-- Owner: fraud-service ONLY
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
VALUES (1, 'fraud-service', 'Fraud detection schema - isolated database', MD5('fraud_v1'));

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
-- FRAUD RULES (Configuration)
-- ============================================
CREATE TABLE fraud_rules (
    id SERIAL PRIMARY KEY,
    rule_code VARCHAR(100) NOT NULL UNIQUE,  -- VELOCITY_5_MIN, AMOUNT_UNUSUAL_HIGH, etc.
    rule_name VARCHAR(255) NOT NULL,
    rule_type VARCHAR(50) NOT NULL,  -- velocity, amount, location, behavioral, pattern
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active',  -- active, inactive, testing
    
    -- Rule logic
    condition_json JSONB NOT NULL,  -- {"max_transactions": 3, "time_window_minutes": 5}
    
    -- Action to take
    action VARCHAR(50) NOT NULL DEFAULT 'block',  -- block, review, warn, allow
    risk_score INT NOT NULL DEFAULT 50,  -- 0-100
    priority INT NOT NULL DEFAULT 50,  -- Lower = higher priority
    
    -- Governance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    
    CONSTRAINT chk_rule_type CHECK (rule_type IN ('velocity', 'amount', 'location', 'behavioral', 'pattern')),
    CONSTRAINT chk_rule_action CHECK (action IN ('block', 'review', 'warn', 'allow')),
    CONSTRAINT chk_risk_score CHECK (risk_score >= 0 AND risk_score <= 100),
    CONSTRAINT chk_rule_status CHECK (status IN ('active', 'inactive', 'testing'))
);

-- ============================================
-- FRAUD CHECKS (Transaction evaluations)
-- ============================================
CREATE TABLE fraud_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Transaction reference (NO FOREIGN KEYS)
    payment_id UUID NOT NULL,  -- Reference to Payment Service
    user_id UUID NOT NULL,  -- Reference to User Service
    recipient_id UUID NOT NULL,  -- Reference to User Service
    
    -- Check details
    check_type VARCHAR(100) NOT NULL,  -- velocity_check, amount_check, location_check, etc.
    is_suspicious BOOLEAN NOT NULL DEFAULT FALSE,
    risk_score DECIMAL(5, 2) NOT NULL,  -- 0-100
    
    -- Rules violated
    rule_violations JSONB DEFAULT '[]',  -- Array of rule codes that triggered
    
    -- Check context
    check_details JSONB,  -- {"location": "VN", "device_id": "xxx", ...}
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT chk_risk_score CHECK (risk_score >= 0 AND risk_score <= 100)
);

-- ============================================
-- VELOCITY TRACKING (Real-time transaction tracking)
-- ============================================
CREATE TABLE velocity_tracking (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,  -- NO FOREIGN KEY
    transaction_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    amount_cents BIGINT NOT NULL,
    recipient_id UUID,
    payment_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')  -- Auto-cleanup
);

-- ============================================
-- FRAUD RULE WHITELIST (Exceptions)
-- ============================================
CREATE TABLE fraud_rule_whitelist (
    id SERIAL PRIMARY KEY,
    rule_id INT NOT NULL,  -- References fraud_rules(id)
    user_id UUID NOT NULL,  -- NO FOREIGN KEY
    recipient_id UUID,  -- Optional: specific recipient exception
    expires_at TIMESTAMP WITH TIME ZONE,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100)
);

-- ============================================
-- FRAUD ALERTS (Notifications for high-risk activity)
-- ============================================
CREATE TABLE fraud_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fraud_check_id UUID NOT NULL,  -- Reference to fraud_checks
    alert_type VARCHAR(50) NOT NULL,  -- high_risk, pattern_detected, unusual_activity
    severity VARCHAR(50) NOT NULL,  -- low, medium, high, critical
    description TEXT,
    action_taken VARCHAR(100),  -- block, review_required, monitoring
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    acknowledged_by VARCHAR(100)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_fraud_rules_code ON fraud_rules(rule_code);
CREATE INDEX idx_fraud_rules_status ON fraud_rules(status);
CREATE INDEX idx_fraud_rules_priority ON fraud_rules(priority);

CREATE INDEX idx_fraud_checks_payment_id ON fraud_checks(payment_id);
CREATE INDEX idx_fraud_checks_user_id ON fraud_checks(user_id);
CREATE INDEX idx_fraud_checks_is_suspicious ON fraud_checks(is_suspicious);
CREATE INDEX idx_fraud_checks_created_at ON fraud_checks(created_at DESC);

CREATE INDEX idx_velocity_user_timestamp ON velocity_tracking(user_id, transaction_timestamp DESC);
CREATE INDEX idx_velocity_expires ON velocity_tracking(expires_at);

CREATE INDEX idx_whitelist_rule_user ON fraud_rule_whitelist(rule_id, user_id);
CREATE INDEX idx_whitelist_expires ON fraud_rule_whitelist(expires_at);

CREATE INDEX idx_alerts_fraud_check ON fraud_alerts(fraud_check_id);
CREATE INDEX idx_alerts_severity ON fraud_alerts(severity);
CREATE INDEX idx_alerts_created_at ON fraud_alerts(created_at DESC);

-- ============================================
-- MIGRATION HISTORY
-- ============================================
INSERT INTO migration_history (version, migration_name, status, completed_at, duration_ms)
VALUES (1, 'V001__fraud_core_schema.sql', 'completed', NOW(), 0);