#!/usr/bin/env pwsh

Write-Host "🚀 Starting FinTech Development Environment..." -ForegroundColor Green

# Check Docker
$dockerCheck = docker --version 2>$null
if (-not $dockerCheck) {
    Write-Host "❌ Docker not found. Please install:" -ForegroundColor Red
    Write-Host "   Windows: https://docs.docker.com/desktop/install/windows-install/" -ForegroundColor Yellow
    Write-Host "   WSL: sudo apt-get install docker.io" -ForegroundColor Yellow
    exit 1
}

# Start infrastructure
Write-Host "🐳 Starting Docker containers..." -ForegroundColor Cyan
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# Wait for PostgreSQL
Write-Host "⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Build Java service
Write-Host "🔨 Building Java API Gateway..." -ForegroundColor Cyan
cd backend/java-services/api-gateway
mvn clean package -DskipTests -q
cd ../../..

# Build Go service  
Write-Host "⚡ Building Go Payment Service..." -ForegroundColor Cyan
cd backend/go-services/payment-service
go mod tidy -q
go build -o payment-service .
cd ../../..

Write-Host "`n✅ DEVELOPMENT ENVIRONMENT READY!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "🔧 SERVICES RUNNING:" -ForegroundColor White
Write-Host "   API Gateway:    http://localhost:8080/actuator/health" -ForegroundColor Green
Write-Host "   Payment Service: gRPC on localhost:50051" -ForegroundColor Green
Write-Host "   PostgreSQL:     localhost:5432 (user: dev, pass: devpass)" -ForegroundColor Green
Write-Host "   Redis:          localhost:6379" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "`n🚀 NEXT STEPS:" -ForegroundColor White
Write-Host "   1. Test API Gateway: curl http://localhost:8080/actuator/health" -ForegroundColor Yellow
Write-Host "   2. Test Payment Service: grpcurl -plaintext localhost:50051 list" -ForegroundColor Yellow
Write-Host "   3. Start coding! 😊" -ForegroundColor Yellow