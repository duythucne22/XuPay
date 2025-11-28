    -- Complete Schema for FinTech Payment & Fraud Detection System
-- Created: 2024
-- Services: Payment Service, Fraud Detection Service

-- ============================================================================
-- PART 1: USERS & CORE ENTITIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    kyc_verified BOOLEAN DEFAULT FALSE,
    account_status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- ============================================================================
-- PART 2: PAYMENT SERVICE TABLES
-- ============================================================================

-- Main payments table (matches postgre_payment.go Payment struct)
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(255) PRIMARY KEY,
    from_user_id VARCHAR(255) NOT NULL,
    to_user_id VARCHAR(255) NOT NULL,
    amount_cents BIGINT NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'VND',
    reference VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    settlement_time VARCHAR(50),
    fraud_score DOUBLE PRECISION DEFAULT 0.0,
    fraud_decision VARCHAR(50),
    fraud_checked_at TIMESTAMP,
    failure_reason TEXT,
    metadata JSONB,
    idempotency_key VARCHAR(255) UNIQUE,
    
    -- Constraints
    CONSTRAINT fk_payments_from_user FOREIGN KEY (from_user_id) REFERENCES users(id),
    CONSTRAINT fk_payments_to_user FOREIGN KEY (to_user_id) REFERENCES users(id),
    CONSTRAINT chk_amount_positive CHECK (amount_cents > 0)
);

-- Payment status enum: PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED, VALIDATING, REVERSED, REQUIRES_REVIEW
COMMENT ON COLUMN payments.status IS 'Payment status: PENDING | PROCESSING | COMPLETED | FAILED | CANCELLED | VALIDATING | REVERSED | REQUIRES_REVIEW';

