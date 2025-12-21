# Payment Service - API Testing Guide

**Date:** December 19, 2025  
**Service:** Payment Service (port 8082)  
**Prerequisites:** User Service running on port 8081 with gRPC on 9091  
**Infrastructure:** PostgreSQL (5433), Redis (6379), RabbitMQ (5672)

---

## 📋 TABLE OF CONTENTS

1. [Setup & Prerequisites](#setup--prerequisites)
2. [REST API Endpoints](#rest-api-endpoints)
3. [Test Scenarios](#test-scenarios)
4. [Error Handling](#error-handling)
5. [Fraud Detection Testing](#fraud-detection-testing)
6. [Idempotency Testing](#idempotency-testing)

---

## 🔧 SETUP & PREREQUISITES

### 1. Start Infrastructure
```powershell
# Start databases and cache
docker-compose up -d postgres-payment redis rabbitmq

# Verify containers running
docker ps

# Expected: xupay-postgres-payment, xupay-redis, xupay-rabbitmq
```

### 2. Verify Database
```powershell
# Check fraud rules seeded (should be 8)
docker exec xupay-postgres-payment psql -U payment_service_user -d payment_db `
  -c "SELECT COUNT(*) FROM fraud_rules;"

# View fraud rules
docker exec xupay-postgres-payment psql -U payment_service_user -d payment_db `
  -c "SELECT rule_name, rule_type, risk_score_penalty, action FROM fraud_rules ORDER BY risk_score_penalty DESC;"
```

### 3. Start User Service (Required for gRPC validation)
```powershell
cd backend\java-services\user-service
mvn spring-boot:run

# Wait for log: "Started UserServiceApplication"
# gRPC server listens on port 9091
```

### 4. Start Payment Service
```powershell
cd backend\java-services\payment-service
mvn spring-boot:run

# Wait for log: "Started PaymentServiceApplication"
# REST API listens on port 8082
```

### 5. Verify Health Endpoints
```powershell
curl http://localhost:8081/actuator/health  # User Service
curl http://localhost:8082/actuator/health  # Payment Service
```

---

## 🌐 REST API ENDPOINTS

### **1. Create Wallet**

**Endpoint:** `POST /api/wallets`  
**Purpose:** Create a new wallet for a user

**Request:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "walletType": "PERSONAL"
}
```

**Success Response (201 Created):**
```json
{
  "walletId": "7f3e4d2c-5a6b-4c8d-9e0f-1a2b3c4d5e6f",
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "walletType": "PERSONAL",
  "glAccountCode": "2110",
  "isActive": true,
  "isFrozen": false,
  "createdAt": "2025-12-19T10:30:00"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8082/api/wallets \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440001",
    "walletType": "PERSONAL"
  }'
```

**PowerShell Example:**
```powershell
$userId = "550e8400-e29b-41d4-a716-446655440001"
$body = @{
    userId = $userId
    walletType = "PERSONAL"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "http://localhost:8082/api/wallets" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

---

### **2. Get Wallet Balance**

**Endpoint:** `GET /api/wallets/{walletId}/balance`  
**Purpose:** Get current balance (calculated from ledger entries)

**Success Response (200 OK):**
```json
{
  "walletId": "7f3e4d2c-5a6b-4c8d-9e0f-1a2b3c4d5e6f",
  "balanceCents": 500000000,
  "balance": 5000000.00,
  "currency": "VND",
  "lastUpdated": "2025-12-19T10:35:00"
}
```

**cURL Example:**
```bash
curl http://localhost:8082/api/wallets/7f3e4d2c-5a6b-4c8d-9e0f-1a2b3c4d5e6f/balance
```

**PowerShell Example:**
```powershell
$walletId = "7f3e4d2c-5a6b-4c8d-9e0f-1a2b3c4d5e6f"
Invoke-RestMethod -Uri "http://localhost:8082/api/wallets/$walletId/balance"
```

---

### **3. P2P Transfer (Core Feature)**

**Endpoint:** `POST /api/payments/transfer`  
**Purpose:** Transfer money between two users

**Request:**
```json
{
  "idempotencyKey": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fromUserId": "550e8400-e29b-41d4-a716-446655440001",
  "toUserId": "660e9500-f39c-52e5-b827-557766551112",
  "amountCents": 10000000,
  "description": "Test P2P transfer",
  "userAgent": "PostmanTest/1.0"
}
```

**Success Response (200 OK):**
```json
{
  "transactionId": "8e4f5d3c-6b7a-5d9e-0f2a-3b4c5d6e7f8g",
  "status": "COMPLETED",
  "amountCents": 10000000,
  "amount": 100000.00,
  "fromUserId": "550e8400-e29b-41d4-a716-446655440001",
  "toUserId": "660e9500-f39c-52e5-b827-557766551112",
  "description": "Test P2P transfer",
  "isFlagged": false,
  "fraudScore": 0,
  "completedAt": "2025-12-19T10:40:00",
  "ledgerEntries": [
    {
      "id": "9f5g6e4d-7c8b-6ea0-1g3b-4c5d6e7f8g9h",
      "entryType": "DEBIT",
      "glAccountCode": "2110",
      "amountCents": 10000000,
      "description": "P2P Transfer to 660e9500-f39c-52e5-b827-557766551112"
    },
    {
      "id": "0g6h7f5e-8d9c-7fb1-2h4c-5d6e7f8g9h0i",
      "entryType": "CREDIT",
      "glAccountCode": "2110",
      "amountCents": 10000000,
      "description": "P2P Transfer from 550e8400-e29b-41d4-a716-446655440001"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8082/api/payments/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "idempotencyKey": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "fromUserId": "550e8400-e29b-41d4-a716-446655440001",
    "toUserId": "660e9500-f39c-52e5-b827-557766551112",
    "amountCents": 10000000,
    "description": "Test P2P transfer",
    "userAgent": "PostmanTest/1.0"
  }'
```

**PowerShell Example:**
```powershell
$idempotencyKey = (New-Guid).ToString()
$body = @{
    idempotencyKey = $idempotencyKey
    fromUserId = "550e8400-e29b-41d4-a716-446655440001"
    toUserId = "660e9500-f39c-52e5-b827-557766551112"
    amountCents = 10000000
    description = "Test P2P transfer"
    userAgent = "PowerShellTest/1.0"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "http://localhost:8082/api/payments/transfer" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

---

### **4. Get Transaction Details**

**Endpoint:** `GET /api/payments/transactions/{transactionId}`  
**Purpose:** Get full transaction details with ledger entries

**Success Response (200 OK):**
```json
{
  "transactionId": "8e4f5d3c-6b7a-5d9e-0f2a-3b4c5d6e7f8g",
  "status": "COMPLETED",
  "type": "TRANSFER",
  "amountCents": 10000000,
  "fromUserId": "550e8400-e29b-41d4-a716-446655440001",
  "toUserId": "660e9500-f39c-52e5-b827-557766551112",
  "description": "Test P2P transfer",
  "isFlagged": false,
  "fraudScore": 0,
  "createdAt": "2025-12-19T10:40:00",
  "completedAt": "2025-12-19T10:40:01",
  "ledgerEntries": [...]
}
```

**cURL Example:**
```bash
curl http://localhost:8082/api/payments/transactions/8e4f5d3c-6b7a-5d9e-0f2a-3b4c5d6e7f8g
```

---

## 🧪 TEST SCENARIOS

### **Scenario 1: Successful P2P Transfer**

**Goal:** Verify basic transfer flow

**Steps:**
1. Register two users in User Service (Alice & Bob)
2. Create wallets for both users
3. Topup Alice wallet (manual DB insert for testing)
4. Execute transfer Alice → Bob
5. Verify balances updated correctly

**PowerShell Script:**
```powershell
# Step 1: Register users (User Service)
$aliceReg = @{
    email = "alice@test.com"
    password = "Alice123!"
    phoneNumber = "+84901234001"
    fullName = "Alice Nguyen"
    dateOfBirth = "1990-01-01"
} | ConvertTo-Json

$alice = Invoke-RestMethod `
    -Uri "http://localhost:8081/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $aliceReg

$aliceId = $alice.user.userId
Write-Host "Alice ID: $aliceId"

$bobReg = @{
    email = "bob@test.com"
    password = "Bob123!"
    phoneNumber = "+84901234002"
    fullName = "Bob Tran"
    dateOfBirth = "1992-03-15"
} | ConvertTo-Json

$bob = Invoke-RestMethod `
    -Uri "http://localhost:8081/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $bobReg

$bobId = $bob.user.userId
Write-Host "Bob ID: $bobId"

# Step 2: Create wallets
$aliceWallet = Invoke-RestMethod `
    -Uri "http://localhost:8082/api/wallets" `
    -Method POST `
    -ContentType "application/json" `
    -Body (@{ userId = $aliceId; walletType = "PERSONAL" } | ConvertTo-Json)

$bobWallet = Invoke-RestMethod `
    -Uri "http://localhost:8082/api/wallets" `
    -Method POST `
    -ContentType "application/json" `
    -Body (@{ userId = $bobId; walletType = "PERSONAL" } | ConvertTo-Json)

Write-Host "Alice Wallet ID: $($aliceWallet.walletId)"
Write-Host "Bob Wallet ID: $($bobWallet.walletId)"

# Step 3: Topup Alice wallet (simulated via direct DB insert)
# Note: In production, this would be a payment gateway integration
docker exec xupay-postgres-payment psql -U payment_service_user -d payment_db -c "
INSERT INTO transactions (id, idempotency_key, from_wallet_id, to_wallet_id, from_user_id, amount_cents, type, status, description, completed_at)
VALUES (gen_random_uuid(), gen_random_uuid(), NULL, '$($aliceWallet.walletId)', '$aliceId', 100000000, 'TOPUP', 'COMPLETED', 'Test topup', NOW());

INSERT INTO ledger_entries (id, transaction_id, wallet_id, gl_account_code, entry_type, amount_cents, description)
SELECT gen_random_uuid(), id, to_wallet_id, '2110', 'CREDIT', amount_cents, 'Topup via test'
FROM transactions WHERE description = 'Test topup' ORDER BY created_at DESC LIMIT 1;
"

# Step 4: Check Alice balance
$aliceBalance = Invoke-RestMethod -Uri "http://localhost:8082/api/wallets/$($aliceWallet.walletId)/balance"
Write-Host "Alice Balance: $($aliceBalance.balance) VND"

# Step 5: Execute transfer
$transferReq = @{
    idempotencyKey = (New-Guid).ToString()
    fromUserId = $aliceId
    toUserId = $bobId
    amountCents = 25000000  # 250,000 VND
    description = "Test payment to Bob"
    userAgent = "PowerShellTest/1.0"
} | ConvertTo-Json

$transfer = Invoke-RestMethod `
    -Uri "http://localhost:8082/api/payments/transfer" `
    -Method POST `
    -ContentType "application/json" `
    -Body $transferReq

Write-Host "`nTransfer Result:"
Write-Host "Transaction ID: $($transfer.transactionId)"
Write-Host "Status: $($transfer.status)"
Write-Host "Fraud Score: $($transfer.fraudScore)"

# Step 6: Verify balances
$aliceBalanceAfter = Invoke-RestMethod -Uri "http://localhost:8082/api/wallets/$($aliceWallet.walletId)/balance"
$bobBalanceAfter = Invoke-RestMethod -Uri "http://localhost:8082/api/wallets/$($bobWallet.walletId)/balance"

Write-Host "`nFinal Balances:"
Write-Host "Alice: $($aliceBalanceAfter.balance) VND (should be 750,000)"
Write-Host "Bob: $($bobBalanceAfter.balance) VND (should be 250,000)"
```

---

### **Scenario 2: Idempotency Test**

**Goal:** Verify duplicate requests return cached response

**Steps:**
1. Execute transfer with idempotency key `test-key-001`
2. Retry same request with same key
3. Verify only ONE transaction created
4. Verify second response returns immediately (from cache)

**PowerShell Script:**
```powershell
$idempotencyKey = "test-idempotency-001"
$transferReq = @{
    idempotencyKey = $idempotencyKey
    fromUserId = $aliceId
    toUserId = $bobId
    amountCents = 5000000
    description = "Idempotency test"
    userAgent = "PowerShellTest/1.0"
} | ConvertTo-Json

# First request
Write-Host "Sending first request..."
$response1 = Invoke-RestMethod `
    -Uri "http://localhost:8082/api/payments/transfer" `
    -Method POST `
    -ContentType "application/json" `
    -Body $transferReq

Write-Host "Transaction ID: $($response1.transactionId)"
Write-Host "Status: $($response1.status)"

# Wait 2 seconds
Start-Sleep -Seconds 2

# Second request (same idempotency key)
Write-Host "`nSending duplicate request..."
$response2 = Invoke-RestMethod `
    -Uri "http://localhost:8082/api/payments/transfer" `
    -Method POST `
    -ContentType "application/json" `
    -Body $transferReq

Write-Host "Transaction ID: $($response2.transactionId)"
Write-Host "Status: $($response2.status)"

# Verify same transaction ID
if ($response1.transactionId -eq $response2.transactionId) {
    Write-Host "`n✅ Idempotency test PASSED: Same transaction returned"
} else {
    Write-Host "`n❌ Idempotency test FAILED: Different transactions"
}

# Verify Redis cache
docker exec xupay-redis redis-cli -a 'R3d1sP@ss2025!' KEYS "idempotency:*"
```

---

### **Scenario 3: Fraud Detection - High Amount**

**Goal:** Verify large transactions are flagged

**Steps:**
1. Execute transfer of 6M VND (600M cents)
2. Verify `isFlagged: true`
3. Verify `fraudScore >= 70`

**PowerShell Script:**
```powershell
$largeTransfer = @{
    idempotencyKey = (New-Guid).ToString()
    fromUserId = $aliceId
    toUserId = $bobId
    amountCents = 600000000  # 6M VND (triggers high amount rule)
    description = "Large amount test"
    userAgent = "PowerShellTest/1.0"
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "http://localhost:8082/api/payments/transfer" `
    -Method POST `
    -ContentType "application/json" `
    -Body $largeTransfer

Write-Host "Transaction ID: $($response.transactionId)"
Write-Host "Fraud Score: $($response.fraudScore)"
Write-Host "Is Flagged: $($response.isFlagged)"
Write-Host "Status: $($response.status)"

if ($response.fraudScore -ge 70) {
    Write-Host "`n✅ Fraud detection PASSED: High amount flagged"
} else {
    Write-Host "`n❌ Fraud detection FAILED: Score too low"
}
```

---

### **Scenario 4: Velocity Check**

**Goal:** Verify rapid transactions trigger velocity rule

**Steps:**
1. Execute 12 transfers in quick succession
2. Verify fraud score increases
3. Verify transaction flagged after 10 transfers

**PowerShell Script:**
```powershell
Write-Host "Executing 12 rapid transfers..."
for ($i = 1; $i -le 12; $i++) {
    $transferReq = @{
        idempotencyKey = (New-Guid).ToString()
        fromUserId = $aliceId
        toUserId = $bobId
        amountCents = 1000000  # 10,000 VND
        description = "Velocity test $i"
        userAgent = "PowerShellTest/1.0"
    } | ConvertTo-Json

    $response = Invoke-RestMethod `
        -Uri "http://localhost:8082/api/payments/transfer" `
        -Method POST `
        -ContentType "application/json" `
        -Body $transferReq

    Write-Host "Transfer $i - Fraud Score: $($response.fraudScore), Flagged: $($response.isFlagged)"
}

Write-Host "`n✅ Velocity test complete. Review scores above."
```

---

## ❌ ERROR HANDLING

### **Error Response Format:**
```json
{
  "timestamp": "2025-12-19T10:45:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Wallet not found",
  "path": "/api/payments/transfer"
}
```

### **Common Error Codes:**

| Status | Error | Cause |
|--------|-------|-------|
| 400 | Bad Request | Invalid request body, missing fields |
| 404 | Not Found | Wallet/Transaction not found |
| 409 | Conflict | Wallet frozen, duplicate wallet |
| 422 | Unprocessable Entity | Insufficient balance, transaction limit exceeded |
| 403 | Forbidden | Fraud blocked, KYC not approved |
| 500 | Internal Server Error | Database error, unexpected exception |

### **Example Error Responses:**

**Insufficient Balance:**
```json
{
  "timestamp": "2025-12-19T10:45:00",
  "status": 422,
  "error": "Insufficient Balance",
  "message": "Available balance: 500,000 VND, requested: 1,000,000 VND",
  "path": "/api/payments/transfer"
}
```

**Fraud Blocked:**
```json
{
  "timestamp": "2025-12-19T10:45:00",
  "status": 403,
  "error": "Fraud Blocked",
  "message": "Transaction blocked by fraud detection (score: 90)",
  "path": "/api/payments/transfer"
}
```

**Frozen Wallet:**
```json
{
  "timestamp": "2025-12-19T10:45:00",
  "status": 409,
  "error": "Wallet Frozen",
  "message": "Wallet is frozen and cannot perform transactions",
  "path": "/api/payments/transfer"
}
```

---

## 🔐 FRAUD DETECTION RULES

### **Active Rules (from V2 migration):**

| Rule Name | Type | Threshold | Score | Action |
|-----------|------|-----------|-------|--------|
| Velocity Block: 20 txns/hour | VELOCITY | 20 txns/60min | 90 | BLOCK |
| Very High Amount: > 5M VND | AMOUNT_THRESHOLD | 500M cents | 80 | BLOCK |
| Daily Limit: 50 txns/day | VELOCITY | 50 txns/1440min | 60 | REVIEW |
| Rapid Succession: 5 in 5min | VELOCITY | 5 txns/5min | 50 | FLAG |
| Velocity Alert: 10 txns/hour | VELOCITY | 10 txns/60min | 40 | FLAG |
| High Amount: > 1M VND | AMOUNT_THRESHOLD | 100M cents | 30 | FLAG |
| Round Amount Pattern | PATTERN_MATCH | Divisible by 1M | 20 | FLAG |
| Medium Amount: > 500k VND | AMOUNT_THRESHOLD | 50M cents | 15 | FLAG |

### **Scoring System:**
- **Score < 70:** ALLOW (transaction proceeds)
- **Score >= 70:** FLAG (transaction proceeds but flagged for review)
- **Score >= 80:** BLOCK (transaction rejected)

---

## 🎯 VALIDATION CHECKLIST

Before declaring testing complete:

- [ ] All infrastructure containers running
- [ ] 8 fraud rules seeded in database
- [ ] User Service running with gRPC on 9091
- [ ] Payment Service running on 8082
- [ ] Successful wallet creation
- [ ] Successful P2P transfer
- [ ] Idempotency works (duplicate key returns same response)
- [ ] Fraud detection flags high amounts
- [ ] Velocity check triggers after 10 transactions
- [ ] Ledger entries balanced (debits = credits)
- [ ] Redis cache working (keys visible)
- [ ] Error responses follow standard format

---

**END OF TESTING GUIDE**