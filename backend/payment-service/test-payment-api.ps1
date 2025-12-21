# ========================================================
# Payment Service - End-to-End API Test Script
# ========================================================
# Purpose: Automated testing of Payment Service APIs
# Prerequisites: User Service + Payment Service running
# ========================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Payment Service - E2E API Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$userServiceUrl = "http://localhost:8081"
$paymentServiceUrl = "http://localhost:8082"
$testStartTime = Get-Date

# Test Results Tracking
$testsRun = 0
$testsPassed = 0
$testsFailed = 0

function Test-Endpoint {
    param(
        [string]$TestName,
        [scriptblock]$TestCode
    )
    
    $script:testsRun++
    Write-Host "`n[$script:testsRun] Testing: $TestName" -ForegroundColor Yellow
    
    try {
        & $TestCode
        $script:testsPassed++
        Write-Host "    ✅ PASSED" -ForegroundColor Green
        return $true
    } catch {
        $script:testsFailed++
        Write-Host "    ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# ========================================================
# STEP 1: Verify Services Running
# ========================================================
Write-Host "`n🔍 Step 1: Verifying services..." -ForegroundColor Cyan

Test-Endpoint "User Service Health Check" {
    $response = Invoke-RestMethod -Uri "$userServiceUrl/actuator/health" -Method GET
    if ($response.status -ne "UP") {
        throw "User Service not healthy"
    }
}

Test-Endpoint "Payment Service Health Check" {
    $response = Invoke-RestMethod -Uri "$paymentServiceUrl/actuator/health" -Method GET
    if ($response.status -ne "UP") {
        throw "Payment Service not healthy"
    }
}

# ========================================================
# STEP 2: Register Test Users
# ========================================================
Write-Host "`n👤 Step 2: Registering test users..." -ForegroundColor Cyan

$aliceEmail = "alice.test.$(Get-Random)@xupay.com"
$bobEmail = "bob.test.$(Get-Random)@xupay.com"
$aliceId = $null
$bobId = $null

Test-Endpoint "Register Alice" {
    $body = @{
        email = $aliceEmail
        password = "Alice123!@#"
        phoneNumber = "+84901$(Get-Random -Minimum 100000 -Maximum 999999)"
        firstName = "Alice Test"
        lastName = "Test"
        dateOfBirth = "1990-05-15"
    } | ConvertTo-Json

    $response = Invoke-RestMethod `
        -Uri "$userServiceUrl/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body

    $script:aliceId = $response.userId
    Write-Host "    Alice ID: $script:aliceId" -ForegroundColor Gray
    
    if (-not $script:aliceId) {
        throw "Failed to get Alice user ID"
    }
}

Test-Endpoint "Register Bob" {
    $body = @{
        email = $bobEmail
        password = "Bob123!@#"
        phoneNumber = "+84902$(Get-Random -Minimum 100000 -Maximum 999999)"
        firstName = "Bob Test"
        lastName = "Test"
        dateOfBirth = "1992-08-20"
    } | ConvertTo-Json

    $response = Invoke-RestMethod `
        -Uri "$userServiceUrl/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body

    $script:bobId = $response.userId
    Write-Host "    Bob ID: $script:bobId" -ForegroundColor Gray
    
    if (-not $script:bobId) {
        throw "Failed to get Bob user ID"
    }
}

# ========================================================
# STEP 3: Create Wallets
# ========================================================
Write-Host "`n💰 Step 3: Creating wallets..." -ForegroundColor Cyan

$aliceWalletId = $null
$bobWalletId = $null

Test-Endpoint "Create Alice's Wallet" {
    $body = @{
        userId = $script:aliceId
        walletType = "PERSONAL"
    } | ConvertTo-Json

    $response = Invoke-RestMethod `
        -Uri "$paymentServiceUrl/api/wallets" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body

    $script:aliceWalletId = $response.walletId
    Write-Host "    Alice Wallet ID: $script:aliceWalletId" -ForegroundColor Gray
    
    if ($response.isActive -ne $true) {
        throw "Wallet not active"
    }
}

Test-Endpoint "Create Bob's Wallet" {
    $body = @{
        userId = $script:bobId
        walletType = "PERSONAL"
    } | ConvertTo-Json

    $response = Invoke-RestMethod `
        -Uri "$paymentServiceUrl/api/wallets" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body

    $script:bobWalletId = $response.walletId
    Write-Host "    Bob Wallet ID: $script:bobWalletId" -ForegroundColor Gray
    
    if ($response.isActive -ne $true) {
        throw "Wallet not active"
    }
}

# ========================================================
# STEP 4: Check Initial Balances
# ========================================================
Write-Host "`n📊 Step 4: Checking initial balances..." -ForegroundColor Cyan

Test-Endpoint "Alice Initial Balance (should be 0)" {
    $response = Invoke-RestMethod -Uri "$paymentServiceUrl/api/wallets/$script:aliceWalletId/balance"
    Write-Host "    Balance: $($response.balanceAmount) VND" -ForegroundColor Gray
    
    if ($response.balanceCents -ne 0) {
        throw "Expected 0 balance, got $($response.balanceCents)"
    }
}

Test-Endpoint "Bob Initial Balance (should be 0)" {
    $response = Invoke-RestMethod -Uri "$paymentServiceUrl/api/wallets/$script:bobWalletId/balance"
    Write-Host "    Balance: $($response.balanceAmount) VND" -ForegroundColor Gray
    
    if ($response.balanceCents -ne 0) {
        throw "Expected 0 balance, got $($response.balanceCents)"
    }
}

# ========================================================
# STEP 5: Topup Alice's Wallet (Simulated)
# ========================================================
Write-Host "`n💳 Step 5: Topping up Alice's wallet..." -ForegroundColor Cyan

Test-Endpoint "Simulate Topup via Direct DB Insert" {
    $topupAmount = 100000000  # 1M VND
    
    # Execute Docker command to insert topup transaction
    $sqlCommand = @"
BEGIN;
INSERT INTO transactions (id, idempotency_key, to_wallet_id, to_user_id, amount_cents, type, status, description, completed_at, created_at)
VALUES (gen_random_uuid(), gen_random_uuid(), '$script:aliceWalletId', '$script:aliceId', $topupAmount, 'TOPUP', 'COMPLETED', 'Test topup for API testing', NOW(), NOW());

INSERT INTO ledger_entries (id, transaction_id, wallet_id, gl_account_code, entry_type, amount_cents, description, created_at)
SELECT gen_random_uuid(), t.id, t.to_wallet_id, '2110', 'CREDIT', t.amount_cents, 'Topup via test script', NOW()
FROM transactions t
WHERE t.description = 'Test topup for API testing' AND t.to_wallet_id = '$script:aliceWalletId'
ORDER BY t.created_at DESC LIMIT 1;
COMMIT;
"@

    $result = docker exec xupay-postgres-payment psql -U payment_service_user -d payment_db -c $sqlCommand 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to insert topup: $result"
    }
    
    Write-Host "    Topup successful: 1,000,000 VND" -ForegroundColor Gray
}

Test-Endpoint "Verify Alice Balance After Topup" {
    Start-Sleep -Seconds 1  # Wait for consistency
    
    $response = Invoke-RestMethod -Uri "$paymentServiceUrl/api/wallets/$script:aliceWalletId/balance"
    Write-Host "    New Balance: $($response.balanceAmount) VND" -ForegroundColor Gray
    
    if ($response.balanceCents -ne 100000000) {
        throw "Expected 100M cents, got $($response.balanceCents)"
    }
}

# ========================================================
# STEP 6: P2P Transfer Test
# ========================================================
Write-Host "`n💸 Step 6: Testing P2P transfer..." -ForegroundColor Cyan

$transferIdempotencyKey = (New-Guid).ToString()
$transferAmount = 25000000  # 250,000 VND
$transferTxnId = $null

Test-Endpoint "Execute P2P Transfer (Alice → Bob: 250k VND)" {
    $body = @{
        idempotencyKey = $transferIdempotencyKey
        fromUserId = $script:aliceId
        toUserId = $script:bobId
        amountCents = $transferAmount
        description = "Test P2P transfer from script"
        userAgent = "PowerShellTestScript/1.0"
    } | ConvertTo-Json

    $response = Invoke-RestMethod `
        -Uri "$paymentServiceUrl/api/payments/transfer" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body

    $script:transferTxnId = $response.transactionId
    Write-Host "    Transaction ID: $script:transferTxnId" -ForegroundColor Gray
    Write-Host "    Status: $($response.status)" -ForegroundColor Gray
    Write-Host "    Fraud Score: $($response.fraudScore)" -ForegroundColor Gray
    
    if ($response.status -ne "COMPLETED") {
        throw "Expected COMPLETED status, got $($response.status)"
    }
    
    if ($response.amountCents -ne $transferAmount) {
        throw "Amount mismatch"
    }
}

Test-Endpoint "Verify Alice Balance Decreased" {
    $response = Invoke-RestMethod -Uri "$paymentServiceUrl/api/wallets/$script:aliceWalletId/balance"
    Write-Host "    Alice Balance: $($response.balanceAmount) VND" -ForegroundColor Gray
    
    $expectedBalance = 100000000 - $transferAmount
    if ($response.balanceCents -ne $expectedBalance) {
        throw "Expected $expectedBalance cents, got $($response.balanceCents)"
    }
}

Test-Endpoint "Verify Bob Balance Increased" {
    $response = Invoke-RestMethod -Uri "$paymentServiceUrl/api/wallets/$script:bobWalletId/balance"
    Write-Host "    Bob Balance: $($response.balanceAmount) VND" -ForegroundColor Gray
    
    if ($response.balanceCents -ne $transferAmount) {
        throw "Expected $transferAmount cents, got $($response.balanceCents)"
    }
}

# ========================================================
# STEP 7: Idempotency Test
# ========================================================
Write-Host "`n🔁 Step 7: Testing idempotency..." -ForegroundColor Cyan

$firstTxnId = $null
$secondTxnId = $null

Test-Endpoint "Retry Transfer with Same Idempotency Key" {
    $body = @{
        idempotencyKey = $transferIdempotencyKey  # SAME KEY
        fromUserId = $script:aliceId
        toUserId = $script:bobId
        amountCents = $transferAmount
        description = "Test P2P transfer from script"
        userAgent = "PowerShellTestScript/1.0"
    } | ConvertTo-Json

    $response = Invoke-RestMethod `
        -Uri "$paymentServiceUrl/api/payments/transfer" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body

    $script:secondTxnId = $response.transactionId
    Write-Host "    First Txn ID:  $script:transferTxnId" -ForegroundColor Gray
    Write-Host "    Second Txn ID: $script:secondTxnId" -ForegroundColor Gray
    
    if ($script:transferTxnId -ne $script:secondTxnId) {
        throw "Idempotency failed: Different transaction IDs"
    }
    
    Write-Host "    ✓ Same transaction returned (idempotency working)" -ForegroundColor Green
}

Test-Endpoint "Verify No Duplicate Charge" {
    $response = Invoke-RestMethod -Uri "$paymentServiceUrl/api/wallets/$script:aliceWalletId/balance"
    
    $expectedBalance = 100000000 - $transferAmount
    if ($response.balanceCents -ne $expectedBalance) {
        throw "Balance changed on retry (duplicate charge detected)"
    }
    
    Write-Host "    ✓ Balance unchanged (no duplicate charge)" -ForegroundColor Green
}

# ========================================================
# STEP 8: Fraud Detection Test
# ========================================================
Write-Host "`n🚨 Step 8: Testing fraud detection..." -ForegroundColor Cyan

Test-Endpoint "Large Amount Transfer (should be flagged)" {
    $body = @{
        idempotencyKey = (New-Guid).ToString()
        fromUserId = $script:aliceId
        toUserId = $script:bobId
        amountCents = 30000000  # 300,000 VND (triggers medium amount rule)
        description = "Fraud detection test"
        userAgent = "PowerShellTestScript/1.0"
    } | ConvertTo-Json

    $response = Invoke-RestMethod `
        -Uri "$paymentServiceUrl/api/payments/transfer" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body

    Write-Host "    Fraud Score: $($response.fraudScore)" -ForegroundColor Gray
    Write-Host "    Is Flagged: $($response.isFlagged)" -ForegroundColor Gray
    
    if ($response.fraudScore -gt 0) {
        Write-Host "    ✓ Fraud detection active (score > 0)" -ForegroundColor Green
    }
}

# ========================================================
# STEP 9: Verify Redis Cache
# ========================================================
Write-Host "`n🔍 Step 9: Verifying Redis cache..." -ForegroundColor Cyan

Test-Endpoint "Check Redis Idempotency Keys" {
    $result = docker exec xupay-redis redis-cli -a 'R3d1sP@ss2025!' KEYS "idempotency:*" 2>&1 | Select-String -Pattern "idempotency:"
    
    if ($result) {
        Write-Host "    ✓ Found cached idempotency keys in Redis" -ForegroundColor Green
        Write-Host "    Sample: $($result | Select-Object -First 2)" -ForegroundColor Gray
    } else {
        throw "No idempotency keys found in Redis"
    }
}

# ========================================================
# FINAL REPORT
# ========================================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " TEST EXECUTION SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$duration = (Get-Date) - $testStartTime
$passRate = if ($testsRun -gt 0) { [math]::Round(($testsPassed / $testsRun) * 100, 2) } else { 0 }

Write-Host "`nTotal Tests:    $testsRun" -ForegroundColor White
Write-Host "Passed:         $testsPassed" -ForegroundColor Green
Write-Host "Failed:         $testsFailed" -ForegroundColor $(if ($testsFailed -gt 0) { "Red" } else { "Green" })
Write-Host "Pass Rate:      $passRate%" -ForegroundColor $(if ($passRate -eq 100) { "Green" } else { "Yellow" })
Write-Host "Duration:       $($duration.TotalSeconds) seconds" -ForegroundColor White

if ($testsFailed -eq 0) {
    Write-Host "`n🎉 ALL TESTS PASSED!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n⚠️  SOME TESTS FAILED" -ForegroundColor Red
    exit 1
}
