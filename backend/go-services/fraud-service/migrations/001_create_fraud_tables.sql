-- Fraud Service Database Schema
-- Migration: 001_create_fraud_tables.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Fraud checks table
CREATE TABLE fraud_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL,
    merchant_id UUID NOT NULL,
    customer_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL,
    decision VARCHAR(50) NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    risk_score DECIMAL(5,2) NOT NULL,
    amount BIGINT NOT NULL,
    currency VARCHAR(3) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    country VARCHAR(2),
    device_fingerprint VARCHAR(255),
    user_agent TEXT,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    billing_address JSONB DEFAULT '{}',
    shipping_address JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    reasons JSONB DEFAULT '[]',
    processed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_fraud_status CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
    CONSTRAINT chk_fraud_decision CHECK (decision IN ('APPROVE', 'REVIEW', 'DECLINE', 'BLOCK')),
    CONSTRAINT chk_risk_level CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    CONSTRAINT chk_risk_score_range CHECK (risk_score BETWEEN 0 AND 100)
);

CREATE INDEX idx_fraud_checks_payment_id ON fraud_checks(payment_id);
CREATE INDEX idx_fraud_checks_merchant_id ON fraud_checks(merchant_id);
CREATE INDEX idx_fraud_checks_customer_id ON fraud_checks(customer_id);
CREATE INDEX idx_fraud_checks_status ON fraud_checks(status);
CREATE INDEX idx_fraud_checks_decision ON fraud_checks(decision);
CREATE INDEX idx_fraud_checks_risk_level ON fraud_checks(risk_level);
CREATE INDEX idx_fraud_checks_created_at ON fraud_checks(created_at DESC);
CREATE INDEX idx_fraud_checks_email ON fraud_checks(email);
CREATE INDEX idx_fraud_checks_ip_address ON fraud_checks(ip_address);

-- Fraud rules table
CREATE TABLE fraud_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    rule_type VARCHAR(100) NOT NULL,
    conditions JSONB NOT NULL,
    action VARCHAR(50) NOT NULL,
    weight DECIMAL(5,2) NOT NULL DEFAULT 1.0,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_rule_action CHECK (action IN ('APPROVE', 'REVIEW', 'DECLINE', 'BLOCK'))
);

CREATE INDEX idx_fraud_rules_rule_type ON fraud_rules(rule_type);
CREATE INDEX idx_fraud_rules_is_active ON fraud_rules(is_active);
CREATE INDEX idx_fraud_rules_priority ON fraud_rules(priority);

-- Fraud rule executions table
CREATE TABLE fraud_rule_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fraud_check_id UUID NOT NULL REFERENCES fraud_checks(id) ON DELETE CASCADE,
    rule_id UUID NOT NULL REFERENCES fraud_rules(id) ON DELETE CASCADE,
    rule_name VARCHAR(255) NOT NULL,
    matched BOOLEAN NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    reason TEXT,
    details JSONB DEFAULT '{}',
    executed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fraud_rule_executions_fraud_check_id ON fraud_rule_executions(fraud_check_id);
CREATE INDEX idx_fraud_rule_executions_rule_id ON fraud_rule_executions(rule_id);
CREATE INDEX idx_fraud_rule_executions_matched ON fraud_rule_executions(matched);
CREATE INDEX idx_fraud_rule_executions_executed_at ON fraud_rule_executions(executed_at DESC);

-- Fraud patterns table (blacklist/whitelist)
CREATE TABLE fraud_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pattern_type VARCHAR(50) NOT NULL,
    pattern_value VARCHAR(255) NOT NULL,
    reason TEXT,
    severity VARCHAR(50) NOT NULL,
    is_blacklisted BOOLEAN DEFAULT false,
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_pattern_severity CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    UNIQUE(pattern_type, pattern_value)
);

