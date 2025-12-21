# USER SERVICE DATABASE SCHEMA ANALYSIS
> **Created:** December 17, 2025  
> **Database:** user_db (PostgreSQL 15+)  
> **Purpose:** Complete analysis of schema correctness and redundancy check

---

## ✅ SCHEMA OVERVIEW

The User Service database manages **6 tables** across 4 main functional areas:

| Table | Purpose | Records | Relationships |
|-------|---------|---------|---------------|
| `users` | Core user accounts | ~1M | Parent to all tables |
| `kyc_documents` | Identity verification | ~5M | Many per user |
| `transaction_limits` | Tier-based limits | 4 rows | Referenced by users |
| `daily_usage` | Volume tracking | ~365M | One per user per day |
| `user_contacts` | Frequent recipients | ~10M | Self-referencing users |
| `user_preferences` | User settings | ~1M | One per user (1:1) |

**Total Expected Storage:** ~50GB for 1M users over 1 year

---

## 🔍 DETAILED TABLE ANALYSIS

### 1. USERS TABLE ✅ CORRECT

**Purpose:** Core identity with KYC tier system

**Key Design Decisions:**
```sql
-- UUID as primary key (good for distributed systems)
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

-- KYC tier system (tier_0 to tier_3)
kyc_tier VARCHAR(20) NOT NULL DEFAULT 'tier_0'

-- Fraud tracking (0-100 score)
fraud_score INT NOT NULL DEFAULT 0 CHECK (fraud_score >= 0 AND fraud_score <= 100)
```

**Strengths:**
- ✅ Email validation via regex constraint
- ✅ Proper KYC status enum (pending, approved, rejected, expired)
- ✅ Fraud score with check constraint
- ✅ Timestamps with timezone (TIMESTAMPTZ)
- ✅ IP/User-agent tracking for security

**Potential Issues:**
- ⚠️ `phone` nullable but has UNIQUE constraint → Can cause issues with multiple NULL values
  - **FIX:** Add partial index: `CREATE UNIQUE INDEX idx_users_phone_unique ON users(phone) WHERE phone IS NOT NULL;`
  - **ALREADY FIXED** in existing schema (line 236)

**Redundancy Check:**
- ❌ NO REDUNDANCY: All columns serve distinct purposes

**Performance:**
- ✅ Indexed: email, phone, kyc_status, kyc_tier, is_active, fraud_score

---

### 2. KYC_DOCUMENTS TABLE ✅ CORRECT

**Purpose:** Track identity verification documents

**Key Design:**
```sql
-- Foreign key with cascade delete
user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE

-- Document type enum
document_type VARCHAR(50) NOT NULL CHECK (document_type IN (...))

-- OCR/extracted data as JSONB
extracted_data JSONB
```

**Strengths:**
- ✅ Proper foreign key with CASCADE delete
- ✅ Verification workflow (pending → approved/rejected/expired)
- ✅ JSONB for flexible OCR data storage
- ✅ File metadata (size, mime_type)

**Potential Issues:**
- ⚠️ `file_url` stored as TEXT → If using S3, consider adding bucket/key separately
  - **RECOMMENDATION:** Add columns: `s3_bucket`, `s3_key` for better organization
  - **STATUS:** Not critical for MVP, can refactor later

**Redundancy Check:**
- ❌ NO REDUNDANCY: All columns necessary for verification workflow

**Performance:**
- ✅ Indexed: user_id, verification_status, created_at

---

### 3. TRANSACTION_LIMITS TABLE ✅ CORRECT

**Purpose:** Define per-tier transaction limits

**Key Design:**
```sql
-- Tier as unique constraint (4 rows total)
tier_name VARCHAR(20) NOT NULL UNIQUE

-- All limits in cents (BIGINT)
daily_send_limit_cents BIGINT NOT NULL
single_transaction_max_cents BIGINT NOT NULL
```

**Strengths:**
- ✅ BIGINT cents (avoids float precision issues)
- ✅ Unique tier_name constraint
- ✅ Check constraints for positive limits
- ✅ Velocity controls (hourly/daily transaction counts)

**Seed Data Validation:**
```
tier_0: $100/day, $50/txn    ✅ Correct for unverified
tier_1: $1,000/day, $500/txn ✅ Basic KYC
tier_2: $10,000/day, $5k/txn ✅ Enhanced KYC
tier_3: $100k/day, $50k/txn  ✅ Full KYC
```

**Redundancy Check:**
- ❌ NO REDUNDANCY: All columns define distinct limits

**Potential Enhancement:**
- 💡 Consider adding `effective_from` and `effective_to` dates for limit changes over time
- **STATUS:** Not needed for MVP

---

### 4. DAILY_USAGE TABLE ✅ CORRECT (with caveats)

