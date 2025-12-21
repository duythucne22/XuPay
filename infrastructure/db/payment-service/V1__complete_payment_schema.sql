-- =====================================================
-- PAYMENT SERVICE DATABASE - PRODUCTION COMPLETE
-- Database: payment_db
-- Created: December 17, 2025
-- Purpose: Double-Entry Accounting, Wallets, Transactions
-- =====================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CHART_OF_ACCOUNTS TABLE
-- GL (General Ledger) Account Definitions
-- =====================================================
CREATE TABLE chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Account identification
    account_code VARCHAR(20) NOT NULL UNIQUE, -- e.g., "1100", "2110", "4100"
    account_name VARCHAR(100) NOT NULL,
    
    -- Account classification
    account_type VARCHAR(20) NOT NULL, -- 'ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'
    normal_balance VARCHAR(10) NOT NULL, -- 'DEBIT' or 'CREDIT'
    
    -- Hierarchy (optional parent account)
    parent_account_code VARCHAR(20),
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Description
    description TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_account_type CHECK (account_type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE')),
    CONSTRAINT chk_normal_balance CHECK (normal_balance IN ('DEBIT', 'CREDIT')),
    CONSTRAINT fk_parent_account FOREIGN KEY (parent_account_code) REFERENCES chart_of_accounts(account_code)
);

-- =====================================================
-- WALLETS TABLE
-- User wallets linked to Chart of Accounts
-- =====================================================
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Owner (validated via API call to User Service, no FK)
    user_id UUID NOT NULL UNIQUE,
    
    -- Accounting link (CRITICAL for double-entry)
    gl_account_code VARCHAR(20) NOT NULL REFERENCES chart_of_accounts(account_code),
    
    -- Wallet details
    wallet_type VARCHAR(20) NOT NULL DEFAULT 'PERSONAL', -- 'PERSONAL', 'BUSINESS', 'MERCHANT'
    currency VARCHAR(3) NOT NULL DEFAULT 'VND',
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_frozen BOOLEAN NOT NULL DEFAULT false,
    freeze_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_wallet_type CHECK (wallet_type IN ('PERSONAL', 'BUSINESS', 'MERCHANT'))
);

-- =====================================================
-- TRANSACTIONS TABLE
-- High-level transaction records
-- =====================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Idempotency (CRITICAL for preventing duplicate charges)
    idempotency_key UUID NOT NULL UNIQUE,
    
    -- Participants
    from_wallet_id UUID REFERENCES wallets(id),
    to_wallet_id UUID REFERENCES wallets(id),
    from_user_id UUID, -- NULL for TOPUP (external source), required for TRANSFER/WITHDRAW
    to_user_id UUID, -- NULL for WITHDRAW
    
    -- Amount (in cents to avoid floating point issues)
    amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'VND',
    
    -- Transaction classification
    type VARCHAR(20) NOT NULL, -- 'TRANSFER', 'TOPUP', 'WITHDRAW', 'MERCHANT_PAYMENT', 'REFUND'
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REVERSED'
    
    -- Metadata
    description TEXT,
    reference_number VARCHAR(50), -- External reference
    
    -- Fraud detection
    is_flagged BOOLEAN NOT NULL DEFAULT false,
    fraud_score INT CHECK (fraud_score >= 0 AND fraud_score <= 100),
    fraud_reason TEXT,
    
    -- Request context
    ip_address VARCHAR(50),
    user_agent TEXT,
    
    -- Reversal tracking
    is_reversed BOOLEAN NOT NULL DEFAULT false,
    reversed_by_transaction_id UUID REFERENCES transactions(id),
    reversal_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT chk_type CHECK (type IN ('TRANSFER', 'TOPUP', 'WITHDRAW', 'MERCHANT_PAYMENT', 'REFUND')),
    CONSTRAINT chk_status CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REVERSED')),
    CONSTRAINT chk_different_wallets CHECK (from_wallet_id IS NULL OR to_wallet_id IS NULL OR from_wallet_id != to_wallet_id)
);

-- =====================================================
-- LEDGER_ENTRIES TABLE
-- Double-entry journal entries (IMMUTABLE)
-- =====================================================
CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Transaction link
    transaction_id UUID NOT NULL REFERENCES transactions(id),
    
    -- Accounting
    gl_account_code VARCHAR(20) NOT NULL REFERENCES chart_of_accounts(account_code),
    wallet_id UUID REFERENCES wallets(id), -- NULL for system accounts
    entry_type VARCHAR(10) NOT NULL, -- 'DEBIT' or 'CREDIT'
    amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
    
    -- Description
    description TEXT,
    
    -- Reversal tracking (for corrections, not deletions)
    is_reversed BOOLEAN NOT NULL DEFAULT false,
    reversed_by_entry_id UUID REFERENCES ledger_entries(id),
    
    -- Timestamp (IMMUTABLE - no updates allowed)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_entry_type CHECK (entry_type IN ('DEBIT', 'CREDIT'))
);

