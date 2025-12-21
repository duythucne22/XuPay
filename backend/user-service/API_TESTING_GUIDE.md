# User Service API Testing Guide
> **Service:** User Service  
> **Base URL:** http://localhost:8081  
> **Protocol:** REST + gRPC  
> **Authentication:** JWT Bearer Token

---

## 🚀 Quick Start

### Prerequisites
```powershell
# 1. Start PostgreSQL (Docker)
cd C:\Users\duyth\FinTech
docker-compose up -d postgres

# 2. Start User Service
cd backend\java-services\user-service
.\mvnw.cmd spring-boot:run

# 3. Verify service is running
curl http://localhost:8081/actuator/health
```

---

## 📋 Test Scenarios (Step-by-Step)

### **Scenario 1: User Registration & Login**

#### 1.1 Register New User (John Doe)
```powershell
$registerBody = @{
    firstName = "John"
    lastName = "Doe"
    email = "john.doe@example.com"
    phone = "+1234567890"
    password = "SecurePass123!"
    dateOfBirth = "1990-01-15"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $registerBody

# Save JWT token
$token = $response.token
Write-Host "✅ User registered successfully. User ID: $($response.user.id)"
Write-Host "JWT Token: $token"
```

**Expected Response (201 Created):**
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
    "isSuspended": false,
    "fraudScore": 0,
    "createdAt": "2025-12-18T10:30:00Z"
  }
}
```

#### 1.2 Register Duplicate Email (Should Fail)
```powershell
$duplicateBody = @{
    firstName = "Jane"
    lastName = "Smith"
    email = "john.doe@example.com"  # Same email
    phone = "+9876543210"
    password = "AnotherPass123!"
    dateOfBirth = "1992-05-20"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8081/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $duplicateBody
} catch {
    Write-Host "❌ Expected error: Duplicate email"
    $_.Exception.Response.StatusCode  # Should be 409 Conflict
}
```

**Expected Response (409 Conflict):**
```json
{
  "timestamp": "2025-12-18T10:31:00Z",
  "status": 409,
  "error": "Conflict",
  "message": "Email already exists: john.doe@example.com",
  "path": "/api/auth/register"
}
```

#### 1.3 Login with Valid Credentials
```powershell
$loginBody = @{
    email = "john.doe@example.com"
    password = "SecurePass123!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody

$token = $response.token
Write-Host "✅ Login successful. Token: $token"
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "kycStatus": "PENDING",
    "kycTier": "TIER_0",
    "lastLoginAt": "2025-12-18T10:32:00Z"
  }
}
```

#### 1.4 Login with Invalid Password (Should Fail)
```powershell
$invalidLoginBody = @{
    email = "john.doe@example.com"
    password = "WrongPassword123!"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $invalidLoginBody
} catch {
    Write-Host "❌ Expected error: Invalid credentials"
    $_.Exception.Response.StatusCode  # Should be 401 Unauthorized
}
```

#### 1.5 Get Current User Profile (Requires JWT)
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/me" `
    -Method GET `
    -Headers $headers

Write-Host "✅ Current user: $($response.email)"
```

---

### **Scenario 2: KYC Document Upload & Verification**

#### 2.1 Upload KYC Document (Passport)
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

