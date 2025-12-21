-- =====================================================
-- FRAUD RULES DATA SEEDER
-- Initial production fraud detection rules
-- =====================================================

-- Rule 1: High velocity - 10 transactions per hour (FLAG)
INSERT INTO fraud_rules (id, rule_name, rule_type, parameters, risk_score_penalty, action, is_active)
VALUES (
    gen_random_uuid(),
    'Velocity Alert: 10 transactions per hour',
    'VELOCITY',
    '{"maxTransactions": 10, "timeWindowMinutes": 60}'::jsonb,
    40,
    'FLAG',
    true
)
ON CONFLICT (rule_name) DO NOTHING;

-- Rule 2: Very high velocity - 20 transactions per hour (BLOCK)
INSERT INTO fraud_rules (id, rule_name, rule_type, parameters, risk_score_penalty, action, is_active)
VALUES (
    gen_random_uuid(),
    'Velocity Block: 20 transactions per hour',
    'VELOCITY',
    '{"maxTransactions": 20, "timeWindowMinutes": 60}'::jsonb,
    90,
    'BLOCK',
    true
)
ON CONFLICT (rule_name) DO NOTHING;

-- Rule 3: High amount alert - 100,000,000 cents ($1M VND)
INSERT INTO fraud_rules (id, rule_name, rule_type, parameters, risk_score_penalty, action, is_active)
VALUES (
    gen_random_uuid(),
    'High Amount Alert: > 1M VND',
    'AMOUNT_THRESHOLD',
    '{"thresholdCents": 100000000}'::jsonb,
    30,
    'FLAG',
    true
)
ON CONFLICT (rule_name) DO NOTHING;

-- Rule 4: Very high amount block - 500,000,000 cents ($5M VND)
INSERT INTO fraud_rules (id, rule_name, rule_type, parameters, risk_score_penalty, action, is_active)
VALUES (
    gen_random_uuid(),
    'Very High Amount Block: > 5M VND',
    'AMOUNT_THRESHOLD',
    '{"thresholdCents": 500000000}'::jsonb,
    80,
    'BLOCK',
    true
)
ON CONFLICT (rule_name) DO NOTHING;

-- Rule 5: Suspicious round amount pattern
INSERT INTO fraud_rules (id, rule_name, rule_type, parameters, risk_score_penalty, action, is_active)
VALUES (
    gen_random_uuid(),
    'Round Amount Pattern: Divisible by 1M',
    'PATTERN_MATCH',
    '{"pattern": "ROUND_AMOUNT", "divisor": 1000000}'::jsonb,
    20,
    'FLAG',
    true
)
ON CONFLICT (rule_name) DO NOTHING;

-- Rule 6: Rapid succession (5+ txns in 5 minutes)
INSERT INTO fraud_rules (id, rule_name, rule_type, parameters, risk_score_penalty, action, is_active)
VALUES (
    gen_random_uuid(),
    'Rapid Succession: 5+ txns in 5 minutes',
    'VELOCITY',
    '{"maxTransactions": 5, "timeWindowMinutes": 5}'::jsonb,
    50,
    'FLAG',
    true
)
ON CONFLICT (rule_name) DO NOTHING;

-- Rule 7: Daily limit (50 transactions per day)
INSERT INTO fraud_rules (id, rule_name, rule_type, parameters, risk_score_penalty, action, is_active)
VALUES (
    gen_random_uuid(),
    'Daily Limit: 50 transactions per day',
    'VELOCITY',
    '{"maxTransactions": 50, "timeWindowMinutes": 1440}'::jsonb,
    60,
    'REVIEW',
    true
)
ON CONFLICT (rule_name) DO NOTHING;

-- Rule 8: Medium amount alert - 50,000,000 cents ($500k VND)
INSERT INTO fraud_rules (id, rule_name, rule_type, parameters, risk_score_penalty, action, is_active)
VALUES (
    gen_random_uuid(),
    'Medium Amount Alert: > 500k VND',
    'AMOUNT_THRESHOLD',
    '{"thresholdCents": 50000000}'::jsonb,
    15,
    'FLAG',
    true
)
ON CONFLICT (rule_name) DO NOTHING;

-- Verify insertion
SELECT rule_name, rule_type, risk_score_penalty, action, is_active
FROM fraud_rules
ORDER BY risk_score_penalty DESC;
