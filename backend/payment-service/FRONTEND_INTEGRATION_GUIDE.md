# Payment Service - Frontend Integration Guide
> **Service:** Payment Service  
> **Base URL:** http://localhost:8082  
> **Status:** ✅ Ready for Integration  
> **Last Updated:** December 19, 2025

---

## 🎯 Overview

The Payment Service provides wallet management, P2P transfers, and fraud detection capabilities. This guide provides everything frontend developers need to integrate with the service.

---

## 📡 Available APIs

### **1. Wallet Management**

#### **POST /api/wallets** - Create Wallet
Creates a new wallet for a user.

**Request:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "walletType": "PERSONAL"
}
```

**Response (201 Created):**
```json
{
  "walletId": "7f3e4d2c-5a6b-4c8d-9e0f-1a2b3c4d5e6f",
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "walletType": "PERSONAL",
  "isActive": true,
  "createdAt": "2025-12-19T10:30:00Z"
}
```

**Validation Rules:**
- `userId`: Required, must be valid UUID
- `walletType`: Required, one of: `PERSONAL`, `BUSINESS`, `MERCHANT`

---

#### **GET /api/wallets/{walletId}/balance** - Get Balance
Retrieves the current wallet balance calculated from ledger entries.

**Request:**
```
GET /api/wallets/7f3e4d2c-5a6b-4c8d-9e0f-1a2b3c4d5e6f/balance
```

**Response (200 OK):**
```json
{
  "walletId": "7f3e4d2c-5a6b-4c8d-9e0f-1a2b3c4d5e6f",
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "balanceCents": 100000000,
  "balance": "1,000,000 VND",
  "lastUpdated": "2025-12-19T10:45:00Z"
}
```

**Notes:**
- Balance is calculated in real-time from double-entry ledger
- All amounts are stored in cents (1 VND = 100 cents)
- Balance cannot go negative (constraint enforced at database level)

---

### **2. P2P Transfers**

#### **POST /api/payments/transfer** - Transfer Money
Initiates a peer-to-peer money transfer with fraud detection and idempotency.

**Request:**
```json
{
  "idempotencyKey": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fromUserId": "550e8400-e29b-41d4-a716-446655440001",
  "toUserId": "660e9500-f39c-52e5-b827-557766551112",
  "amountCents": 25000000,
  "description": "Lunch payment"
}
```

**Response (201 Created):**
```json
{
  "transactionId": "9h5g8f6e-0e1d-8gc2-3i5d-6e7f8g9h0i1j",
  "idempotencyKey": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fromUserId": "550e8400-e29b-41d4-a716-446655440001",
  "toUserId": "660e9500-f39c-52e5-b827-557766551112",
  "amountCents": 25000000,
  "status": "COMPLETED",
  "description": "Lunch payment",
  "fraudScore": 15,
  "fraudFlags": ["velocity_check_passed"],
  "completedAt": "2025-12-19T10:50:00Z",
  "createdAt": "2025-12-19T10:50:00Z"
}
```

**Validation Rules:**
- `idempotencyKey`: Required, unique UUID for retry safety
- `fromUserId`: Required, must have sufficient balance
- `toUserId`: Required, must be different from `fromUserId`
- `amountCents`: Required, must be > 0, <= 50,000,000,000 (500M VND)
- `description`: Optional, max 500 characters

**Status Values:**
- `PENDING`: Transfer initiated but not processed
- `PROCESSING`: Currently being processed
- `COMPLETED`: Successfully completed
- `FAILED`: Failed (insufficient balance, validation error)
- `CANCELLED`: Cancelled by user
- `REVERSED`: Reversed due to dispute

**Fraud Detection:**
- `fraudScore`: 0-100 (higher = more suspicious)
- `fraudFlags`: Array of triggered rule descriptions
- Transactions with score >= 80 are automatically blocked
- Transactions with score >= 70 are flagged for manual review

---

#### **POST /api/payments/transfer (Retry with Same Key)** - Idempotency
Retrying a transfer with the same `idempotencyKey` returns the cached response (no duplicate charge).

**Request (Same as above):**
```json
{
  "idempotencyKey": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fromUserId": "550e8400-e29b-41d4-a716-446655440001",
  "toUserId": "660e9500-f39c-52e5-b827-557766551112",
  "amountCents": 25000000,
  "description": "Lunch payment"
}
```

**Response (200 OK - Cached):**
```json
{
  "transactionId": "9h5g8f6e-0e1d-8gc2-3i5d-6e7f8g9h0i1j",
  "idempotencyKey": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fromUserId": "550e8400-e29b-41d4-a716-446655440001",
  "toUserId": "660e9500-f39c-52e5-b827-557766551112",
  "amountCents": 25000000,
  "status": "COMPLETED",
  "description": "Lunch payment",
  "fraudScore": 15,
  "fraudFlags": ["velocity_check_passed"],
  "completedAt": "2025-12-19T10:50:00Z",
  "createdAt": "2025-12-19T10:50:00Z"
}
```

**Notes:**
- Same `transactionId` returned
- No duplicate charge to sender
- Cached for 24 hours in Redis

---

#### **GET /api/payments/transactions/{transactionId}** - Get Transaction Details
Retrieves detailed information about a specific transaction.

**Request:**
```
GET /api/payments/transactions/9h5g8f6e-0e1d-8gc2-3i5d-6e7f8g9h0i1j
```

**Response (200 OK):**
```json
{
  "transactionId": "9h5g8f6e-0e1d-8gc2-3i5d-6e7f8g9h0i1j",
  "idempotencyKey": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fromUserId": "550e8400-e29b-41d4-a716-446655440001",
  "fromWalletId": "7f3e4d2c-5a6b-4c8d-9e0f-1a2b3c4d5e6f",
  "toUserId": "660e9500-f39c-52e5-b827-557766551112",
  "toWalletId": "8g4f7e5d-9d0c-7fb1-2h4c-5d6e7f8g9h0i",
  "amountCents": 25000000,
  "type": "TRANSFER",
  "status": "COMPLETED",
  "description": "Lunch payment",
  "fraudScore": 15,
  "fraudFlags": ["velocity_check_passed"],
  "completedAt": "2025-12-19T10:50:00Z",
  "createdAt": "2025-12-19T10:50:00Z",
  "ledgerEntries": [
    {
      "entryId": "entry-1",
      "walletId": "7f3e4d2c-5a6b-4c8d-9e0f-1a2b3c4d5e6f",
      "accountCode": "1110",
      "entryType": "DEBIT",
      "amountCents": 25000000,
      "description": "P2P transfer to 660e9500"
    },
    {
      "entryId": "entry-2",
      "walletId": "8g4f7e5d-9d0c-7fb1-2h4c-5d6e7f8g9h0i",
      "accountCode": "2110",
      "entryType": "CREDIT",
      "amountCents": 25000000,
      "description": "P2P transfer from 550e8400"
    }
  ]
}
```

---

## ⚠️ Error Responses

All errors follow a consistent format:

### **400 Bad Request** - Validation Error
```json
{
  "timestamp": "2025-12-19T10:50:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/payments/transfer",
  "errors": [
    {
      "field": "amountCents",
      "message": "Amount must be greater than 0"
    }
  ]
}
```

### **404 Not Found** - Resource Not Found
```json
{
  "timestamp": "2025-12-19T10:50:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Wallet not found with ID: 7f3e4d2c-5a6b-4c8d-9e0f-1a2b3c4d5e6f",
  "path": "/api/wallets/7f3e4d2c-5a6b-4c8d-9e0f-1a2b3c4d5e6f/balance"
}
```

### **409 Conflict** - Insufficient Balance
```json
{
  "timestamp": "2025-12-19T10:50:00Z",
  "status": 409,
  "error": "Conflict",
  "message": "Insufficient balance. Current: 500,000 VND, Required: 1,000,000 VND",
  "path": "/api/payments/transfer"
}
```

### **422 Unprocessable Entity** - Fraud Detection Block
```json
{
  "timestamp": "2025-12-19T10:50:00Z",
  "status": 422,
  "error": "Unprocessable Entity",
  "message": "Transaction blocked by fraud detection",
  "path": "/api/payments/transfer",
  "fraudScore": 85,
  "fraudFlags": [
    "High Amount 5M - 80 points (action: BLOCK)",
    "Round Amount Pattern - 15 points (action: FLAG)"
  ]
}
```

### **500 Internal Server Error**
```json
{
  "timestamp": "2025-12-19T10:50:00Z",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "path": "/api/payments/transfer"
}
```

---

## 🎨 Frontend Implementation Examples

### **React Example: Transfer Money**
```javascript
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TransferForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleTransfer = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8082/api/payments/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idempotencyKey: uuidv4(), // Generate unique key for each transfer
          fromUserId: formData.fromUserId,
          toUserId: formData.toUserId,
          amountCents: formData.amount * 100, // Convert VND to cents
          description: formData.description,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Transfer failed');
      }
      
      const result = await response.json();
      
      // Check fraud score
      if (result.fraudScore >= 70) {
        console.warn('High fraud score detected:', result.fraudScore);
        // Show warning to user
      }
      
      // Success
      console.log('Transfer completed:', result.transactionId);
      return result;
      
    } catch (err) {
      setError(err.message);
      console.error('Transfer error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    // Your form UI here
  );
};
```

### **Axios Example: Check Balance**
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082';

export const getWalletBalance = async (walletId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/wallets/${walletId}/balance`
    );
    
    return {
      balanceVND: response.data.balanceCents / 100,
      formatted: response.data.balance,
      lastUpdated: response.data.lastUpdated,
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Wallet not found');
    }
    throw new Error('Failed to fetch balance');
  }
};
```

### **Retry Logic Example (Using Idempotency)**
```javascript
const transferWithRetry = async (transferData, maxRetries = 3) => {
  const idempotencyKey = uuidv4(); // Generate once, reuse for retries
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('http://localhost:8082/api/payments/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...transferData,
          idempotencyKey, // Same key for all retries
        }),
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      // If 4xx error (client error), don't retry
      if (response.status >= 400 && response.status < 500) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      
      // Network error or 5xx, retry
      if (attempt < maxRetries) {
        console.log(`Retry attempt ${attempt}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
      }
      
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }
  
  throw new Error('Transfer failed after max retries');
};
```

---

## 🔒 Security Considerations

### **1. Idempotency Keys**
- **Generate on client side** using UUID v4
- **Store in browser** (sessionStorage) to retry on failure
- **Don't reuse** across different transfers
- **Example:**
  ```javascript
  const idempotencyKey = sessionStorage.getItem('transfer_key') || uuidv4();
  sessionStorage.setItem('transfer_key', idempotencyKey);
  
  // Clear after successful transfer
  sessionStorage.removeItem('transfer_key');
  ```

### **2. Amount Handling**
- **Always use cents** (amountCents) in API calls
- **Convert to VND** for display: `amountCents / 100`
- **Avoid floating point** math (use integers)
- **Example:**
  ```javascript
  // ❌ BAD
  const amountCents = 1000.50 * 100; // Float precision issues
  
  // ✅ GOOD
  const amountCents = Math.round(parseFloat(userInput) * 100);
  ```

### **3. Fraud Score Handling**
- **Score >= 80**: Transaction blocked (show error to user)
- **Score >= 70**: Transaction flagged (show warning, allow proceed)
- **Score < 70**: Normal transaction
- **Example:**
  ```javascript
  if (response.fraudScore >= 80) {
    alert('Transaction blocked: High fraud risk detected');
  } else if (response.fraudScore >= 70) {
    const proceed = confirm('Warning: This transaction has been flagged. Proceed?');
    if (!proceed) return;
  }
  ```

---

## 🧪 Testing the APIs

### **Using the Automated Test Script**
```powershell
# Prerequisites:
# 1. User Service running on port 8081
# 2. Payment Service running on port 8082
# 3. PostgreSQL and Redis running

cd C:\Users\duyth\FinTech\backend\java-services\payment-service
.\test-payment-api.ps1
```

**Expected Output:**
```
========================================
 Payment Service - E2E API Test
========================================

Total Tests:    15
Passed:         15
Failed:         0
Pass Rate:      100%
Duration:       18.5 seconds

🎉 ALL TESTS PASSED!
```

### **Manual Testing with cURL**

#### Create Wallet:
```bash
curl -X POST http://localhost:8082/api/wallets \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440001",
    "walletType": "PERSONAL"
  }'
```

#### Check Balance:
```bash
curl http://localhost:8082/api/wallets/7f3e4d2c-5a6b-4c8d-9e0f-1a2b3c4d5e6f/balance
```

#### Transfer Money:
```bash
curl -X POST http://localhost:8082/api/payments/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "idempotencyKey": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "fromUserId": "550e8400-e29b-41d4-a716-446655440001",
    "toUserId": "660e9500-f39c-52e5-b827-557766551112",
    "amountCents": 25000000,
    "description": "Test transfer"
  }'
```

---

## 📊 Fraud Detection Rules (8 Active Rules)

| Rule Name | Type | Threshold | Score | Action | Description |
|-----------|------|-----------|-------|--------|-------------|
| High Velocity 10/min | VELOCITY | 10 txns/min | 50 | FLAG | More than 10 transactions per minute |
| Rapid Succession | VELOCITY | 5 txns/min | 40 | FLAG | 5+ transactions in 1 minute |
| High Amount 5M | AMOUNT_THRESHOLD | 5M VND | 80 | BLOCK | Single transaction over 5M VND |
| Medium Amount 2M | AMOUNT_THRESHOLD | 2M VND | 50 | FLAG | Single transaction over 2M VND |
| Small Amount 100k | AMOUNT_THRESHOLD | 100k VND | 10 | ALLOW | Baseline for small amounts |
| Round Amount Pattern | PATTERN_MATCH | Ends in 000000 | 15 | FLAG | Suspicious round numbers |
| Even Amount Pattern | PATTERN_MATCH | Ends in 00000 | 5 | ALLOW | Common even amounts |
| Midnight Activity | VELOCITY | 00:00-05:00 | 30 | FLAG | Unusual activity hours |

**Scoring Logic:**
- Scores accumulate across all triggered rules
- **Score >= 80**: Transaction blocked automatically
- **Score >= 70**: Transaction flagged for manual review
- **Score < 70**: Transaction allowed

---

## 🔗 Related Documentation

- **[API Testing Guide](./API_TESTING_GUIDE.md)** - Detailed API testing scenarios
- **[Test Script](./test-payment-api.ps1)** - Automated E2E test script
- **[Implementation Plan](./PAYMENT_SERVICE_IMPLEMENTATION_PLAN.md)** - Full service architecture
- **[Day 11 Report](./DAY11_API_TESTING_COMPLETION_REPORT.md)** - Test completion status

---

## 🆘 Support & Troubleshooting

### **Common Issues:**

1. **"Wallet not found" error**
   - Ensure User Service is running (port 8081)
   - Verify userId exists in User Service
   - Check wallet was created successfully

2. **"Insufficient balance" error**
   - Check current balance: `GET /api/wallets/{walletId}/balance`
   - Verify amount doesn't exceed balance
   - Remember amounts are in cents (multiply by 100)

3. **"Transaction blocked by fraud detection"**
   - Check `fraudScore` and `fraudFlags` in response
   - Review triggered rules in table above
   - Lower amount or wait before retrying

4. **Duplicate transaction despite different idempotency key**
   - This should NOT happen (file a bug)
   - Check Redis cache is working
   - Verify keys are truly unique (UUID v4)

### **Health Check:**
```bash
# Check service status
curl http://localhost:8082/actuator/health

# Expected response:
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" },
    "redis": { "status": "UP" }
  }
}
```

---

## 📅 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Dec 19, 2025 | Initial release with wallet management, P2P transfers, and fraud detection |

---

**Questions?** Contact the backend team or refer to the [API Testing Guide](./API_TESTING_GUIDE.md).