CREATE INDEX idx_fraud_patterns_type ON fraud_patterns(pattern_type);
CREATE INDEX idx_fraud_patterns_value ON fraud_patterns(pattern_value);
CREATE INDEX idx_fraud_patterns_is_blacklisted ON fraud_patterns(is_blacklisted);
CREATE INDEX idx_fraud_patterns_expires_at ON fraud_patterns(expires_at);

-- Velocity checks table
CREATE TABLE velocity_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_value VARCHAR(255) NOT NULL,
    time_window VARCHAR(50) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    total_amount BIGINT NOT NULL DEFAULT 0,
    threshold INTEGER NOT NULL,
    exceeded BOOLEAN DEFAULT false,
    window_start TIMESTAMP NOT NULL,
    window_end TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_velocity_checks_entity ON velocity_checks(entity_type, entity_value);
CREATE INDEX idx_velocity_checks_window ON velocity_checks(window_start, window_end);
CREATE INDEX idx_velocity_checks_exceeded ON velocity_checks(exceeded);

-- Geolocation checks table
CREATE TABLE geolocation_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fraud_check_id UUID NOT NULL REFERENCES fraud_checks(id) ON DELETE CASCADE,
    ip_address VARCHAR(45) NOT NULL,
    country VARCHAR(2),
    city VARCHAR(255),
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    is_proxy BOOLEAN DEFAULT false,
    is_vpn BOOLEAN DEFAULT false,
    is_tor BOOLEAN DEFAULT false,
    is_high_risk_country BOOLEAN DEFAULT false,
    risk_score DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_geolocation_checks_fraud_check_id ON geolocation_checks(fraud_check_id);
CREATE INDEX idx_geolocation_checks_ip_address ON geolocation_checks(ip_address);
CREATE INDEX idx_geolocation_checks_country ON geolocation_checks(country);

-- Device fingerprints table
CREATE TABLE device_fingerprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fingerprint_hash VARCHAR(255) NOT NULL UNIQUE,
    user_agent TEXT,
    screen_resolution VARCHAR(50),
    timezone VARCHAR(100),
    language VARCHAR(10),
    plugins JSONB DEFAULT '[]',
    first_seen TIMESTAMP NOT NULL DEFAULT NOW(),
    last_seen TIMESTAMP NOT NULL DEFAULT NOW(),
    transaction_count INTEGER DEFAULT 0,
    fraud_count INTEGER DEFAULT 0,
    is_blacklisted BOOLEAN DEFAULT false
);

CREATE INDEX idx_device_fingerprints_hash ON device_fingerprints(fingerprint_hash);
CREATE INDEX idx_device_fingerprints_is_blacklisted ON device_fingerprints(is_blacklisted);
CREATE INDEX idx_device_fingerprints_fraud_count ON device_fingerprints(fraud_count);

-- Fraud alerts table
CREATE TABLE fraud_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fraud_check_id UUID NOT NULL REFERENCES fraud_checks(id) ON DELETE CASCADE,
    payment_id UUID NOT NULL,
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID,
    resolved_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_alert_severity CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

CREATE INDEX idx_fraud_alerts_fraud_check_id ON fraud_alerts(fraud_check_id);
CREATE INDEX idx_fraud_alerts_payment_id ON fraud_alerts(payment_id);
CREATE INDEX idx_fraud_alerts_alert_type ON fraud_alerts(alert_type);
CREATE INDEX idx_fraud_alerts_severity ON fraud_alerts(severity);
CREATE INDEX idx_fraud_alerts_is_resolved ON fraud_alerts(is_resolved);
CREATE INDEX idx_fraud_alerts_created_at ON fraud_alerts(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_fraud_checks_updated_at BEFORE UPDATE ON fraud_checks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fraud_rules_updated_at BEFORE UPDATE ON fraud_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fraud_patterns_updated_at BEFORE UPDATE ON fraud_patterns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fraud_alerts_updated_at BEFORE UPDATE ON fraud_alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
