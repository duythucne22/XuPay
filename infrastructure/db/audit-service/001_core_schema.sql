-- ============================================
-- AUDIT SERVICE DATABASE
-- Database: audit_db
-- Owner: audit-service ONLY
-- Stores immutable audit trail from ALL services
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
VALUES (1, 'audit-service', 'Audit log schema - isolated database', MD5('audit_v1'));

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
-- AUDIT EVENTS (Immutable audit trail)
-- ============================================
CREATE TABLE audit_events (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID NOT NULL UNIQUE,
    
    -- Event metadata
    event_type VARCHAR(100) NOT NULL,  -- payment.created, user.registered, fraud.blocked, etc.
    source_service VARCHAR(100) NOT NULL,  -- payment-service, user-service, fraud-service, etc.
    
    -- Actor (who made the action)
    actor_id VARCHAR(100),  -- User ID or Service ID
    actor_type VARCHAR(50),  -- user, system, admin, service
    
    -- Resource (what was affected)
    resource_type VARCHAR(100),  -- payment, user, fraud_check, etc.
    resource_id VARCHAR(100),  -- ID of the resource
    
    -- Action
    action_type VARCHAR(50) NOT NULL,  -- CREATE, READ, UPDATE, DELETE, BLOCK, APPROVE
    
    -- State changes
    old_state JSONB,
    new_state JSONB,
    
    -- Status
    status VARCHAR(50) NOT NULL,  -- success, failure, partial
    failure_reason TEXT,
    
    -- Tracing
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    trace_id VARCHAR(100),
    correlation_id VARCHAR(100),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    CONSTRAINT chk_action_type CHECK (action_type IN ('CREATE', 'READ', 'UPDATE', 'DELETE', 'BLOCK', 'APPROVE', 'REJECT', 'CANCEL'))
);

-- ============================================
-- COMPLIANCE REPORTS
-- ============================================
CREATE TABLE compliance_reports (
    id SERIAL PRIMARY KEY,
    report_type VARCHAR(100) NOT NULL,  -- transaction_report, user_report, fraud_report, aml_report
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_records INT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    report_data JSONB NOT NULL,
    generated_by VARCHAR(100)
);

-- ============================================
-- INDEXES (for querying audit trail)
-- ============================================
CREATE INDEX idx_audit_events_resource ON audit_events(resource_type, resource_id);
CREATE INDEX idx_audit_events_timestamp ON audit_events(timestamp DESC);
CREATE INDEX idx_audit_events_source_service ON audit_events(source_service);
CREATE INDEX idx_audit_events_trace_id ON audit_events(trace_id);
CREATE INDEX idx_audit_events_actor ON audit_events(actor_id);
CREATE INDEX idx_audit_events_event_type ON audit_events(event_type);

CREATE INDEX idx_compliance_reports_dates ON compliance_reports(start_date, end_date);
CREATE INDEX idx_compliance_reports_type ON compliance_reports(report_type);

-- ============================================
-- MIGRATION HISTORY
-- ============================================
INSERT INTO migration_history (version, migration_name, status, completed_at, duration_ms)
VALUES (1, 'V001__audit_core_schema.sql', 'completed', NOW(), 0);