-- =====================================================
-- IDEMPOTENCY_CACHE TABLE
-- Cache transaction responses for 24 hours
-- =====================================================
CREATE TABLE idempotency_cache (
    idempotency_key UUID PRIMARY KEY,
    
    -- Cached response (JSON)
    response_data JSONB NOT NULL,
    
    -- Related transaction
    transaction_id UUID REFERENCES transactions(id),
    
    -- Expiration (24 hours)
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Index for cleanup
    CONSTRAINT chk_expires_at CHECK (expires_at > created_at)
);

-- =====================================================
-- MERCHANTS TABLE
-- Merchant account information
-- =====================================================
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Link to user (merchant is also a user)
    user_id UUID NOT NULL UNIQUE,
    wallet_id UUID NOT NULL UNIQUE REFERENCES wallets(id),
    
    -- Business details
    business_name VARCHAR(255) NOT NULL,
    business_registration_number VARCHAR(100),
    business_type VARCHAR(50),
    
    -- Payment settings
    merchant_fee_percentage NUMERIC(5, 2) NOT NULL DEFAULT 2.5, -- e.g., 2.5% per transaction
    settlement_frequency VARCHAR(20) NOT NULL DEFAULT 'DAILY', -- 'DAILY', 'WEEKLY', 'MONTHLY'
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_fee_percentage CHECK (merchant_fee_percentage >= 0 AND merchant_fee_percentage <= 10),
    CONSTRAINT chk_settlement_frequency CHECK (settlement_frequency IN ('DAILY', 'WEEKLY', 'MONTHLY'))
);

-- =====================================================
-- FRAUD_RULES TABLE
-- Configurable fraud detection rules
-- =====================================================
CREATE TABLE fraud_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Rule identification
    rule_name VARCHAR(100) NOT NULL UNIQUE,
    rule_type VARCHAR(50) NOT NULL, -- 'VELOCITY', 'AMOUNT_THRESHOLD', 'GEO_ANOMALY', 'PATTERN_MATCH'
    
    -- Rule parameters (JSON for flexibility)
    parameters JSONB NOT NULL,
    
    -- Scoring
    risk_score_penalty INT NOT NULL CHECK (risk_score_penalty >= 0 AND risk_score_penalty <= 100),
    
    -- Action
    action VARCHAR(20) NOT NULL DEFAULT 'FLAG', -- 'FLAG', 'BLOCK', 'REVIEW'
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_rule_type CHECK (rule_type IN ('VELOCITY', 'AMOUNT_THRESHOLD', 'GEO_ANOMALY', 'PATTERN_MATCH', 'BLACKLIST')),
    CONSTRAINT chk_action CHECK (action IN ('FLAG', 'BLOCK', 'REVIEW'))
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Chart of Accounts
CREATE INDEX idx_chart_account_code ON chart_of_accounts(account_code);
CREATE INDEX idx_chart_account_type ON chart_of_accounts(account_type);
CREATE INDEX idx_chart_active ON chart_of_accounts(is_active) WHERE is_active = true;

-- Wallets
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallets_gl_account ON wallets(gl_account_code);
CREATE INDEX idx_wallets_active ON wallets(is_active) WHERE is_active = true;

-- Transactions
CREATE INDEX idx_txn_from_wallet ON transactions(from_wallet_id);
CREATE INDEX idx_txn_to_wallet ON transactions(to_wallet_id);
CREATE INDEX idx_txn_from_user ON transactions(from_user_id);
CREATE INDEX idx_txn_to_user ON transactions(to_user_id) WHERE to_user_id IS NOT NULL;
CREATE INDEX idx_txn_status ON transactions(status);
CREATE INDEX idx_txn_type ON transactions(type);
CREATE INDEX idx_txn_created_at ON transactions(created_at DESC);
CREATE INDEX idx_txn_idempotency ON transactions(idempotency_key);
CREATE INDEX idx_txn_flagged ON transactions(is_flagged) WHERE is_flagged = true;
CREATE INDEX idx_txn_fraud_score ON transactions(fraud_score) WHERE fraud_score > 50;

-- Ledger Entries
CREATE INDEX idx_ledger_transaction_id ON ledger_entries(transaction_id);
CREATE INDEX idx_ledger_gl_account ON ledger_entries(gl_account_code);
CREATE INDEX idx_ledger_wallet_id ON ledger_entries(wallet_id) WHERE wallet_id IS NOT NULL;
CREATE INDEX idx_ledger_entry_type ON ledger_entries(entry_type);
CREATE INDEX idx_ledger_created_at ON ledger_entries(created_at DESC);
CREATE INDEX idx_ledger_not_reversed ON ledger_entries(is_reversed) WHERE is_reversed = false;