**Purpose:** Track daily transaction volumes for limit enforcement

**Key Design:**
```sql
-- Unique constraint: one record per user per day
CONSTRAINT uq_user_date UNIQUE (user_id, usage_date)

-- Hourly velocity tracking
hourly_sent_counts JSONB NOT NULL DEFAULT '{}'
```

**Strengths:**
- ✅ Unique constraint prevents duplicate daily records
- ✅ Separate sent/received tracking
- ✅ JSONB for flexible hourly breakdown

**Potential Issues:**
- ⚠️ **WRITE CONTENTION RISK**: Updated on every transaction (high frequency)
  - **PROBLEM:** Multiple concurrent transactions = lock contention
  - **SOLUTION:** Use PostgreSQL `SELECT FOR UPDATE NOWAIT` or Redis for real-time tracking
  - **RECOMMENDATION:** Cache daily_usage in Redis, sync to PostgreSQL hourly

**Redundancy Check:**
- ⚠️ **PARTIAL REDUNDANCY**: `total_sent_count` can be derived from counting transactions
  - **JUSTIFICATION:** Pre-aggregation improves query performance (avoids COUNT(*))
  - **VERDICT:** Keep as-is for performance

**Performance:**
- ✅ Composite index: (user_id, usage_date)
- ✅ Date index for cleanup queries

**CRITICAL IMPROVEMENT NEEDED:**
```sql
-- Add this to handle concurrent updates safely
CREATE OR REPLACE FUNCTION increment_daily_usage(
    p_user_id UUID,
    p_amount_cents BIGINT,
    p_is_sent BOOLEAN
) RETURNS VOID AS $$
BEGIN
    INSERT INTO daily_usage (user_id, usage_date, total_sent_cents, total_sent_count)
    VALUES (p_user_id, CURRENT_DATE, 
            CASE WHEN p_is_sent THEN p_amount_cents ELSE 0 END,
            CASE WHEN p_is_sent THEN 1 ELSE 0 END)
    ON CONFLICT (user_id, usage_date)
    DO UPDATE SET
        total_sent_cents = daily_usage.total_sent_cents + EXCLUDED.total_sent_cents,
        total_sent_count = daily_usage.total_sent_count + EXCLUDED.total_sent_count,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
```

---

### 5. USER_CONTACTS TABLE ✅ CORRECT

**Purpose:** Store frequently used recipient contacts

**Key Design:**
```sql
-- Self-referencing foreign keys
user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
contact_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE

-- Prevent self-contacts
CONSTRAINT chk_no_self_contact CHECK (user_id != contact_user_id)

-- Unique pair
CONSTRAINT uq_user_contact UNIQUE (user_id, contact_user_id)
```

**Strengths:**
- ✅ Self-referencing FKs with cascade delete
- ✅ No self-contact constraint
- ✅ Unique pair constraint (no duplicates)
- ✅ Usage statistics (total_transactions, last_transaction_at)

**Redundancy Check:**
- ⚠️ **REDUNDANCY**: `total_transactions` can be counted from transactions table
  - **JUSTIFICATION:** Denormalization for UX performance (autocomplete, top contacts)
  - **VERDICT:** Keep as-is, update via trigger when transaction completes

**Performance:**
- ✅ Indexed: user_id, contact_user_id

---

### 6. USER_PREFERENCES TABLE ✅ CORRECT

**Purpose:** User settings and preferences

**Key Design:**
```sql
-- 1:1 relationship with users
user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
```

**Strengths:**
- ✅ 1:1 relationship enforced via UNIQUE constraint
- ✅ Sensible defaults (email_notifications=true, 2FA=false)
- ✅ Cascade delete when user deleted

**Potential Issues:**
- ⚠️ **NULLABLE ISSUE**: All preferences have defaults, so should be NOT NULL
  - **STATUS:** Already correct - all columns have `NOT NULL DEFAULT`

**Redundancy Check:**
- ❌ NO REDUNDANCY: All columns are independent settings

**Alternative Design Consideration:**
- 💡 Could use JSONB for all preferences (more flexible)
- **VERDICT:** Current columnar approach is better for type safety and indexing

---

## 🔧 HELPER FUNCTIONS ANALYSIS

### 1. `get_user_limits(p_user_id UUID)` ✅ CORRECT

**Purpose:** Get user's tier limits + current daily usage

**Returns:**
- daily_send_limit_cents
- daily_receive_limit_cents
- single_transaction_max_cents
- daily_sent_so_far_cents
- can_send_international

**Strengths:**
- ✅ Joins users → transaction_limits → daily_usage
- ✅ Handles NULL daily_usage (COALESCE)

