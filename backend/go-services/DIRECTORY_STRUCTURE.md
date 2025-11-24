# XuPay Directory Structure

This document provides a complete overview of the XuPay backend services directory structure.

## Complete Directory Tree

```
backend/go-services/
├── go.work                          # Go workspace configuration
├── go.work.sum                      # Go workspace checksums
├── docs/
│   └── SCHEMA_ARCHITECTURE.md       # Comprehensive schema documentation
│
├── payment-service/
│   ├── go.mod                       # Payment service dependencies
│   ├── go.sum                       # Go module checksums
│   ├── README.md                    # Payment service documentation
│   │
│   ├── cmd/
│   │   └── server/                  # Main application entry point
│   │       └── main.go              # (to be created)
│   │
│   ├── internal/
│   │   ├── handlers/                # HTTP/gRPC request handlers
│   │   │   └── payment_handler.go   # (to be created)
│   │   │
│   │   ├── models/                  # Data models and schemas
│   │   │   └── payment.go           # ✓ Payment domain models
│   │   │
│   │   ├── repository/              # Database layer (data access)
│   │   │   └── payment_repository.go # (to be created)
│   │   │
│   │   ├── service/                 # Business logic layer
│   │   │   └── payment_service.go   # (to be created)
│   │   │
│   │   ├── config/                  # Configuration management
│   │   │   └── config.go            # (to be created)
│   │   │
│   │   └── middleware/              # HTTP middleware
│   │       └── auth.go              # (to be created)
│   │
│   ├── pkg/
│   │   └── proto/                   # Protocol buffer definitions
│   │       └── payment.proto        # ✓ Payment gRPC API definition
│   │
│   ├── migrations/                  # Database migrations
│   │   └── 001_create_payment_tables.sql  # ✓ Initial schema
│   │
│   └── docs/                        # Additional documentation
│       └── api.md                   # (to be created)
│
├── fraud-service/
│   ├── go.mod                       # Fraud service dependencies
│   ├── go.sum                       # Go module checksums
│   ├── README.md                    # Fraud service documentation
│   │
│   ├── cmd/
│   │   └── server/                  # Main application entry point
│   │       └── main.go              # (to be created)
│   │
│   ├── internal/
│   │   ├── handlers/                # HTTP/gRPC request handlers
│   │   │   └── fraud_handler.go     # (to be created)
│   │   │
│   │   ├── models/                  # Data models and schemas
│   │   │   └── fraud.go             # ✓ Fraud domain models
│   │   │
│   │   ├── repository/              # Database layer (data access)
│   │   │   └── fraud_repository.go  # (to be created)
│   │   │
│   │   ├── service/                 # Business logic layer
│   │   │   ├── fraud_service.go     # (to be created)
│   │   │   └── rule_engine.go       # (to be created)
│   │   │
│   │   ├── config/                  # Configuration management
│   │   │   └── config.go            # (to be created)
│   │   │
│   │   └── middleware/              # HTTP middleware
│   │       └── auth.go              # (to be created)
│   │
│   ├── pkg/
│   │   └── proto/                   # Protocol buffer definitions
│   │       └── fraud.proto          # ✓ Fraud gRPC API definition
│   │
│   ├── migrations/                  # Database migrations
│   │   └── 001_create_fraud_tables.sql  # ✓ Initial schema
│   │
│   └── docs/                        # Additional documentation
│       └── rules.md                 # (to be created)
│
├── settlement-service/
│   ├── go.mod                       # Settlement service dependencies
│   ├── go.sum                       # Go module checksums
│   └── (structure to be defined)
│
└── shared-utils/
    ├── go.mod                       # Shared utilities dependencies
    ├── go.sum                       # Go module checksums
    │
    └── pkg/
        ├── database/                # Database utilities
        │   ├── connection.go        # (to be created)
        │   └── migration.go         # (to be created)
        │
        ├── logger/                  # Logging utilities
        │   └── logger.go            # (to be created)
        │
        ├── errors/                  # Error handling utilities
        │   └── errors.go            # (to be created)
        │
        ├── validation/              # Validation utilities
        │   └── validator.go         # (to be created)
        │
        └── proto/                   # Common proto definitions
            └── common.proto         # (to be created)
```

## Key Files Created (✓)

### Payment Service
1. **internal/models/payment.go** - Complete data models for:
   - Payment (main entity)
   - PaymentCard (tokenized card data)
   - PaymentTransaction (transaction attempts)
   - Merchant (merchant accounts)
   - Customer (customer profiles)
   - PaymentWebhook (webhook delivery)

