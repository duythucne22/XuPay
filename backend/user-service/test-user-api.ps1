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
    $health = Invoke-RestMethod -Uri "$baseUrl/actuator/health" -Method GET
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
    $userId = $registerResponse.userId
    
    Write-Host "✓ User registered successfully" -ForegroundColor Green
    Write-Host "  User ID: $userId" -ForegroundColor Gray
    Write-Host "  Email: $($registerResponse.email)" -ForegroundColor Gray
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
    Write-Host "  Email: $($currentUser.email)" -ForegroundColor Gray    Write-Host "  Name: $($currentUser.firstName) $($currentUser.lastName)" -ForegroundColor Gray} catch {
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
    $profile = Invoke-RestMethod -Uri "$baseUrl/api/users/me/profile" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token" }
    
    Write-Host "✓ Profile retrieved" -ForegroundColor Green    Write-Host "  Name: $($profile.firstName) $($profile.lastName)" -ForegroundColor Gray
    Write-Host "  KYC Tier: $($profile.kycTier)" -ForegroundColor Gray} catch {
    Write-Host "✗ Get profile failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 7: Upload KYC Document
Write-Host "[7/10] Testing KYC Document Upload..." -ForegroundColor Yellow
$kycBody = @{
    documentType = "PASSPORT"
    documentNumber = "AB123456"
    documentCountry = "VNM"
    fileUrl = "https://storage.xupay.com/kyc/test-passport.pdf"
    mimeType = "application/pdf"
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
    $myDocs = Invoke-RestMethod -Uri "$baseUrl/api/kyc/documents" `
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
    $limits = Invoke-RestMethod -Uri "$baseUrl/api/users/me/limits" `
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
    $limitCheck = Invoke-RestMethod -Uri "$baseUrl/api/users/me/check-limit" `
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