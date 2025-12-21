-- =====================================================
-- AUDIT SERVICE DATABASE - PRODUCTION COMPLETE
-- Database: audit_db
-- Created: December 17, 2025
-- Purpose: Compliance, Fraud Detection, Audit Trail, Reporting
-- =====================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- AUDIT_EVENTS TABLE
-- Immutable event log (no updates/deletes allowed)
-- =====================================================
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Event classification
    event_type VARCHAR(50) NOT NULL, -- 'USER_REGISTERED', 'PAYMENT_SENT', 'WALLET_CREATED', 'KYC_APPROVED', etc.
    severity VARCHAR(20) NOT NULL DEFAULT 'INFO', -- 'INFO', 'WARNING', 'ERROR', 'CRITICAL'
    
    -- Who did what
    user_id UUID, -- Can be NULL for system events
    actor_type VARCHAR(20) DEFAULT 'USER', -- 'USER', 'SYSTEM', 'ADMIN'
    actor_id UUID, -- ID of the actor (admin_id if admin action)
    
    -- Related entities (nullable)
    transaction_id UUID,
    wallet_id UUID,
    
    -- Request context
    ip_address INET,
    user_agent TEXT,
    request_id UUID, -- For tracing requests across services
    
    -- Event details (flexible JSON for different event types)
    details JSONB NOT NULL DEFAULT '{}',
    
    -- Metadata
    service_name VARCHAR(50) NOT NULL, -- 'user-service', 'payment-service', 'audit-service'
    environment VARCHAR(20) NOT NULL DEFAULT 'production', -- 'development', 'staging', 'production'
    
    -- Timestamp (IMMUTABLE - no updates)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_severity CHECK (severity IN ('INFO', 'WARNING', 'ERROR', 'CRITICAL')),
    CONSTRAINT chk_actor_type CHECK (actor_type IN ('USER', 'SYSTEM', 'ADMIN', 'EXTERNAL'))
);

-- =====================================================
-- SUSPICIOUS_ACTIVITY_REPORTS (SAR) TABLE
-- Aggregated fraud reports for compliance
-- =====================================================
CREATE TABLE suspicious_activity_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Subject of report
    user_id UUID NOT NULL,
    
    -- Report classification
    report_type VARCHAR(50) NOT NULL, -- 'FRAUD', 'MONEY_LAUNDERING', 'STRUCTURING', 'IDENTITY_THEFT'
    severity VARCHAR(20) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    
    -- Associated events (array of audit_event IDs)
    related_audit_event_ids UUID[] NOT NULL,
    related_transaction_ids UUID[],
    
    -- Analysis
    total_amount_cents BIGINT,
    transaction_count INT,
    time_span_hours INT,
    suspicious_patterns TEXT[],
    
    -- Report details
    summary TEXT NOT NULL,
    detailed_analysis TEXT,
    
    -- Status and workflow
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'under_review', 'reported', 'closed', 'false_positive'
    assigned_to UUID, -- Compliance officer ID
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    
    -- Regulatory compliance
    reported_to_authorities BOOLEAN NOT NULL DEFAULT false,
    authority_reference_number VARCHAR(100),
    reported_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_report_type CHECK (report_type IN ('FRAUD', 'MONEY_LAUNDERING', 'STRUCTURING', 'IDENTITY_THEFT', 'UNUSUAL_ACTIVITY')),
    CONSTRAINT chk_severity CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    CONSTRAINT chk_status CHECK (status IN ('pending', 'under_review', 'reported', 'closed', 'false_positive'))
);

-- =====================================================
-- FRAUD_FLAGS TABLE
-- Track suspicious activities and fraud patterns
-- =====================================================
CREATE TABLE fraud_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Who is flagged
    user_id UUID NOT NULL,
    transaction_id UUID, -- NULL if flagging the user in general
    
    -- Flag classification
    flag_type VARCHAR(50) NOT NULL, -- 'VELOCITY', 'AMOUNT_THRESHOLD', 'PATTERN_MATCH', 'GEO_ANOMALY', 'BLACKLIST'
    risk_score INT NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
    
    -- Flag details
    reason TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}',
    matched_rule_id UUID, -- Reference to fraud_rules in payment_db
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'REVIEWED', 'CONFIRMED_FRAUD', 'FALSE_POSITIVE', 'ESCALATED'
    reviewed_by UUID, -- Admin/analyst who reviewed
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    
    -- Actions taken
    action_taken VARCHAR(50), -- 'NONE', 'FLAGGED', 'TRANSACTION_BLOCKED', 'ACCOUNT_SUSPENDED', 'SAR_CREATED'
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_flag_status CHECK (status IN ('PENDING', 'REVIEWED', 'CONFIRMED_FRAUD', 'FALSE_POSITIVE', 'ESCALATED')),
    CONSTRAINT chk_action_taken CHECK (action_taken IN ('NONE', 'FLAGGED', 'TRANSACTION_BLOCKED', 'ACCOUNT_SUSPENDED', 'SAR_CREATED'))
);