-- Idempotency Cache
CREATE INDEX idx_idempotency_expires_at ON idempotency_cache(expires_at);
CREATE INDEX idx_idempotency_transaction ON idempotency_cache(transaction_id) WHERE transaction_id IS NOT NULL;

-- Merchants
CREATE INDEX idx_merchants_user_id ON merchants(user_id);
CREATE INDEX idx_merchants_active ON merchants(is_active) WHERE is_active = true;

-- Fraud Rules
CREATE INDEX idx_fraud_rules_type ON fraud_rules(rule_type);
CREATE INDEX idx_fraud_rules_active ON fraud_rules(is_active) WHERE is_active = true;

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

CREATE TRIGGER update_chart_accounts_updated_at
    BEFORE UPDATE ON chart_of_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at
    BEFORE UPDATE ON wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_merchants_updated_at
    BEFORE UPDATE ON merchants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fraud_rules_updated_at
    BEFORE UPDATE ON fraud_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CONSTRAINT TRIGGER: Validate Balanced Transactions
-- CRITICAL: Ensures debits = credits for each transaction
-- =====================================================
CREATE OR REPLACE FUNCTION validate_balanced_transaction()
RETURNS TRIGGER AS $$
DECLARE
    v_total_debits BIGINT;
    v_total_credits BIGINT;
BEGIN
    -- Calculate totals for this transaction
    SELECT 
        COALESCE(SUM(CASE WHEN entry_type = 'DEBIT' THEN amount_cents ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN entry_type = 'CREDIT' THEN amount_cents ELSE 0 END), 0)
    INTO v_total_debits, v_total_credits
    FROM ledger_entries
    WHERE transaction_id = NEW.transaction_id
      AND is_reversed = false;
    
    -- Validate balance
    IF v_total_debits != v_total_credits THEN
        RAISE EXCEPTION 'Unbalanced transaction %: debits=% credits=%',
            NEW.transaction_id, v_total_debits, v_total_credits;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER trigger_validate_balanced_transaction
    AFTER INSERT ON ledger_entries
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW
    EXECUTE FUNCTION validate_balanced_transaction();

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Get wallet balance (calculated from ledger, never stored)
CREATE OR REPLACE FUNCTION get_wallet_balance(p_wallet_id UUID)
RETURNS BIGINT AS $$
DECLARE
    v_balance BIGINT;
    v_gl_account_code VARCHAR(20);
    v_normal_balance VARCHAR(10);
BEGIN
    -- Get wallet's GL account and its normal balance
    SELECT w.gl_account_code, coa.normal_balance
    INTO v_gl_account_code, v_normal_balance
    FROM wallets w
    JOIN chart_of_accounts coa ON coa.account_code = w.gl_account_code
    WHERE w.id = p_wallet_id;
    
    -- Calculate balance based on normal balance
    IF v_normal_balance = 'DEBIT' THEN
        -- ASSET account: debits increase, credits decrease
        SELECT COALESCE(
            SUM(CASE WHEN entry_type = 'DEBIT' THEN amount_cents ELSE -amount_cents END), 
            0
        )
        INTO v_balance
        FROM ledger_entries
        WHERE wallet_id = p_wallet_id AND is_reversed = false;
    ELSE
        -- LIABILITY/EQUITY/REVENUE account: credits increase, debits decrease
        SELECT COALESCE(
            SUM(CASE WHEN entry_type = 'CREDIT' THEN amount_cents ELSE -amount_cents END), 
            0
        )
        INTO v_balance
        FROM ledger_entries
        WHERE wallet_id = p_wallet_id AND is_reversed = false;
    END IF;
    
    RETURN v_balance;
END;
$$ LANGUAGE plpgsql;

-- Check idempotency
CREATE OR REPLACE FUNCTION check_idempotency(p_idempotency_key UUID)
RETURNS JSONB AS $$
DECLARE
    v_cached_response JSONB;
BEGIN
    -- Check cache (not expired)
    SELECT response_data
    INTO v_cached_response
    FROM idempotency_cache
    WHERE idempotency_key = p_idempotency_key
      AND expires_at > NOW();
    
    RETURN v_cached_response;
END;
$$ LANGUAGE plpgsql;