-- Indexes for payment queries
CREATE INDEX IF NOT EXISTS idx_payments_from_user ON payments(from_user_id);
CREATE INDEX IF NOT EXISTS idx_payments_to_user ON payments(to_user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_idempotency_key ON payments(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_payments_fraud_decision ON payments(fraud_decision) WHERE fraud_decision IS NOT NULL;

-- Idempotency tracking table
CREATE TABLE IF NOT EXISTS idempotency_keys (
    key VARCHAR(255) PRIMARY KEY,
    payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_idempotency_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_idempotency_expires ON idempotency_keys(expires_at);

-- ============================================================================
-- PART 3: FRAUD DETECTION TABLES
-- ============================================================================

-- Fraud checks table (matches postgres_fraud.go FraudCheck struct)
CREATE TABLE IF NOT EXISTS fraud_checks (
    id VARCHAR(255) PRIMARY KEY,
    transaction_id VARCHAR(255) NOT NULL UNIQUE,
    from_user_id VARCHAR(255) NOT NULL,
    to_user_id VARCHAR(255) NOT NULL,
    amount_cents BIGINT NOT NULL,
    currency VARCHAR(10) NOT NULL,
    risk_score DOUBLE PRECISION NOT NULL,
    decision VARCHAR(50) NOT NULL,
    risk_factors TEXT[],
    rule_versions JSONB,
    ml_model_version VARCHAR(100),
    processing_time_ms BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by VARCHAR(255),
    review_notes TEXT,
    
    -- Constraints
    CONSTRAINT fk_fraud_from_user FOREIGN KEY (from_user_id) REFERENCES users(id),
    CONSTRAINT fk_fraud_to_user FOREIGN KEY (to_user_id) REFERENCES users(id),
    CONSTRAINT chk_risk_score_range CHECK (risk_score >= 0 AND risk_score <= 100)
);

-- Fraud decision enum: APPROVE, REVIEW, BLOCK
COMMENT ON COLUMN fraud_checks.decision IS 'Fraud decision: APPROVE | REVIEW | BLOCK';

-- Indexes for fraud analysis
CREATE INDEX IF NOT EXISTS idx_fraud_checks_transaction ON fraud_checks(transaction_id);
CREATE INDEX IF NOT EXISTS idx_fraud_checks_from_user ON fraud_checks(from_user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_checks_to_user ON fraud_checks(to_user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_checks_decision ON fraud_checks(decision);
CREATE INDEX IF NOT EXISTS idx_fraud_checks_created_at ON fraud_checks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fraud_checks_risk_score ON fraud_checks(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_fraud_checks_high_risk ON fraud_checks(risk_score) WHERE risk_score > 70;

-- Fraud rules table (matches postgres_fraud.go FraudRule struct)
CREATE TABLE IF NOT EXISTS fraud_rules (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    rule_type VARCHAR(50) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    threshold DOUBLE PRECISION DEFAULT 0.0,
    weight DOUBLE PRECISION DEFAULT 0.0,
    parameters JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rule types: THRESHOLD, VELOCITY, PATTERN, ML
COMMENT ON COLUMN fraud_rules.rule_type IS 'Rule type: THRESHOLD | VELOCITY | PATTERN | ML';

-- Indexes for rule management
CREATE INDEX IF NOT EXISTS idx_fraud_rules_enabled ON fraud_rules(enabled) WHERE enabled = TRUE;
CREATE INDEX IF NOT EXISTS idx_fraud_rules_priority ON fraud_rules(priority DESC);
CREATE INDEX IF NOT EXISTS idx_fraud_rules_type ON fraud_rules(rule_type);

-- User risk profiles table (matches postgres_fraud.go UserRiskProfile struct)
CREATE TABLE IF NOT EXISTS user_risk_profiles (
    user_id VARCHAR(255) PRIMARY KEY,
    total_transactions BIGINT DEFAULT 0,
    blocked_transactions BIGINT DEFAULT 0,
    reviewed_transactions BIGINT DEFAULT 0,
    average_risk_score DOUBLE PRECISION DEFAULT 0.0,
    last_transaction_at TIMESTAMP,
    account_created_at TIMESTAMP NOT NULL,
    kyc_verified BOOLEAN DEFAULT FALSE,
    risk_level VARCHAR(50) DEFAULT 'LOW',
    blacklist_status BOOLEAN DEFAULT FALSE,
    whitelist_recipients TEXT[],
    suspicious_patterns TEXT[],
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_user_risk_profile FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Risk level enum: LOW, MEDIUM, HIGH
COMMENT ON COLUMN user_risk_profiles.risk_level IS 'Risk level: LOW | MEDIUM | HIGH';

-- Indexes for risk analysis
CREATE INDEX IF NOT EXISTS idx_user_risk_level ON user_risk_profiles(risk_level);
CREATE INDEX IF NOT EXISTS idx_user_risk_blacklist ON user_risk_profiles(blacklist_status) WHERE blacklist_status = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_risk_updated ON user_risk_profiles(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_risk_score ON user_risk_profiles(average_risk_score DESC);

-- ============================================================================
-- PART 4: AUDIT & LOGGING TABLES
-- ============================================================================

-- Payment audit log
CREATE TABLE IF NOT EXISTS payment_audit_log (
    id SERIAL PRIMARY KEY,
    payment_id VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    actor VARCHAR(255),
    reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_audit_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_audit_payment_id ON payment_audit_log(payment_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON payment_audit_log(created_at DESC);

-- ============================================================================
-- PART 5: SEED DATA - DEFAULT FRAUD RULES
-- ============================================================================

-- Insert default fraud rules
INSERT INTO fraud_rules (id, name, description, rule_type, enabled, priority, threshold, weight, parameters) VALUES
    ('rule_high_amount', 'High Amount Transaction', 'Flag transactions above threshold', 'THRESHOLD', TRUE, 100, 10000000, 30.0, '{"currency": "VND", "amount_threshold": 10000000}'::jsonb),
    ('rule_new_account', 'New Account Risk', 'Higher risk for new accounts', 'PATTERN', TRUE, 90, 0.0, 20.0, '{"days_threshold": 30}'::jsonb),
    ('rule_velocity', 'Transaction Velocity Check', 'Check transaction frequency', 'VELOCITY', TRUE, 85, 5.0, 25.0, '{"time_window_minutes": 60, "max_transactions": 5}'::jsonb),
    ('rule_unusual_time', 'Unusual Time Pattern', 'Transactions at unusual hours', 'PATTERN', TRUE, 70, 0.0, 15.0, '{"start_hour": 2, "end_hour": 6}'::jsonb),
    ('rule_cross_border', 'Cross Border Check', 'Check for cross-border patterns', 'PATTERN', TRUE, 75, 0.0, 20.0, '{"enabled": true}'::jsonb),
    ('rule_recipient_risk', 'Recipient Risk Analysis', 'Analyze recipient risk profile', 'PATTERN', TRUE, 80, 0.0, 18.0, '{"min_risk_level": "MEDIUM"}'::jsonb),
    ('rule_ml_predictor', 'ML Model Prediction', 'Machine learning risk score', 'ML', FALSE, 95, 0.7, 35.0, '{"model_version": "v1.0", "confidence_threshold": 0.7}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- PART 6: UTILITY FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fraud_rules_updated_at BEFORE UPDATE ON fraud_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_risk_profiles_updated_at BEFORE UPDATE ON user_risk_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PART 7: STATISTICS & MATERIALIZED VIEWS (OPTIONAL)
-- ============================================================================

-- Materialized view for fraud statistics (refresh periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS fraud_statistics AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as total_checks,
    COUNT(*) FILTER (WHERE decision = 'APPROVE') as approved,
    COUNT(*) FILTER (WHERE decision = 'REVIEW') as reviewed,
    COUNT(*) FILTER (WHERE decision = 'BLOCK') as blocked,
    AVG(risk_score) as avg_risk_score,
    MAX(risk_score) as max_risk_score,
    AVG(processing_time_ms) as avg_processing_time_ms
FROM fraud_checks
GROUP BY DATE_TRUNC('day', created_at);

CREATE INDEX IF NOT EXISTS idx_fraud_stats_date ON fraud_statistics(date DESC);

-- ============================================================================
-- PART 8: SAMPLE TEST DATA (OPTIONAL - COMMENT OUT IN PRODUCTION)
-- ============================================================================

-- Insert sample users for testing
INSERT INTO users (id, email, password_hash, full_name, phone, kyc_verified, account_status, created_at) VALUES
    ('user_001', 'alice@example.com', '$2a$10$dummyhash1', 'Alice Nguyen', '+84901234567', TRUE, 'ACTIVE', NOW() - INTERVAL '180 days'),
    ('user_002', 'bob@example.com', '$2a$10$dummyhash2', 'Bob Tran', '+84901234568', TRUE, 'ACTIVE', NOW() - INTERVAL '90 days'),
    ('user_003', 'charlie@example.com', '$2a$10$dummyhash3', 'Charlie Le', '+84901234569', FALSE, 'ACTIVE', NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- Insert sample risk profiles
INSERT INTO user_risk_profiles (user_id, total_transactions, blocked_transactions, reviewed_transactions, average_risk_score, last_transaction_at, account_created_at, kyc_verified, risk_level, blacklist_status) VALUES
    ('user_001', 45, 0, 2, 15.5, NOW() - INTERVAL '2 days', NOW() - INTERVAL '180 days', TRUE, 'LOW', FALSE),
    ('user_002', 12, 1, 3, 35.2, NOW() - INTERVAL '5 days', NOW() - INTERVAL '90 days', TRUE, 'MEDIUM', FALSE),
    ('user_003', 1, 0, 0, 25.0, NOW() - INTERVAL '1 day', NOW() - INTERVAL '5 days', FALSE, 'MEDIUM', FALSE)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Grant permissions (adjust for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO payment_service_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fraud_service_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO payment_service_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fraud_service_user;