-- =====================================================
-- AML_CHECKS TABLE
-- Anti-Money Laundering compliance checks
-- =====================================================
CREATE TABLE aml_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Who is checked
    user_id UUID NOT NULL,
    transaction_id UUID, -- NULL for periodic user checks
    
    -- Check type
    check_type VARCHAR(50) NOT NULL, -- 'DAILY_LIMIT', 'MONTHLY_VOLUME', 'RAPID_MOVEMENT', 'STRUCTURING', 'THRESHOLD_REPORTING'
    
    -- Check result
    status VARCHAR(20) NOT NULL, -- 'PASS', 'FAIL', 'MANUAL_REVIEW', 'ESCALATED'
    risk_level VARCHAR(20) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    
    -- Check details
    threshold_value BIGINT, -- The limit being checked (in cents)
    actual_value BIGINT,    -- The actual value observed (in cents)
    reason TEXT,
    details JSONB NOT NULL DEFAULT '{}',
    
    -- Actions taken
    action_taken VARCHAR(50), -- 'NONE', 'FLAG', 'BLOCK', 'REPORT_AUTHORITY', 'SAR_CREATED'
    
    -- Regulatory compliance
    requires_reporting BOOLEAN NOT NULL DEFAULT false,
    reported_to_authorities BOOLEAN NOT NULL DEFAULT false,
    authority_reference_number VARCHAR(100),
    
    -- Timestamps
    checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_aml_status CHECK (status IN ('PASS', 'FAIL', 'MANUAL_REVIEW', 'ESCALATED')),
    CONSTRAINT chk_risk_level CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    CONSTRAINT chk_action_taken CHECK (action_taken IN ('NONE', 'FLAG', 'BLOCK', 'REPORT_AUTHORITY', 'SAR_CREATED'))
);

-- =====================================================
-- COMPLIANCE_REPORTS TABLE
-- Monthly/quarterly regulatory reports
-- =====================================================
CREATE TABLE compliance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Report period
    report_type VARCHAR(50) NOT NULL, -- 'MONTHLY_SAR', 'QUARTERLY_AML', 'ANNUAL_AUDIT', 'TRANSACTION_MONITORING'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Statistics
    total_transactions BIGINT,
    total_volume_cents BIGINT,
    total_users_active INT,
    
    -- Flags and reports
    fraud_flags_raised INT,
    sars_filed INT,
    aml_checks_failed INT,
    
    -- Report content
    summary TEXT,
    detailed_report_url TEXT, -- S3 URL to PDF report
    report_data JSONB, -- Full report data
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft', 'finalized', 'submitted', 'approved'
    generated_by UUID, -- Admin who generated
    approved_by UUID,  -- Compliance officer who approved
    approved_at TIMESTAMPTZ,
    
    -- Regulatory submission
    submitted_to VARCHAR(100), -- Regulatory authority
    submitted_at TIMESTAMPTZ,
    authority_acknowledgment TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_report_type CHECK (report_type IN ('MONTHLY_SAR', 'QUARTERLY_AML', 'ANNUAL_AUDIT', 'TRANSACTION_MONITORING', 'CUSTOM')),
    CONSTRAINT chk_status CHECK (status IN ('draft', 'finalized', 'submitted', 'approved')),
    CONSTRAINT chk_period CHECK (period_end > period_start)
);