-- Cleanup expired idempotency cache (run via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_idempotency_cache()
RETURNS INT AS $$
DECLARE
    v_deleted_count INT;
BEGIN
    DELETE FROM idempotency_cache
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SEED DATA: Chart of Accounts
-- =====================================================
INSERT INTO chart_of_accounts (account_code, account_name, account_type, normal_balance, description) VALUES
    -- ASSETS (1000-1999)
    ('1000', 'Total Assets', 'ASSET', 'DEBIT', 'All company assets'),
    ('1100', 'Current Assets', 'ASSET', 'DEBIT', 'Assets convertible to cash within 1 year'),
    ('1110', 'Company Cash', 'ASSET', 'DEBIT', 'Company operating cash'),
    ('1120', 'User Deposits Held', 'ASSET', 'DEBIT', 'Cash held on behalf of users'),
    
    -- LIABILITIES (2000-2999)
    ('2000', 'Total Liabilities', 'LIABILITY', 'CREDIT', 'All company liabilities'),
    ('2100', 'Current Liabilities', 'LIABILITY', 'CREDIT', 'Liabilities due within 1 year'),
    ('2110', 'User Balances', 'LIABILITY', 'CREDIT', 'Money we owe to users (their wallet balances)'),
    ('2120', 'Merchant Payables', 'LIABILITY', 'CREDIT', 'Amounts owed to merchants'),
    
    -- EQUITY (3000-3999)
    ('3000', 'Total Equity', 'EQUITY', 'CREDIT', 'Owner equity'),
    ('3100', 'Common Stock', 'EQUITY', 'CREDIT', 'Issued shares'),
    ('3200', 'Retained Earnings', 'EQUITY', 'CREDIT', 'Cumulative profits'),
    
    -- REVENUE (4000-4999)
    ('4000', 'Total Revenue', 'REVENUE', 'CREDIT', 'All revenue'),
    ('4100', 'Transaction Fee Revenue', 'REVENUE', 'CREDIT', 'Fees from P2P transfers'),
    ('4200', 'Merchant Fee Revenue', 'REVENUE', 'CREDIT', 'Fees from merchant payments'),
    ('4300', 'Interchange Revenue', 'REVENUE', 'CREDIT', 'Revenue from card networks'),
    
    -- EXPENSES (5000-5999)
    ('5000', 'Total Expenses', 'EXPENSE', 'DEBIT', 'All expenses'),
    ('5100', 'Operating Expenses', 'EXPENSE', 'DEBIT', 'Day-to-day costs'),
    ('5110', 'Payment Processing Fees', 'EXPENSE', 'DEBIT', 'Fees to payment processors'),
    ('5120', 'Fraud Losses', 'EXPENSE', 'DEBIT', 'Losses from fraudulent transactions');

-- =====================================================
-- SEED DATA: Test Wallets
-- =====================================================
INSERT INTO wallets (id, user_id, gl_account_code, wallet_type, currency, is_active) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '2110', 'personal', 'VND', true),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', '2110', 'personal', 'VND', true),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', '2110', 'personal', 'VND', true);

-- =====================================================
-- SEED DATA: Fraud Rules
-- =====================================================
INSERT INTO fraud_rules (rule_name, rule_type, parameters, risk_score_penalty, action, is_active) VALUES
    ('High Amount Transaction', 'amount_threshold', '{"threshold_cents": 500000}', 40, 'flag', true),
    ('Velocity Check', 'velocity', '{"max_transactions_per_hour": 10}', 30, 'flag', true),
    ('Structuring Pattern', 'pattern_match', '{"pattern": "multiple_transactions_near_limit"}', 50, 'review', true),
    ('Geographic Anomaly', 'geo_anomaly', '{"check_ip_country": true}', 20, 'flag', true),
    ('Blacklist Check', 'blacklist', '{"check_user_blacklist": true}', 100, 'block', true);

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE chart_of_accounts IS 'General Ledger account definitions for double-entry accounting';
COMMENT ON TABLE wallets IS 'User wallets linked to GL accounts for double-entry bookkeeping';
COMMENT ON TABLE transactions IS 'High-level transaction records with idempotency protection';
COMMENT ON TABLE ledger_entries IS 'Immutable double-entry journal entries - NEVER update or delete';
COMMENT ON TABLE idempotency_cache IS 'Cache transaction responses for 24 hours to prevent duplicate charges';
COMMENT ON TABLE merchants IS 'Merchant account information and fee settings';
COMMENT ON TABLE fraud_rules IS 'Configurable fraud detection rules';
COMMENT ON COLUMN transactions.idempotency_key IS 'Client-generated UUID to prevent duplicate transactions';
COMMENT ON COLUMN ledger_entries.entry_type IS 'DEBIT or CREDIT - must balance per transaction';
COMMENT ON COLUMN chart_of_accounts.normal_balance IS 'DEBIT for assets/expenses, CREDIT for liabilities/equity/revenue';