2. **pkg/proto/payment.proto** - gRPC API definitions:
   - CreatePayment, GetPayment, ListPayments
   - UpdatePaymentStatus, ProcessPayment
   - RefundPayment, CancelPayment

3. **migrations/001_create_payment_tables.sql** - Database schema:
   - merchants, customers, payments
   - payment_cards, payment_transactions
   - payment_webhooks

4. **README.md** - Comprehensive service documentation

### Fraud Service
1. **internal/models/fraud.go** - Complete data models for:
   - FraudCheck (fraud analysis)
   - FraudRule (detection rules)
   - FraudRuleExecution (rule audit trail)
   - FraudPattern (blacklist/whitelist)
   - VelocityCheck (transaction frequency)
   - GeolocationCheck (IP analysis)
   - DeviceFingerprint (device tracking)
   - FraudAlert (system alerts)

2. **pkg/proto/fraud.proto** - gRPC API definitions:
   - CheckFraud, GetFraudCheck, ListFraudChecks
   - CreateFraudRule, UpdateFraudRule, DeleteFraudRule, ListFraudRules
   - AddToBlacklist, RemoveFromBlacklist, CheckBlacklist

3. **migrations/001_create_fraud_tables.sql** - Database schema:
   - fraud_checks, fraud_rules, fraud_rule_executions
   - fraud_patterns, velocity_checks
   - geolocation_checks, device_fingerprints, fraud_alerts

4. **README.md** - Comprehensive service documentation

### Shared Documentation
1. **docs/SCHEMA_ARCHITECTURE.md** - Complete schema architecture documentation

## Architecture Patterns

### Layer Separation
```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (handlers - HTTP/gRPC endpoints)       │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         Business Logic Layer            │
│  (service - business rules & logic)     │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         Data Access Layer               │
│  (repository - database operations)     │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         Data Layer                      │
│  (models & database)                    │
└─────────────────────────────────────────┘
```

### Service Communication
```
┌──────────────────┐       gRPC        ┌──────────────────┐
│  Payment Service │◄─────────────────►│  Fraud Service   │
└──────────────────┘                   └──────────────────┘
         │                                      │
         │                                      │
         ▼                                      ▼
┌──────────────────┐                   ┌──────────────────┐
│  Payment DB      │                   │  Fraud DB        │
│  (PostgreSQL)    │                   │  (PostgreSQL)    │
└──────────────────┘                   └──────────────────┘
```

## Database Schema Summary

### Payment Service Tables
- **merchants** - Merchant accounts (API keys, webhooks)
- **customers** - Customer profiles
- **payments** - Payment records (status, amount, fraud info)
- **payment_cards** - Tokenized card information
- **payment_transactions** - Individual transaction attempts
- **payment_webhooks** - Webhook delivery tracking

### Fraud Service Tables
- **fraud_checks** - Fraud analysis results
- **fraud_rules** - Configurable detection rules
- **fraud_rule_executions** - Rule execution audit
- **fraud_patterns** - Blacklist/whitelist patterns
- **velocity_checks** - Transaction frequency monitoring
- **geolocation_checks** - IP-based location analysis
- **device_fingerprints** - Device tracking
- **fraud_alerts** - System-generated alerts

## Next Steps

To complete the implementation, the following components need to be created:

### High Priority
1. Service layer implementations (business logic)
2. Repository layer implementations (data access)
3. Handler implementations (API endpoints)
4. Configuration management
5. Main application entry points

### Medium Priority
6. Middleware (authentication, rate limiting, logging)
7. Shared utilities (database, logger, errors, validation)
8. Unit and integration tests
9. Docker compose for local development
10. CI/CD pipeline configuration

### Low Priority
11. API documentation (Swagger/OpenAPI)
12. Monitoring and observability setup
13. Performance benchmarks
14. Load testing scripts

## Development Workflow

1. **Local Development**
   ```bash
   # Start databases
   docker-compose up -d postgres redis
   
   # Run migrations
   psql < migrations/001_create_payment_tables.sql
   
   # Start service
   go run cmd/server/main.go
   ```

2. **Testing**
   ```bash
   # Unit tests
   go test ./internal/...
   
   # Integration tests
   go test ./... -tags=integration
   ```

3. **Building**
   ```bash
   # Build all services
   go build ./...
   
   # Build specific service
   go build -o payment-service cmd/server/main.go
   ```

## Contributing

When adding new features:
1. Update models in `internal/models/`
2. Create migrations in `migrations/`
3. Update proto definitions in `pkg/proto/`
4. Implement business logic in `internal/service/`
5. Implement data access in `internal/repository/`
6. Create handlers in `internal/handlers/`
7. Add tests for all layers
8. Update documentation
