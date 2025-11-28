-- ============================================
-- PARTNER SERVICE DATABASE
-- Database: partner_db
-- Owner: partner-service ONLY
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
VALUES (1, 'partner-service', 'Partner schema - isolated database', MD5('partner_v1'));

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
-- PARTNERS (API consumers/integrations)
-- ============================================
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identity
    partner_name VARCHAR(255) NOT NULL,
    partner_type VARCHAR(100) NOT NULL,  -- bank, payment_processor, fintech, third_party
    
    -- API credentials (hashed for security)
    api_key_hash VARCHAR(255) NOT NULL UNIQUE,
    api_key_salt VARCHAR(255) NOT NULL,
    
    -- Contact
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    contact_person VARCHAR(255),
    
    -- Integration
    webhook_url VARCHAR(500),
    webhook_secret VARCHAR(255),
    webhook_events JSONB DEFAULT '["payment.created", "payment.completed"]',
    
    -- Rate limiting
    rate_limit_requests_per_minute INT DEFAULT 1000,
    rate_limit_requests_per_day INT DEFAULT 1000000,
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'active',  -- active, suspended, inactive, onboarding
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    suspended_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT chk_partner_status CHECK (status IN ('active', 'suspended', 'inactive', 'onboarding')),
    CONSTRAINT chk_partner_type CHECK (partner_type IN ('bank', 'payment_processor', 'fintech', 'third_party'))
);

-- ============================================
-- API KEY ROTATION HISTORY
-- ============================================
CREATE TABLE api_key_history (
    id SERIAL PRIMARY KEY,
    partner_id UUID NOT NULL,  -- NO FOREIGN KEY
    old_key_hash VARCHAR(255),
    new_key_hash VARCHAR(255),
    reason VARCHAR(100),  -- rotation, revocation, refresh
    rotated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    rotated_by VARCHAR(100)
);

-- ============================================
-- PARTNER TRANSACTIONS (API usage tracking)
-- ============================================
CREATE TABLE partner_transactions (
    id BIGSERIAL PRIMARY KEY,
    partner_id UUID NOT NULL,  -- NO FOREIGN KEY
    
    -- Transaction reference
    payment_id UUID,  -- NO FOREIGN KEY
    transaction_type VARCHAR(100),  -- payment_creation, payment_status_check, reversal_request
    
    -- Request/Response
    request_method VARCHAR(10),  -- GET, POST, PUT
    request_endpoint VARCHAR(500),
    request_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_status INT,
    response_time_ms INT,
    
    -- Usage
    request_size_bytes INT,
    response_size_bytes INT,
    
    -- Tracing
    trace_id VARCHAR(100),
    ip_address VARCHAR(45)
);

-- ============================================
-- PARTNER WEBHOOKS (Outgoing events)
-- ============================================
CREATE TABLE partner_webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID NOT NULL,  -- NO FOREIGN KEY
    
    -- Event
    event_type VARCHAR(100) NOT NULL,
    event_id UUID NOT NULL,
    event_data JSONB NOT NULL,
    
    -- Delivery
    delivery_status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- pending, sent, failed, max_retries_exceeded
    delivery_attempts INT DEFAULT 0,
    last_delivery_attempt TIMESTAMP WITH TIME ZONE,
    last_delivery_error TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_retry_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT chk_delivery_status CHECK (delivery_status IN ('pending', 'sent', 'failed', 'max_retries_exceeded'))
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_partners_api_key ON partners(api_key_hash);
CREATE INDEX idx_partners_status ON partners(status);
CREATE INDEX idx_partners_created_at ON partners(created_at DESC);

CREATE INDEX idx_api_key_history_partner_id ON api_key_history(partner_id);

CREATE INDEX idx_partner_transactions_partner_id ON partner_transactions(partner_id);
CREATE INDEX idx_partner_transactions_timestamp ON partner_transactions(request_timestamp DESC);
CREATE INDEX idx_partner_transactions_payment_id ON partner_transactions(payment_id);

CREATE INDEX idx_partner_webhooks_partner_id ON partner_webhooks(partner_id);
CREATE INDEX idx_partner_webhooks_status ON partner_webhooks(delivery_status);
CREATE INDEX idx_partner_webhooks_retry ON partner_webhooks(next_retry_at) WHERE delivery_status = 'pending';

-- ============================================
-- MIGRATION HISTORY
-- ============================================
INSERT INTO migration_history (version, migration_name, status, completed_at, duration_ms)
VALUES (1, 'V001__partner_core_schema.sql', 'completed', NOW(), 0);