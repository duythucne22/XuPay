# XuPay User Service - Complete API Reference

> **Version:** 1.0.0  
> **Port:** 8081 (HTTP REST), 9091 (gRPC)  
> **Database:** PostgreSQL 15+ (user_db)  
> **Authentication:** JWT (24-hour expiry)

---

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Authentication API](#authentication-api)
3. [User Management API](#user-management-api)
4. [KYC Verification API](#kyc-verification-api)
5. [Transaction Limits API](#transaction-limits-api)
6. [PowerShell Testing Guide](#powershell-testing-guide)
7. [API Testing Workflow](#api-testing-workflow)

---

## 🚀 Quick Start

### Start the Service

```powershell
# Navigate to project directory
cd C:\Users\duyth\FinTech\backend\java-services\user-service

# Build and run
mvn clean install -DskipTests
mvn spring-boot:run
```

### Access Documentation
- **Swagger UI:** http://localhost:8081/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8081/v3/api-docs
- **Health Check:** http://localhost:8081/health

---

## 🔐 Authentication API

### Base URL
```
http://localhost:8081/api/auth
```

### 1. Register New User

**Endpoint:** `POST /api/auth/register`  
**Auth Required:** No  
**Returns:** JWT token + user details

**PowerShell Request:**
```powershell
$registerBody = @{
    email = "john.doe@example.com"
    password = "SecurePassword123!"
    firstName = "John"
    lastName = "Doe"
    phone = "+1234567890"
    dateOfBirth = "1990-01-01"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $registerBody

# Save token for later use
$token = $response.token
Write-Host "Token: $token"
Write-Host "User ID: $($response.user.id)"
Write-Host "KYC Status: $($response.user.kycStatus)"
Write-Host "KYC Tier: $($response.user.kycTier)"
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "kycStatus": "PENDING",
    "kycTier": "TIER_0",
    "isActive": true,
    "createdAt": "2025-12-18T10:00:00Z"
  }
}
```

---

### 2. Login

**Endpoint:** `POST /api/auth/login`  
**Auth Required:** No  
**Returns:** JWT token + user details

**PowerShell Request:**
```powershell
$loginBody = @{
    email = "john.doe@example.com"
    password = "SecurePassword123!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody

$token = $response.token
Write-Host "Login successful! Token: $token"
```

**Expected Response:** Same as register response

---

### 3. Get Current User

**Endpoint:** `GET /api/auth/me`  
**Auth Required:** Yes (Bearer token)  
**Returns:** Current user details

**PowerShell Request:**
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/me" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $token"
    }

Write-Host "Email: $($response.email)"
Write-Host "KYC Status: $($response.kycStatus)"
Write-Host "KYC Tier: $($response.kycTier)"
```

---

### 4. Validate Token

**Endpoint:** `GET /api/auth/validate`  
**Auth Required:** Yes (Bearer token)  
**Returns:** Token validation result

**PowerShell Request:**
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/validate" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $token"
    }

Write-Host "Valid: $($response.valid)"
Write-Host "Email: $($response.email)"
```

---

### 5. Logout

**Endpoint:** `POST /api/auth/logout`  
**Auth Required:** Yes (Bearer token)  
**Returns:** Success message

**PowerShell Request:**
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/logout" `
    -Method POST `
    -Headers @{
        "Authorization" = "Bearer $token"
    }

Write-Host $response.message
```

---

## 👤 User Management API

### Base URL
```
http://localhost:8081/api/users
```

### 1. Get User Profile

**Endpoint:** `GET /api/users/profile`  
**Auth Required:** Yes  

**PowerShell Request:**
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8081/api/users/profile" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $token"
    }

Write-Host "Profile: $($response | ConvertTo-Json)"
```

---

### 2. Update User Profile

**Endpoint:** `PUT /api/users/profile`  
**Auth Required:** Yes  

**PowerShell Request:**
```powershell
$updateBody = @{
    firstName = "John Updated"
    lastName = "Doe Updated"
    phone = "+1234567891"
    dateOfBirth = "1990-01-01"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/users/profile" `
    -Method PUT `
    -ContentType "application/json" `
    -Headers @{
        "Authorization" = "Bearer $token"
    } `
    -Body $updateBody

Write-Host "Profile updated: $($response | ConvertTo-Json)"
```

---

### 3. Add Contact

**Endpoint:** `POST /api/users/contacts`  
**Auth Required:** Yes  

**PowerShell Request:**
```powershell
$contactBody = @{
    contactUserId = "987e6543-e21b-12d3-a456-426614174111"
    nickname = "Jane Smith"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/users/contacts" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{
        "Authorization" = "Bearer $token"
    } `
    -Body $contactBody

Write-Host "Contact added: $($response | ConvertTo-Json)"
```

---

### 4. Get Contacts

**Endpoint:** `GET /api/users/contacts`  
**Auth Required:** Yes  

**PowerShell Request:**
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8081/api/users/contacts" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $token"
    }

Write-Host "Contacts: $($response | ConvertTo-Json)"
```

---

## 📄 KYC Verification API

### Base URL
```
http://localhost:8081/api/kyc
```

### 1. Upload KYC Document

**Endpoint:** `POST /api/kyc/upload-document`  
**Auth Required:** Yes  

**PowerShell Request:**
```powershell
$kycBody = @{
    documentType = "PASSPORT"
    documentNumber = "AB123456"
    fileUrl = "https://s3.example.com/docs/passport.pdf"
    fileSizeBytes = 2048000
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/kyc/upload-document" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{
        "Authorization" = "Bearer $token"
    } `
    -Body $kycBody

$docId = $response.id
Write-Host "Document uploaded. ID: $docId"
Write-Host "Status: $($response.verificationStatus)"
```

---

### 2. Get My KYC Documents

**Endpoint:** `GET /api/kyc/my-documents`  
**Auth Required:** Yes  

**PowerShell Request:**
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8081/api/kyc/my-documents" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $token"
    }

foreach ($doc in $response) {
    Write-Host "Document ID: $($doc.id)"
    Write-Host "Type: $($doc.documentType)"
    Write-Host "Status: $($doc.verificationStatus)"
    Write-Host "---"
}
```

---

### 3. Get Single Document

**Endpoint:** `GET /api/kyc/document/{documentId}`  
**Auth Required:** Yes  

**PowerShell Request:**
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8081/api/kyc/document/$docId" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $token"
    }

Write-Host "Document: $($response | ConvertTo-Json)"
```

---

### 4. Approve Document (Admin Only)

**Endpoint:** `PUT /api/kyc/approve/{documentId}`  
**Auth Required:** Yes (Admin role)  

**PowerShell Request:**
```powershell
$approveBody = @{
    notes = "Document verified successfully"
    upgradeTier = "TIER_1"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/kyc/approve/$docId" `
    -Method PUT `
    -ContentType "application/json" `
    -Headers @{
        "Authorization" = "Bearer $adminToken"
    } `
    -Body $approveBody

Write-Host "Document approved: $($response | ConvertTo-Json)"
```

---

### 5. Reject Document (Admin Only)

**Endpoint:** `PUT /api/kyc/reject/{documentId}`  
**Auth Required:** Yes (Admin role)  

**PowerShell Request:**
```powershell
$rejectBody = @{
    reason = "Document is expired"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/kyc/reject/$docId" `
    -Method PUT `
    -ContentType "application/json" `
    -Headers @{
        "Authorization" = "Bearer $adminToken"
    } `
    -Body $rejectBody

Write-Host "Document rejected: $($response | ConvertTo-Json)"
```

---

### 6. Get Pending Documents (Admin Only)

**Endpoint:** `GET /api/kyc/pending`  
**Auth Required:** Yes (Admin role)  

**PowerShell Request:**
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8081/api/kyc/pending" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $adminToken"
    }

Write-Host "Pending documents: $($response.Count)"
foreach ($doc in $response) {
    Write-Host "Doc ID: $($doc.id) - User: $($doc.userId)"
}
```

---

## 💰 Transaction Limits API

### Base URL
```
http://localhost:8081/api/users
```

### 1. Get User Limits

**Endpoint:** `GET /api/users/limits`  
**Auth Required:** Yes  

**PowerShell Request:**
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8081/api/users/limits" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $token"
    }

Write-Host "KYC Tier: $($response.tier)"
Write-Host "Daily Send Limit: $($response.dailySendLimitCents / 100) USD"
Write-Host "Daily Receive Limit: $($response.dailyReceiveLimitCents / 100) USD"
Write-Host "Single Transaction Max: $($response.singleTransactionMaxCents / 100) USD"
Write-Host "Can Send International: $($response.canSendInternational)"
Write-Host "Requires 2FA: $($response.requires2fa)"
```

---

### 2. Get Daily Usage

**Endpoint:** `GET /api/users/daily-usage`  
**Auth Required:** Yes  

**PowerShell Request:**
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8081/api/users/daily-usage" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $token"
    }

Write-Host "Usage Date: $($response.usageDate)"
Write-Host "Total Sent Today: $($response.totalSentCents / 100) USD"
Write-Host "Total Received Today: $($response.totalReceivedCents / 100) USD"
Write-Host "Transaction Count: $($response.transactionCount)"
Write-Host "Daily Limit: $($response.dailyLimitCents / 100) USD"
Write-Host "Remaining: $($response.remainingLimitCents / 100) USD"
```

---

### 3. Check Transaction Limit

**Endpoint:** `POST /api/users/check-limit`  
**Auth Required:** Yes  

**PowerShell Request:**
```powershell
$checkBody = @{
    amountCents = 150000  # $1500
    type = "send"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/users/check-limit" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{
        "Authorization" = "Bearer $token"
    } `
    -Body $checkBody

if ($response.allowed) {
    Write-Host "Transaction ALLOWED"
    Write-Host "Remaining after transaction: $($response.remainingDailyLimit / 100) USD"
} else {
    Write-Host "Transaction BLOCKED"
    Write-Host "Reason: $($response.reason)"
}
```

---

## 🧪 PowerShell Testing Guide

### Complete Testing Script

Save this as `test-user-api.ps1`:

```powershell
# XuPay User Service - Complete API Test Script
# Run this script to test all API endpoints

$baseUrl = "http://localhost:8081"
$email = "test-$(Get-Random)@example.com"  # Random email for each test
$password = "SecurePassword123!"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "XuPay User Service API Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "[1/10] Testing Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✓ Service is healthy" -ForegroundColor Green
} catch {
    Write-Host "✗ Health check failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: Register
Write-Host "[2/10] Testing User Registration..." -ForegroundColor Yellow
$registerBody = @{
    email = $email
    password = $password
    firstName = "Test"
    lastName = "User"
    phone = "+1234567890"
    dateOfBirth = "1990-01-01"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody
    
    $token = $registerResponse.token
    $userId = $registerResponse.user.id
    
    Write-Host "✓ User registered successfully" -ForegroundColor Green
    Write-Host "  User ID: $userId" -ForegroundColor Gray
    Write-Host "  KYC Status: $($registerResponse.user.kycStatus)" -ForegroundColor Gray
    Write-Host "  KYC Tier: $($registerResponse.user.kycTier)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Registration failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 3: Login
Write-Host "[3/10] Testing User Login..." -ForegroundColor Yellow
$loginBody = @{
    email = $email
    password = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    
    $token = $loginResponse.token
    Write-Host "✓ Login successful" -ForegroundColor Green
} catch {
    Write-Host "✗ Login failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 4: Get Current User
Write-Host "[4/10] Testing Get Current User..." -ForegroundColor Yellow
try {
    $currentUser = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token" }
    
    Write-Host "✓ Current user retrieved" -ForegroundColor Green
    Write-Host "  Email: $($currentUser.email)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Get current user failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 5: Validate Token
Write-Host "[5/10] Testing Token Validation..." -ForegroundColor Yellow
try {
    $validation = Invoke-RestMethod -Uri "$baseUrl/api/auth/validate" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token" }
    
    Write-Host "✓ Token is valid" -ForegroundColor Green
} catch {
    Write-Host "✗ Token validation failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 6: Get User Profile
Write-Host "[6/10] Testing Get User Profile..." -ForegroundColor Yellow
try {
    $profile = Invoke-RestMethod -Uri "$baseUrl/api/users/profile" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token" }
    
    Write-Host "✓ Profile retrieved" -ForegroundColor Green
} catch {
    Write-Host "✗ Get profile failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 7: Upload KYC Document
Write-Host "[7/10] Testing KYC Document Upload..." -ForegroundColor Yellow
$kycBody = @{
    documentType = "PASSPORT"
    documentNumber = "AB123456"
    fileUrl = "https://s3.example.com/docs/passport.pdf"
    fileSizeBytes = 2048000
} | ConvertTo-Json

try {
    $kycDoc = Invoke-RestMethod -Uri "$baseUrl/api/kyc/upload-document" `
        -Method POST `
        -ContentType "application/json" `
        -Headers @{ "Authorization" = "Bearer $token" } `
        -Body $kycBody
    
    $docId = $kycDoc.id
    Write-Host "✓ KYC document uploaded" -ForegroundColor Green
    Write-Host "  Document ID: $docId" -ForegroundColor Gray
    Write-Host "  Status: $($kycDoc.verificationStatus)" -ForegroundColor Gray
} catch {
    Write-Host "✗ KYC upload failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 8: Get My Documents
Write-Host "[8/10] Testing Get My KYC Documents..." -ForegroundColor Yellow
try {
    $myDocs = Invoke-RestMethod -Uri "$baseUrl/api/kyc/my-documents" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token" }
    
    Write-Host "✓ Retrieved $($myDocs.Count) document(s)" -ForegroundColor Green
} catch {
    Write-Host "✗ Get documents failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 9: Get User Limits
Write-Host "[9/10] Testing Get User Limits..." -ForegroundColor Yellow
try {
    $limits = Invoke-RestMethod -Uri "$baseUrl/api/users/limits" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token" }
    
    Write-Host "✓ Limits retrieved" -ForegroundColor Green
    Write-Host "  Tier: $($limits.tier)" -ForegroundColor Gray
    Write-Host "  Daily Send Limit: $($limits.dailySendLimitCents / 100) USD" -ForegroundColor Gray
    Write-Host "  Single Transaction Max: $($limits.singleTransactionMaxCents / 100) USD" -ForegroundColor Gray
} catch {
    Write-Host "✗ Get limits failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 10: Check Transaction Limit
Write-Host "[10/10] Testing Check Transaction Limit..." -ForegroundColor Yellow
$checkBody = @{
    amountCents = 50000  # $500
    type = "send"
} | ConvertTo-Json

try {
    $limitCheck = Invoke-RestMethod -Uri "$baseUrl/api/users/check-limit" `
        -Method POST `
        -ContentType "application/json" `
        -Headers @{ "Authorization" = "Bearer $token" } `
        -Body $checkBody
    
    if ($limitCheck.allowed) {
        Write-Host "✓ Transaction allowed" -ForegroundColor Green
        Write-Host "  Remaining: $($limitCheck.remainingDailyLimit / 100) USD" -ForegroundColor Gray
    } else {
        Write-Host "✓ Limit check working (transaction blocked)" -ForegroundColor Green
        Write-Host "  Reason: $($limitCheck.reason)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Check limit failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All tests passed! ✓" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
```

### Run the Test Script

```powershell
# Make sure service is running first
cd C:\Users\duyth\FinTech\backend\java-services\user-service
mvn spring-boot:run

# In another terminal, run the test script
.\test-user-api.ps1
```

---

## 📋 API Testing Workflow

### Typical User Journey

1. **Register** → Get JWT token + User ID (TIER_0, PENDING)
2. **Upload KYC Document** → Document status = PENDING
3. **Admin Approves** → User upgraded to TIER_1, KYC = APPROVED
4. **Check Limits** → See daily send limit increased from $500 → $5000
5. **Make Transaction** → Payment Service validates via gRPC
6. **Check Daily Usage** → See remaining limit updated

### KYC Tiers & Limits

| Tier | Daily Send | Daily Receive | Single Max | International | Requires 2FA |
|------|-----------|---------------|-----------|---------------|--------------|
| TIER_0 | $500 | $2,000 | $250 | ❌ | ❌ |
| TIER_1 | $5,000 | $10,000 | $1,000 | ❌ | ❌ |
| TIER_2 | $50,000 | $100,000 | $10,000 | ✅ | ✅ |
| TIER_3 | $100,000 | $500,000 | $25,000 | ✅ | ✅ |

---

## 🔒 Security Notes

1. **JWT Expiry:** Tokens expire after 24 hours
2. **HTTPS Required:** Production must use HTTPS only
3. **Rate Limiting:** 100 requests/minute per IP
4. **CORS:** Configured for allowed origins only
5. **SQL Injection:** Protected by parameterized queries
6. **XSS:** Protected by Spring Security headers

---

## 🐛 Troubleshooting

### Common Issues

**401 Unauthorized:**
- Token expired (re-login required)
- Missing "Bearer " prefix in Authorization header
- Invalid token format

**403 Forbidden:**
- Admin-only endpoint accessed by regular user
- Suspended account

**409 Conflict:**
- Email already registered
- Phone number already in use

**400 Bad Request:**
- Missing required fields
- Invalid data format (e.g., invalid email, past date for future events)

---

## 📞 Support

- **Email:** dev@xupay.com
- **Slack:** #user-service-support
- **Documentation:** http://localhost:8081/swagger-ui.html

---