$kycBody = @{
    documentType = "PASSPORT"
    documentNumber = "AB1234567"
    issuingCountry = "US"
    documentUrl = "https://s3.amazonaws.com/kyc-docs/john-passport.jpg"
    fileSizeBytes = 2048576
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/kyc/upload-document" `
    -Method POST `
    -Headers $headers `
    -ContentType "application/json" `
    -Body $kycBody

$documentId = $response.id
Write-Host "✅ Document uploaded. ID: $documentId, Status: $($response.verificationStatus)"
```

**Expected Response (201 Created):**
```json
{
  "id": "789e4567-e89b-12d3-a456-426614174001",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "documentType": "PASSPORT",
  "documentNumber": "AB1234567",
  "issuingCountry": "US",
  "verificationStatus": "PENDING",
  "expiryDate": "2027-12-18T10:35:00Z",
  "uploadedAt": "2025-12-18T10:35:00Z"
}
```

#### 2.2 Get User's KYC Documents
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/kyc/documents" `
    -Method GET `
    -Headers $headers

Write-Host "✅ Found $($response.Count) documents"
$response | ForEach-Object {
    Write-Host "  - $($_.documentType): $($_.verificationStatus)"
}
```

#### 2.3 Get Specific Document
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/kyc/$documentId" `
    -Method GET `
    -Headers $headers

Write-Host "✅ Document status: $($response.verificationStatus)"
```

#### 2.4 Admin: Get Pending Documents Queue (Requires Admin Token)
```powershell
# Note: This requires admin JWT token
$adminHeaders = @{
    "Authorization" = "Bearer $adminToken"
}

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/kyc/pending" `
    -Method GET `
    -Headers $adminHeaders

Write-Host "✅ Pending documents: $($response.Count)"
```

#### 2.5 Admin: Approve KYC Document
```powershell
# Approve document and upgrade user to TIER_1
$adminHeaders = @{
    "Authorization" = "Bearer $adminToken"
}

$approveBody = @{
    notes = "Identity verified successfully"
    upgradeTier = "TIER_1"  # Optional: custom tier
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/kyc/$documentId/approve" `
    -Method POST `
    -Headers $adminHeaders `
    -ContentType "application/json" `
    -Body $approveBody

Write-Host "✅ Document approved. New status: $($response.verificationStatus)"
```

#### 2.6 Admin: Reject KYC Document
```powershell
$adminHeaders = @{
    "Authorization" = "Bearer $adminToken"
}

$rejectBody = @{
    reason = "Document image is blurry and unreadable"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/kyc/$documentId/reject" `
    -Method POST `
    -Headers $adminHeaders `
    -ContentType "application/json" `
    -Body $rejectBody

Write-Host "❌ Document rejected. Reason: $($response.rejectionReason)"
```

---

### **Scenario 3: Transaction Limits & Usage**

#### 3.1 Get User's Transaction Limits
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/users/me/limits" `
    -Method GET `
    -Headers $headers

Write-Host "✅ User Tier: $($response.tier)"
Write-Host "   Daily Send Limit: $($response.dailySendLimitCents / 100)"
Write-Host "   Single Transaction Max: $($response.singleTransactionMaxCents / 100)"
```

**Expected Response (200 OK):**
```json
{
  "tier": "TIER_1",
  "dailySendLimitCents": 500000,
  "dailyReceiveLimitCents": 1000000,
    "monthlyVolumeLimitCents": 10000000,
  "singleTransactionMaxCents": 100000,
    "maxTransactionsPerHour": 10,
    "maxTransactionsPerDay": 50,
    "canSendInternational": false,
    "canReceiveMerchantPayments": false
}
```

#### 3.2 Get Daily Usage
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/users/me/daily-usage" `
    -Method GET `
    -Headers $headers

Write-Host "✅ Today's Usage:"
Write-Host "   Sent: $($response.totalSentCents / 100)"
Write-Host "   Received: $($response.totalReceivedCents / 100)"
Write-Host "   Remaining: $($response.remainingLimitCents / 100)"
```

#### 3.3 Check if Transaction is Allowed
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

# Check if user can send $1500
$checkBody = @{
    amountCents = 150000
    transactionType = "send"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/users/me/check-limit" `
    -Method POST `
    -Headers $headers `
    -ContentType "application/json" `
    -Body $checkBody

if ($response.allowed) {
    Write-Host "✅ Transaction allowed. Remaining: $($response.remainingDailyLimit / 100)"
} else {
    Write-Host "❌ Transaction blocked. Reason: $($response.reason)"
}
```

---

### **Scenario 4: User Profile Management**

#### 4.1 Get User Profile
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/users/me/profile" `
    -Method GET `
    -Headers $headers

Write-Host "✅ Profile: $($response.firstName) $($response.lastName)"
Write-Host "   Email: $($response.email)"
Write-Host "   KYC Tier: $($response.kycTier)"
```

#### 4.2 Update Profile
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

$updateBody = @{
    firstName = "John"
    lastName = "Doe-Updated"
    phone = "+1234567890"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/users/me/profile" `
    -Method PUT `
    -Headers $headers `
    -ContentType "application/json" `
    -Body $updateBody

Write-Host "✅ Profile updated: $($response.lastName)"
```

#### 4.3 Get User by ID
Not implemented in this service. Use `/api/auth/me` for the current user.

---

### **Scenario 5: Contact Management**

#### 5.1 Add Frequent Contact
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

$contactBody = @{
    contactUserId = "456e4567-e89b-12d3-a456-426614174002"
    nickname = "Mom"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/users/me/contacts" `
    -Method POST `
    -Headers $headers `
    -ContentType "application/json" `
    -Body $contactBody

Write-Host "✅ Contact added: $($response.nickname)"
```

#### 5.2 Get All Contacts
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/users/me/contacts" `
    -Method GET `
    -Headers $headers

Write-Host "✅ Contacts: $($response.Count)"
$response | ForEach-Object {
    Write-Host "  - $($_.nickname): $($_.contactEmail)"
}
```

#### 5.3 Delete Contact
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}


$contactId = "789e4567-e89b-12d3-a456-426614174003"

Invoke-RestMethod -Uri "http://localhost:8081/api/users/me/contacts/$contactId" `
    -Method DELETE `
    -Headers $headers

Write-Host "✅ Contact deleted"
```

---

## 🔐 JWT Token Management

### Extract JWT Claims (for debugging)
```powershell
$token = "eyJhbGciOiJIUzI1NiJ9..."

# Decode JWT payload (Base64)
$parts = $token.Split('.')
$payload = $parts[1]
$payload = $payload.Replace('-', '+').Replace('_', '/')

# Add padding if needed
while ($payload.Length % 4 -ne 0) {
    $payload += '='
}

$decodedBytes = [System.Convert]::FromBase64String($payload)
$decodedText = [System.Text.Encoding]::UTF8.GetString($decodedBytes)
$claims = $decodedText | ConvertFrom-Json

Write-Host "JWT Claims:"
Write-Host "  Email: $($claims.sub)"
Write-Host "  User ID: $($claims.userId)"
Write-Host "  Issued At: $([DateTimeOffset]::FromUnixTimeSeconds($claims.iat).LocalDateTime)"
Write-Host "  Expires At: $([DateTimeOffset]::FromUnixTimeSeconds($claims.exp).LocalDateTime)"
```

---

## 🧪 Error Testing Scenarios

### Test 1: Unauthorized Access (No JWT Token)
```powershell
try {
    Invoke-RestMethod -Uri "http://localhost:8081/api/users/profile" `
        -Method GET
} catch {
    Write-Host "❌ Expected error: 401 Unauthorized"
    $_.Exception.Response.StatusCode
}
```

### Test 2: Invalid JWT Token
```powershell
$headers = @{
    "Authorization" = "Bearer invalid.jwt.token"
}

try {
    Invoke-RestMethod -Uri "http://localhost:8081/api/users/profile" `
        -Method GET `
        -Headers $headers
} catch {
    Write-Host "❌ Expected error: 401 Unauthorized - Invalid token"
}
```

### Test 3: Expired JWT Token
```powershell
$expiredToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIiwiZXhwIjoxNjM5MzQ1NjAwfQ..."

$headers = @{
    "Authorization" = "Bearer $expiredToken"
}

try {
    Invoke-RestMethod -Uri "http://localhost:8081/api/users/profile" `
        -Method GET `
        -Headers $headers
} catch {
    Write-Host "❌ Expected error: 401 Unauthorized - Token expired"
}
```

### Test 4: Validation Errors (Invalid Email Format)
```powershell
$invalidBody = @{
    firstName = "Test"
    lastName = "User"
    email = "not-an-email"  # Invalid format
    password = "Pass123!"
    dateOfBirth = "1990-01-01"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8081/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $invalidBody
} catch {
    Write-Host "❌ Expected error: 400 Bad Request - Invalid email"
}
```

---

## 📊 Complete Test Script

Save this as `test-user-service.ps1`:

```powershell
# User Service API Complete Test Script
$ErrorActionPreference = "Continue"
$baseUrl = "http://localhost:8081"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "USER SERVICE API TEST SUITE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "[1/10] Testing health endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/actuator/health"
    Write-Host "✅ Service is UP" -ForegroundColor Green
} catch {
    Write-Host "❌ Service is DOWN" -ForegroundColor Red
    exit 1
}

# Test 2: Register User
Write-Host "`n[2/10] Registering new user..." -ForegroundColor Yellow
$registerBody = @{
    firstName = "John"
    lastName = "Doe"
    email = "john.doe.test@example.com"
    phone = "+1234567890"
    password = "SecurePass123!"
    dateOfBirth = "1990-01-15"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody
    
    $token = $registerResponse.token
    $userId = $registerResponse.user.id
    Write-Host "✅ User registered: $userId" -ForegroundColor Green
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Login
Write-Host "`n[3/10] Testing login..." -ForegroundColor Yellow
$loginBody = @{
    email = "john.doe.test@example.com"
    password = "SecurePass123!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    
    $token = $loginResponse.token
    Write-Host "✅ Login successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed" -ForegroundColor Red
}

# Test 4: Get Current User
Write-Host "`n[4/10] Testing /api/auth/me..." -ForegroundColor Yellow
$headers = @{ "Authorization" = "Bearer $token" }

try {
    $meResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ Current user: $($meResponse.email)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get current user" -ForegroundColor Red
}

# Test 5: Get Transaction Limits
Write-Host "`n[5/10] Testing /api/users/limits..." -ForegroundColor Yellow
try {
    $limitsResponse = Invoke-RestMethod -Uri "$baseUrl/api/users/limits" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ Tier: $($limitsResponse.tier), Daily Limit: $$($limitsResponse.dailySendLimitCents / 100)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get limits" -ForegroundColor Red
}

# Test 6: Upload KYC Document
Write-Host "`n[6/10] Testing KYC document upload..." -ForegroundColor Yellow
$kycBody = @{
    documentType = "PASSPORT"
    documentNumber = "AB1234567"
    issuingCountry = "US"
    documentUrl = "https://example.com/doc.jpg"
    fileSizeBytes = 2048576
} | ConvertTo-Json

try {
    $kycResponse = Invoke-RestMethod -Uri "$baseUrl/api/kyc/upload-document" `
        -Method POST `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $kycBody
    
    $documentId = $kycResponse.id
    Write-Host "✅ Document uploaded: $documentId" -ForegroundColor Green
} catch {
    Write-Host "❌ Document upload failed" -ForegroundColor Red
}

# Test 7: Get User Documents
Write-Host "`n[7/10] Testing /api/kyc/my-documents..." -ForegroundColor Yellow
try {
    $docsResponse = Invoke-RestMethod -Uri "$baseUrl/api/kyc/my-documents" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ Found $($docsResponse.Count) documents" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get documents" -ForegroundColor Red
}

# Test 8: Check Transaction Limit
Write-Host "`n[8/10] Testing limit check..." -ForegroundColor Yellow
$checkBody = @{
    amountCents = 50000
    transactionType = "send"
} | ConvertTo-Json

try {
    $checkResponse = Invoke-RestMethod -Uri "$baseUrl/api/users/check-limit" `
        -Method POST `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $checkBody
    
    if ($checkResponse.allowed) {
        Write-Host "✅ Transaction allowed" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Transaction blocked: $($checkResponse.reason)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Limit check failed" -ForegroundColor Red
}

# Test 9: Update Profile
Write-Host "`n[9/10] Testing profile update..." -ForegroundColor Yellow
$updateBody = @{
    firstName = "John"
    lastName = "Doe-Updated"
    phone = "+1234567890"
} | ConvertTo-Json

try {
    $updateResponse = Invoke-RestMethod -Uri "$baseUrl/api/users/profile" `
        -Method PUT `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $updateBody
    
    Write-Host "✅ Profile updated" -ForegroundColor Green
} catch {
    Write-Host "❌ Profile update failed" -ForegroundColor Red
}

# Test 10: Error Testing (Duplicate Email)
Write-Host "`n[10/10] Testing error handling (duplicate email)..." -ForegroundColor Yellow
$duplicateBody = @{
    firstName = "Jane"
    lastName = "Smith"
    email = "john.doe.test@example.com"  # Duplicate
    phone = "+9876543210"
    password = "Pass123!"
    dateOfBirth = "1992-05-20"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $duplicateBody
    Write-Host "❌ Should have failed with duplicate email error" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "✅ Correctly returned 409 Conflict" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Unexpected error: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST SUITE COMPLETE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
```

---

## 🎯 Next Steps

1. **Run the complete test script:**
   ```powershell
   .\test-user-service.ps1
   ```

2. **Test with Postman:**
   - Import the collection from the attached JSON
   - Set `{{baseUrl}}` = `http://localhost:8081`
   - Set `{{token}}` = JWT from login response

3. **Monitor logs:**
   ```powershell
   # In the terminal where Spring Boot is running
   # Watch for INFO/DEBUG logs
   ```

4. **Check database:**
   ```powershell
   # Connect to PostgreSQL
   docker exec -it postgres psql -U xupay -d user_db
   
   # Check users
   SELECT id, email, kyc_status, kyc_tier FROM users;
   
   # Check KYC documents
   SELECT id, user_id, document_type, verification_status FROM kyc_documents;
   ```