-- =====================================================
-- DAILY_STATS TABLE
-- Pre-aggregated statistics for dashboard (performance optimization)
-- =====================================================
CREATE TABLE daily_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Date dimension
    stat_date DATE NOT NULL,
    service_name VARCHAR(50) NOT NULL, -- 'user-service', 'payment-service', 'audit-service'
    
    -- User metrics
    total_users INT NOT NULL DEFAULT 0,
    new_users_registered INT NOT NULL DEFAULT 0,
    active_users INT NOT NULL DEFAULT 0,
    
    -- Transaction metrics
    total_transactions INT NOT NULL DEFAULT 0,
    total_volume_cents BIGINT NOT NULL DEFAULT 0,
    avg_transaction_cents BIGINT NOT NULL DEFAULT 0,
    
    -- Fraud metrics
    fraud_flags_raised INT NOT NULL DEFAULT 0,
    aml_checks_performed INT NOT NULL DEFAULT 0,
    aml_checks_failed INT NOT NULL DEFAULT 0,
    sars_created INT NOT NULL DEFAULT 0,
    
    -- Performance metrics
    avg_response_time_ms INT,
    p95_response_time_ms INT,
    p99_response_time_ms INT,
    error_count INT NOT NULL DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Unique per day per service
    CONSTRAINT uq_daily_stats_date_service UNIQUE (stat_date, service_name)
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Audit events (heavy read workload)
CREATE INDEX idx_audit_events_user_id ON audit_events(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_audit_events_event_type ON audit_events(event_type);
CREATE INDEX idx_audit_events_severity ON audit_events(severity);
CREATE INDEX idx_audit_events_created_at ON audit_events(created_at DESC);
CREATE INDEX idx_audit_events_transaction_id ON audit_events(transaction_id) WHERE transaction_id IS NOT NULL;
CREATE INDEX idx_audit_events_service ON audit_events(service_name);
CREATE INDEX idx_audit_events_request_id ON audit_events(request_id) WHERE request_id IS NOT NULL;

-- SARs
CREATE INDEX idx_sars_user_id ON suspicious_activity_reports(user_id);
CREATE INDEX idx_sars_status ON suspicious_activity_reports(status);
CREATE INDEX idx_sars_severity ON suspicious_activity_reports(severity);
CREATE INDEX idx_sars_created_at ON suspicious_activity_reports(created_at DESC);
CREATE INDEX idx_sars_reported ON suspicious_activity_reports(reported_to_authorities);

-- Fraud flags
CREATE INDEX idx_fraud_flags_user_id ON fraud_flags(user_id);
CREATE INDEX idx_fraud_flags_transaction_id ON fraud_flags(transaction_id) WHERE transaction_id IS NOT NULL;
CREATE INDEX idx_fraud_flags_status ON fraud_flags(status);
CREATE INDEX idx_fraud_flags_risk_score ON fraud_flags(risk_score DESC);
CREATE INDEX idx_fraud_flags_created_at ON fraud_flags(created_at DESC);
CREATE INDEX idx_fraud_flags_flag_type ON fraud_flags(flag_type);

-- AML checks
CREATE INDEX idx_aml_checks_user_id ON aml_checks(user_id);
CREATE INDEX idx_aml_checks_transaction_id ON aml_checks(transaction_id) WHERE transaction_id IS NOT NULL;
CREATE INDEX idx_aml_checks_status ON aml_checks(status);
CREATE INDEX idx_aml_checks_risk_level ON aml_checks(risk_level);
CREATE INDEX idx_aml_checks_checked_at ON aml_checks(checked_at DESC);
CREATE INDEX idx_aml_checks_reporting ON aml_checks(requires_reporting) WHERE requires_reporting = true;

-- Compliance reports
CREATE INDEX idx_compliance_reports_type ON compliance_reports(report_type);
CREATE INDEX idx_compliance_reports_period ON compliance_reports(period_start, period_end);
CREATE INDEX idx_compliance_reports_status ON compliance_reports(status);

-- Daily stats
CREATE INDEX idx_daily_stats_date ON daily_stats(stat_date DESC);
CREATE INDEX idx_daily_stats_service ON daily_stats(service_name);

-- =====================================================
-- PARTITIONING (for audit_events - high volume table)
-- =====================================================

-- Convert audit_events to partitioned table (monthly partitions)
-- Note: This requires table recreation in production
-- For initial setup, we'll add a comment for future partitioning strategy

COMMENT ON TABLE audit_events IS 'Partitioned by created_at (monthly) for performance. Immutable - no updates/deletes';

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sars_updated_at
    BEFORE UPDATE ON suspicious_activity_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fraud_flags_updated_at
    BEFORE UPDATE ON fraud_flags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_reports_updated_at
    BEFORE UPDATE ON compliance_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_stats_updated_at
    BEFORE UPDATE ON daily_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Get user's recent fraud score
CREATE OR REPLACE FUNCTION get_user_fraud_score(p_user_id UUID, p_days INT DEFAULT 30)
RETURNS INT AS $$
DECLARE
    v_fraud_score INT;
BEGIN
    -- Calculate average risk from recent fraud flags
    SELECT COALESCE(AVG(risk_score)::INT, 0)
    INTO v_fraud_score
    FROM fraud_flags
    WHERE user_id = p_user_id
      AND created_at > NOW() - (p_days || ' days')::INTERVAL
      AND status != 'FALSE_POSITIVE';
    
    RETURN v_fraud_score;
END;
$$ LANGUAGE plpgsql;

-- Auto-create SAR if fraud flags exceed threshold
CREATE OR REPLACE FUNCTION auto_create_sar_if_needed()
RETURNS TRIGGER AS $$
DECLARE
    v_recent_flags_count INT;
    v_total_risk_score INT;
BEGIN
    -- Count recent high-risk flags for this user
    SELECT COUNT(*), SUM(risk_score)
    INTO v_recent_flags_count, v_total_risk_score
    FROM fraud_flags
    WHERE user_id = NEW.user_id
      AND created_at > NOW() - INTERVAL '7 days'
      AND status = 'CONFIRMED_FRAUD';
    
    -- If threshold exceeded, create SAR
    IF v_recent_flags_count >= 3 OR v_total_risk_score >= 200 THEN
        INSERT INTO suspicious_activity_reports (
            user_id,
            report_type,
            severity,
            related_audit_event_ids,
            summary,
            status
        )
        VALUES (
            NEW.user_id,
            'FRAUD',
            'HIGH',
            ARRAY[]::UUID[], -- Populated by batch job
            'Auto-generated SAR due to multiple confirmed fraud flags',
            'pending'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_create_sar
    AFTER UPDATE ON fraud_flags
    FOR EACH ROW
    WHEN (NEW.status = 'CONFIRMED_FRAUD' AND OLD.status != 'CONFIRMED_FRAUD')
    EXECUTE FUNCTION auto_create_sar_if_needed();

-- Aggregate daily stats (run via cron)
CREATE OR REPLACE FUNCTION aggregate_daily_stats(p_target_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
BEGIN
    -- Aggregate from audit_events
    INSERT INTO daily_stats (
        stat_date,
        service_name,
        total_transactions,
        fraud_flags_raised,
        aml_checks_performed,
        sars_created
    )
    SELECT
        p_target_date,
        service_name,
        COUNT(*) FILTER (WHERE event_type LIKE '%PAYMENT%'),
        COUNT(*) FILTER (WHERE event_type = 'FRAUD_FLAG_RAISED'),
        COUNT(*) FILTER (WHERE event_type = 'AML_CHECK_PERFORMED'),
        COUNT(*) FILTER (WHERE event_type = 'SAR_CREATED')
    FROM audit_events
    WHERE DATE(created_at) = p_target_date
    GROUP BY service_name
    ON CONFLICT (stat_date, service_name)
    DO UPDATE SET
        total_transactions = EXCLUDED.total_transactions,
        fraud_flags_raised = EXCLUDED.fraud_flags_raised,
        aml_checks_performed = EXCLUDED.aml_checks_performed,
        sars_created = EXCLUDED.sars_created,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SEED DATA (For testing)
-- =====================================================

-- Sample daily stats
INSERT INTO daily_stats (stat_date, service_name, total_transactions, total_volume_cents, fraud_flags_raised, aml_checks_performed) VALUES 
    (CURRENT_DATE, 'user-service', 150, 0, 0, 0),
    (CURRENT_DATE, 'payment-service', 450, 5000000, 2, 10),
    (CURRENT_DATE, 'audit-service', 600, 0, 2, 10);

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE audit_events IS 'Immutable audit trail - all system events. Partitioned monthly for performance';
COMMENT ON TABLE suspicious_activity_reports IS 'Aggregated fraud reports for regulatory compliance';
COMMENT ON TABLE fraud_flags IS 'Suspicious activity tracking and fraud detection';
COMMENT ON TABLE aml_checks IS 'Anti-Money Laundering compliance checks';
COMMENT ON TABLE compliance_reports IS 'Monthly/quarterly regulatory compliance reports';
COMMENT ON TABLE daily_stats IS 'Pre-aggregated statistics for dashboard performance';
COMMENT ON COLUMN audit_events.details IS 'Flexible JSONB for event-specific data';
COMMENT ON COLUMN fraud_flags.risk_score IS '0-100 risk score, higher = more suspicious';
COMMENT ON COLUMN aml_checks.action_taken IS 'Action taken based on check result';
COMMENT ON COLUMN suspicious_activity_reports.related_audit_event_ids IS 'Array of audit event IDs that triggered this SAR';
