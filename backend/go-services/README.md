# XuPay Backend Services

A modern, scalable payment gateway system built with Go microservices architecture.

## Overview

XuPay is a comprehensive payment processing platform that provides:
- **Payment Processing**: Secure payment transaction handling
- **Fraud Detection**: Real-time risk assessment and fraud prevention
- **Settlement**: Payment reconciliation and payouts
- **Multi-currency Support**: USD, EUR, GBP, INR, VND
- **Multiple Payment Methods**: Cards, Bank Transfers, Wallets, UPI

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      XuPay Platform                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐      ┌──────────────────┐           │
│  │  Payment Service │◄────►│  Fraud Service   │           │
│  │  Port: 8080/50051│      │  Port: 8081/50052│           │
│  └──────────────────┘      └──────────────────┘           │
│           │                          │                      │
│           │                          │                      │
│  ┌────────▼──────────────────────────▼──────────┐         │
│  │         Settlement Service                    │         │
│  │         Port: 8082/50053                      │         │
│  └───────────────────────────────────────────────┘         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Services

### 1. Payment Service
Handles all payment processing operations.

**Key Features:**
- Payment creation and processing
- Multiple payment method support
- Transaction management
- Refund and cancellation handling
- Webhook notifications
- Merchant and customer management

**API Endpoints:**
- `CreatePayment` - Initiate a new payment
- `GetPayment` - Retrieve payment details
- `ListPayments` - List payments with filters
- `ProcessPayment` - Process pending payment
- `RefundPayment` - Refund a completed payment
- `CancelPayment` - Cancel a pending payment
- `UpdatePaymentStatus` - Update payment status

[📖 Payment Service Documentation](./payment-service/README.md)

### 2. Fraud Detection Service
Real-time fraud detection and risk assessment.

**Key Features:**
- Rule-based fraud detection
- Machine learning integration ready
- Velocity checks (transaction frequency)
- Geolocation analysis
- Device fingerprinting
- Blacklist/whitelist management
- Risk scoring (0-100)
- Alert management

**Detection Strategies:**
- **Velocity Rules**: Monitor transaction frequency
- **Geolocation Rules**: Detect location anomalies
- **Amount Rules**: Flag unusual transaction amounts
- **Pattern Matching**: Check against known fraud patterns
- **Device Analysis**: Track device behavior

**API Endpoints:**
- `CheckFraud` - Perform fraud check
- `GetFraudCheck` - Retrieve fraud check details
- `ListFraudChecks` - List fraud checks
- `CreateFraudRule` - Create new fraud rule
- `UpdateFraudRule` - Update existing rule
- `DeleteFraudRule` - Delete fraud rule
- `ListFraudRules` - List all rules
- `AddToBlacklist` - Add pattern to blacklist
- `RemoveFromBlacklist` - Remove from blacklist
- `CheckBlacklist` - Check if pattern is blacklisted

[📖 Fraud Service Documentation](./fraud-service/README.md)

### 3. Settlement Service
*(Structure to be defined)*

Handles payment settlements, payouts, and reconciliation.

### 4. Shared Utils
Common utilities and helpers used across services.

**Utilities:**
- Database connection management
- Logging infrastructure
- Error handling
- Validation helpers
- Common proto definitions

## Technology Stack

- **Language**: Go 1.25.4
- **Web Framework**: Gin (HTTP) + gRPC
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+
- **API Protocol**: gRPC with Protocol Buffers
- **Message Format**: JSON & Protobuf

## Quick Start

### Prerequisites
```bash
# Required
- Go 1.25.4 or later
- PostgreSQL 14+
- Redis 7+

# Optional
- Docker & Docker Compose
- protoc (Protocol Buffer compiler)
```

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/duythucne22/XuPay.git
   cd XuPay/backend/go-services
   ```

2. **Install dependencies**
   ```bash
   go work sync
   ```

3. **Setup databases**
   ```bash
   # Start PostgreSQL and Redis with Docker
   docker-compose up -d
   
   # Run migrations
   psql -U postgres -d payment_db < payment-service/migrations/001_create_payment_tables.sql
   psql -U postgres -d fraud_db < fraud-service/migrations/001_create_fraud_tables.sql
   ```

4. **Configure environment**
   ```bash
   # Set environment variables
   export DB_HOST=localhost
   export DB_PORT=5432
   export REDIS_HOST=localhost
   export REDIS_PORT=6379
   ```

5. **Build services**
   ```bash
   # Build all services
   go build ./...
   ```

6. **Run services**
   ```bash
   # Terminal 1 - Payment Service
   cd payment-service
   go run cmd/server/main.go
   
   # Terminal 2 - Fraud Service
   cd fraud-service
   go run cmd/server/main.go
   ```

## Project Structure

```
go-services/
├── payment-service/      # Payment processing service
├── fraud-service/        # Fraud detection service
├── settlement-service/   # Settlement and reconciliation
├── shared-utils/         # Common utilities
├── docs/                 # Documentation
├── go.work              # Go workspace configuration
├── DIRECTORY_STRUCTURE.md
└── README.md            # This file
```

[📖 Complete Directory Structure](./DIRECTORY_STRUCTURE.md)

## Database Schema

### Payment Service Schema
- **merchants** - Merchant accounts
- **customers** - Customer profiles
- **payments** - Payment records
- **payment_cards** - Tokenized card data
- **payment_transactions** - Transaction attempts
- **payment_webhooks** - Webhook delivery logs

### Fraud Service Schema
- **fraud_checks** - Fraud analysis results
- **fraud_rules** - Detection rules
- **fraud_rule_executions** - Rule execution logs
- **fraud_patterns** - Blacklist/whitelist
- **velocity_checks** - Transaction frequency
- **geolocation_checks** - IP analysis
- **device_fingerprints** - Device tracking
- **fraud_alerts** - System alerts

[📖 Complete Schema Documentation](./docs/SCHEMA_ARCHITECTURE.md)

## Payment Flow

```
1. Merchant initiates payment
   ↓
