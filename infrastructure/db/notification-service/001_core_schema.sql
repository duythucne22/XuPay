-- ============================================
-- NOTIFICATION SERVICE DATABASE
-- Database: notification_db
-- Owner: notification-service ONLY
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
VALUES (1, 'notification-service', 'Notification schema - isolated database', MD5('notification_v1'));

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
-- NOTIFICATION QUEUE
-- ============================================
CREATE TABLE notification_queue (
    id SERIAL PRIMARY KEY,
    event_id UUID NOT NULL UNIQUE,
    
    -- Event source
    event_type VARCHAR(100) NOT NULL,  -- payment.created, fraud.blocked, user.registered
    source_service VARCHAR(100) NOT NULL,
    
    -- Recipient
    recipient_user_id UUID,  -- NO FOREIGN KEY
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    
    -- Notification details
    notification_type VARCHAR(50) NOT NULL,  -- email, sms, push, webhook
    template_id VARCHAR(100),
    template_data JSONB,
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- pending, sent, failed, bounced, undeliverable
    send_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    
    -- Retry logic
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    next_retry_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT chk_notification_status CHECK (status IN ('pending', 'sent', 'failed', 'bounced', 'undeliverable'))
);

-- ============================================
-- NOTIFICATION LOG (Historical record)
-- ============================================
CREATE TABLE notification_log (
    id BIGSERIAL PRIMARY KEY,
    notification_id INT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    change_reason TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER PREFERENCES
-- ============================================
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,  -- NO FOREIGN KEY
    
    -- Channel preferences
    email_notifications_enabled BOOLEAN DEFAULT TRUE,
    sms_notifications_enabled BOOLEAN DEFAULT FALSE,
    push_notifications_enabled BOOLEAN DEFAULT TRUE,
    webhook_enabled BOOLEAN DEFAULT FALSE,
    
    -- Frequency preferences
    notification_frequency VARCHAR(50) DEFAULT 'real-time',  -- real-time, daily_digest, weekly_digest
    
    -- Do Not Disturb
    dnd_enabled BOOLEAN DEFAULT FALSE,
    dnd_start_time TIME,
    dnd_end_time TIME,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_notification_queue_status ON notification_queue(status);
CREATE INDEX idx_notification_queue_created_at ON notification_queue(created_at DESC);
CREATE INDEX idx_notification_queue_send_at ON notification_queue(send_at) WHERE status = 'pending';
CREATE INDEX idx_notification_queue_retry ON notification_queue(next_retry_at) WHERE status = 'failed';

CREATE INDEX idx_notification_log_notification ON notification_log(notification_id);
CREATE INDEX idx_notification_log_timestamp ON notification_log(timestamp DESC);

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- ============================================
-- MIGRATION HISTORY
-- ============================================
INSERT INTO migration_history (version, migration_name, status, completed_at, duration_ms)
VALUES (1, 'V001__notification_core_schema.sql', 'completed', NOW(), 0);