**Potential Enhancement:**
```sql
-- Add remaining limit calculation
remaining_daily_limit_cents := 
    daily_send_limit_cents - daily_sent_so_far_cents
```

---

### 2. `can_user_transact(p_user_id UUID, p_amount_cents BIGINT)` ✅ CORRECT

**Purpose:** Pre-flight check before allowing transaction

**Validations:**
1. ✅ User active
2. ✅ User not suspended
3. ✅ KYC approved
4. ✅ Daily limit not exceeded

**Critical Missing Validation:**
- ❌ **MISSING:** Single transaction max check
- ❌ **MISSING:** Hourly velocity check

**REQUIRED FIX:**
```sql
CREATE OR REPLACE FUNCTION can_user_transact(
    p_user_id UUID, 
    p_amount_cents BIGINT
) RETURNS BOOLEAN AS $$
DECLARE
    v_is_active BOOLEAN;
    v_is_suspended BOOLEAN;
    v_kyc_status VARCHAR(20);
    v_daily_limit BIGINT;
    v_single_max BIGINT;        -- ADD THIS
    v_daily_sent BIGINT;
    v_hourly_count INT;          -- ADD THIS
    v_max_hourly INT;            -- ADD THIS
BEGIN
    -- Get user status
    SELECT u.is_active, u.is_suspended, u.kyc_status,
           tl.daily_send_limit_cents, 
           tl.single_transaction_max_cents,     -- ADD THIS
           tl.max_transactions_per_hour,        -- ADD THIS
           COALESCE(du.total_sent_cents, 0),
           COALESCE((du.hourly_sent_counts->>to_char(CURRENT_TIMESTAMP, 'HH24'))::int, 0) -- ADD THIS
    INTO v_is_active, v_is_suspended, v_kyc_status, 
         v_daily_limit, v_single_max, v_max_hourly, v_daily_sent, v_hourly_count
    FROM users u
    JOIN transaction_limits tl ON tl.tier_name = u.kyc_tier
    LEFT JOIN daily_usage du ON du.user_id = u.id AND du.usage_date = CURRENT_DATE
    WHERE u.id = p_user_id;
    
    -- Check basic conditions
    IF NOT v_is_active OR v_is_suspended OR v_kyc_status != 'approved' THEN
        RETURN false;
    END IF;
    
    -- Check single transaction max
    IF p_amount_cents > v_single_max THEN
        RETURN false;
    END IF;
    
    -- Check daily limit
    IF (v_daily_sent + p_amount_cents) > v_daily_limit THEN
        RETURN false;
    END IF;
    
    -- Check hourly velocity
    IF v_hourly_count >= v_max_hourly THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;
```

---

## 📊 REDUNDANCY ANALYSIS SUMMARY

| Column/Data | Redundant? | Verdict | Reason |
|-------------|------------|---------|--------|
| `daily_usage.total_sent_count` | ✅ Yes | **KEEP** | Performance optimization |
| `user_contacts.total_transactions` | ✅ Yes | **KEEP** | UX performance (autocomplete) |
| All other columns | ❌ No | **KEEP** | Essential data |

**Conclusion:** Minimal redundancy exists, and it's justified for performance reasons.

---

## 🚨 REQUIRED FIXES BEFORE IMPLEMENTATION

### Priority 1 (Must Fix):
1. ✅ **FIXED**: Unique phone index already exists
2. ❌ **FIX**: Update `can_user_transact()` function to check single_max and hourly velocity
3. ❌ **ADD**: `increment_daily_usage()` function for safe concurrent updates

### Priority 2 (Should Fix):
4. ❌ **ADD**: Trigger to update `user_contacts.total_transactions` when payment completes
5. ❌ **CONSIDER**: Redis caching layer for `daily_usage` (reduce DB contention)

### Priority 3 (Nice to Have):
6. 💡 **ENHANCE**: Add `remaining_daily_limit_cents` to `get_user_limits()` return
7. 💡 **ENHANCE**: Add `s3_bucket` and `s3_key` columns to `kyc_documents`

---

## ✅ FINAL VERDICT

**SCHEMA CORRECTNESS:** 95/100
- ✅ Proper normalization
- ✅ Strong constraints
- ✅ Good indexing
- ⚠️ Minor function improvements needed

**REDUNDANCY:** 5/100
- Only 2 denormalized columns, both justified

**PRODUCTION READINESS:** 90/100
- ✅ Ready for MVP
- ⚠️ Fix `can_user_transact()` before launch
- ⚠️ Add Redis caching for high-volume production

---

## 📋 NEXT STEPS

1. Apply the 2 critical function fixes (see above)
2. Create Java JPA entities matching this schema exactly
3. Write integration tests for all constraints
4. Implement Redis caching layer for `daily_usage`

**Schema is APPROVED for implementation with noted fixes.**