2. Payment Service creates payment (PENDING)
   ↓
3. Payment Service → Fraud Service (fraud check)
   ↓
4. Fraud Service analyzes transaction
   ├─ Execute velocity rules
   ├─ Check geolocation
   ├─ Verify device fingerprint
   ├─ Check blacklist
   └─ Calculate risk score
   ↓
5. Fraud Service returns decision
   ├─ APPROVE (Risk: Low)
   ├─ REVIEW (Risk: Medium)
   ├─ DECLINE (Risk: High)
   └─ BLOCK (Risk: Critical)
   ↓
6. Payment Service processes based on decision
   ├─ APPROVE → Process payment
   ├─ REVIEW → Hold for manual review
   ├─ DECLINE → Reject payment
   └─ BLOCK → Block customer
   ↓
7. Payment Service sends webhook to merchant
   ↓
8. Settlement Service handles payouts
```

## API Communication

### REST API (HTTP + JSON)
```bash
# Health check
curl http://localhost:8080/health

# Create payment (example)
curl -X POST http://localhost:8080/api/v1/payments \
  -H "Content-Type: application/json" \
  -H "X-API-Key: merchant_api_key" \
  -d '{
    "amount": 10000,
    "currency": "USD",
    "payment_method": "CREDIT_CARD"
  }'
```

### gRPC API
```bash
# Test gRPC endpoint
grpcurl -plaintext localhost:50051 list
grpcurl -plaintext localhost:50051 payment.v1.PaymentService/CreatePayment
```

## Development

### Running Tests
```bash
# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run tests for specific service
cd payment-service
go test ./internal/...
```

### Building
```bash
# Build all services
go build ./...

# Build specific service
cd payment-service
go build -o payment-service cmd/server/main.go
```

### Code Generation
```bash
# Generate protobuf code
protoc --go_out=. --go-grpc_out=. pkg/proto/*.proto
```

## Security

### Best Practices Implemented
- ✓ PCI-DSS compliance (no raw card storage)
- ✓ Tokenization for sensitive data
- ✓ API key authentication
- ✓ Rate limiting ready
- ✓ SQL injection prevention (prepared statements)
- ✓ Audit logging structure
- ✓ Encryption-ready (TLS/SSL)

### Security Checklist
- [ ] Implement API key rotation
- [ ] Add request signing
- [ ] Enable TLS/mTLS
- [ ] Setup rate limiting
- [ ] Implement circuit breakers
- [ ] Add security headers
- [ ] Setup WAF (Web Application Firewall)

## Monitoring & Observability

### Metrics to Monitor
- Payment success/failure rates
- Fraud detection accuracy
- API latency (p50, p95, p99)
- Database connection pool usage
- Error rates
- Transaction throughput

### Logging
- Structured logging with log levels
- Request/response logging
- Error tracking
- Audit trails

### Health Checks
- Database connectivity
- Redis connectivity
- Service dependencies
- Disk space
- Memory usage

## Deployment

### Docker
```bash
# Build Docker images
docker build -t payment-service:latest -f payment-service/Dockerfile .
docker build -t fraud-service:latest -f fraud-service/Dockerfile .

# Run with Docker Compose
docker-compose up -d
```

### Kubernetes
```bash
# Deploy to Kubernetes
kubectl apply -f k8s/payment-service.yaml
kubectl apply -f k8s/fraud-service.yaml
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Documentation

- [Payment Service README](./payment-service/README.md)
- [Fraud Service README](./fraud-service/README.md)
- [Schema Architecture](./docs/SCHEMA_ARCHITECTURE.md)
- [Directory Structure](./DIRECTORY_STRUCTURE.md)

## License

[Add License Information]

## Support

For support, email duythuc332@gmail.com or open an issue on GitHub.

## Roadmap

### Phase 1 (Current)
- [x] Schema design and models
- [x] Database migrations
- [x] Proto definitions
- [ ] Service implementations
- [ ] API handlers

### Phase 2
- [ ] Authentication & Authorization
- [ ] Rate limiting
- [ ] Webhook delivery system
- [ ] Admin dashboard

### Phase 3
- [ ] Machine learning fraud detection
- [ ] Advanced analytics
- [ ] Multi-region support
- [ ] Payment routing
- [ ] Subscription payments

### Phase 4
- [ ] Mobile SDK
- [ ] Partner integrations
- [ ] Advanced reporting
- [ ] Compliance certifications

## Acknowledgments

Built with ❤️ by the XuPay team
