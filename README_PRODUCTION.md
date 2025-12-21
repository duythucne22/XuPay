# XuPay FinTech MVP - PRODUCTION COMPLETE
> **Last Updated:** December 17, 2025  
> **Status:** 🚀 PRODUCTION-READY ARCHITECTURE  
> **Approach:** Full fintech platform with double-entry accounting, compliance, and fraud detection

---

## 📊 ARCHITECTURE OVERVIEW

### ✅ COMPLETE 3-SERVICE MICROSERVICES

```
┌─────────────────────────────────────────────────────────────────┐
│                   PRODUCTION ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   [Client (React + TypeScript)]                                 │
│              │                                                  │
│              ▼ HTTPS                                            │
│   ┌──────────────────────────────────────┐                     │
│   │   API Gateway (NGINX/Kong)           │                     │
│   │   - JWT validation                    │                     │
│   │   - Rate limiting                     │                     │
│   │   - Request routing                   │                     │
│   └────┬──────────────┬─────────────┬────┘                     │
│        │              │             │                           │
│        ▼ gRPC         ▼ REST        ▼ REST                      │
│   ┌──────────┐  ┌──────────────┐  ┌───────────────┐           │
│   │  User    │  │   Payment    │  │    Audit      │           │
│   │ Service  │◄─│   Service    │─►│   Service     │           │
│   │ (Java)   │  │   (Java)     │  │   (Golang)    │           │
│   │ Port8081 │  │   Port 8082  │  │   Port 8083   │           │
│   └────┬─────┘  └─────┬────────┘  └──────┬────────┘           │
│        │              │                    │                    │
│   [user_db]     [payment_db]         [audit_db]                │
│   6 tables      7 tables              6 tables                 │
│        │              │                    │                    │
│        └──────────────┴────────────────────┘                    │
│                       │                                         │
│              ┌────────┴─────────┐                              │
│              ▼                  ▼                               │
│         [Redis Cache]    [RabbitMQ]                            │
│         Idempotency      Event Bus                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💾 DATABASE SCHEMAS (19 TABLES TOTAL)

### Database 1: `user_db` (6 tables) - User Service

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `users` | User accounts with KYC tiers | 4 KYC tiers (tier_0-tier_3), fraud scoring |
| `kyc_documents` | Identity verification docs | Document type, OCR data, verification workflow |
| `transaction_limits` | Per-tier transaction limits | Daily/monthly limits, velocity controls |
| `daily_usage` | Daily transaction tracking | Sent/received volumes, hourly velocity |
| `user_contacts` | Frequent recipient contacts | Nickname, transaction history |
| `user_preferences` | User settings | Notifications, 2FA, language, timezone |

**Key Function:** `get_user_limits()` - Returns tier limits + daily usage  
**Key Function:** `can_user_transact()` - Validates if user can send money

---

### Database 2: `payment_db` (7 tables) - Payment Service

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `chart_of_accounts` | GL account master data | 5 account types (Asset, Liability, Equity, Revenue, Expense) |
| `wallets` | User wallets | Linked to GL accounts, frozen status |
| `transactions` | Transaction headers | Idempotency key, fraud flags, reversal tracking |
| `ledger_entries` | **Double-entry journal** | IMMUTABLE, constraint ensures debits=credits |
| `idempotency_cache` | Response caching (24h TTL) | Prevents duplicate charges |
| `merchants` | Merchant accounts | Fee percentage, settlement frequency |
| `fraud_rules` | Configurable fraud detection | Velocity, amount threshold, geo-anomaly rules |

**CRITICAL Trigger:** `validate_balanced_transaction()` - Ensures debits=credits  
**Key Function:** `get_wallet_balance()` - Calculated from ledger (never stored)  
**Key Function:** `check_idempotency()` - Returns cached response if exists

---

### Database 3: `audit_db` (6 tables) - Audit Service

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `audit_events` | **Immutable event log** | Partitioned monthly, no updates/deletes |
| `suspicious_activity_reports` | SARs for compliance | Aggregated fraud reports, regulatory submission |
| `fraud_flags` | Suspicious activity tracking | Risk scoring (0-100), review workflow |
| `aml_checks` | Anti-Money Laundering checks | Daily limits, structuring detection |
| `compliance_reports` | Monthly/quarterly reports | Transaction monitoring, SAR summaries |
| `daily_stats` | Pre-aggregated metrics | Dashboard performance optimization |

**Auto-trigger:** `auto_create_sar_if_needed()` - Creates SAR when flags>3 or risk>200  
**Key Function:** `get_user_fraud_score()` - 30-day average fraud score  
**Scheduled:** `aggregate_daily_stats()` - Run nightly via cron

---

## 🔧 TECH STACK (PRODUCTION)

### User Service (Java Spring Boot 3.4.1)
```
Port: 8081
Language: Java 21
Framework: Spring Boot 3
Migration: Flyway
Key Dependencies:
  - Spring Security (JWT)
  - Spring Data JPA
  - gRPC Server (for Payment Service calls)
  - BCrypt (password hashing)
  - MapStruct (DTO mapping)
  - Lombok
```

### Payment Service (Java Spring Boot 3.4.1)
```
Port: 8082
Language: Java 21
Framework: Spring Boot 3
Migration: Flyway
Key Dependencies:
  - Spring Data JPA (@Transactional SERIALIZABLE)
  - gRPC Client (calls User Service)
  - Redis (Redisson for idempotency)
  - RabbitMQ (Spring Cloud Stream)
  - Constraint triggers (DB-level validation)
```

### Audit Service (Golang 1.21+)
```
Port: 8083
Language: Go
Framework: Gin (HTTP), GORM (DB)
Migration: golang-migrate
Key Dependencies:
  - Gin Web Framework
  - GORM (PostgreSQL driver)
  - Sarama (Kafka/RabbitMQ consumer)
  - Viper (config management)
  - Monthly table partitioning
```

---

## 🚀 COMMUNICATION PROTOCOLS

### 1. Synchronous (gRPC)
**Payment Service → User Service**
```protobuf
service UserService {
  rpc CheckTransactionLimit(LimitRequest) returns (LimitResponse);
  rpc GetUserKYC(KYCRequest) returns (KYCResponse);
}
```
**Use case:** Validate KYC status and transaction limits before payment

---

### 2. Asynchronous (RabbitMQ)
**Payment Service → Audit Service**
```json
{
  "event_type": "PAYMENT_COMPLETED",
  "transaction_id": "txn_123",
  "sender_id": "usr_A",
  "receiver_id": "usr_B",
  "amount_cents": 150000,
  "timestamp": "2025-12-17T10:00:00Z"
}
```
**Use case:** Non-blocking audit logging after payment completes

---

### 3. REST (HTTP/JSON)
**Client → API Gateway → Services**
```
POST /api/users/register
POST /api/auth/login
GET /api/users/{id}
POST /api/payments/transfer
GET /api/wallets/{id}/balance
GET /api/audit/events
```

---

## 💡 KEY CONCEPTS (PRODUCTION)

### 1. Double-Entry Accounting
Every transaction creates balanced ledger entries:
```
Transfer $100 Alice → Bob:
├─ DEBIT "User Balances" (Alice): $100  ← Reduce what we owe Alice
└─ CREDIT "User Balances" (Bob): $100   ← Increase what we owe Bob
   
Database constraint ENFORCES: Sum(DEBIT) = Sum(CREDIT)
```

### 2. Idempotency Protection
```java
@Transactional
public TransferResponse transfer(TransferRequest req) {
    // 1. Check cache
    if (redisCache.has(req.getIdempotencyKey())) {
        return redisCache.get(req.getIdempotencyKey());
    }
    
    // 2. Process transaction...
    
    // 3. Cache response (24h TTL)
    redisCache.set(req.getIdempotencyKey(), response, 86400);
    return response;
}
```

### 3. Fraud Detection (5 Rules)
```
Rule 1: High Amount (>$5000) → +40 risk
Rule 2: Velocity (>10 txn/hour) → +30 risk
Rule 3: Structuring (~$10k repeatedly) → +50 risk
Rule 4: Geographic Anomaly (IP change) → +20 risk
Rule 5: Blacklist Match → +100 risk (auto-block)

Final Decision:
- risk_score > 80: BLOCK
- risk_score > 50: APPROVE + FLAG
- risk_score ≤ 50: APPROVE
```

---

## 📋 DEVELOPMENT ROADMAP (4 WEEKS)

### Week 1: User Service
- [x] Complete database schema (6 tables)
- [ ] Spring Boot project setup
- [ ] User entity + JPA repositories
- [ ] REST controllers (register, login, get user)
- [ ] JWT authentication
- [ ] gRPC server (CheckTransactionLimit RPC)

### Week 2: Payment Service
- [x] Complete database schema (7 tables)
- [ ] Spring Boot project setup
- [ ] JPA entities (Wallet, Transaction, LedgerEntry)
- [ ] gRPC client (call User Service)
- [ ] Double-entry ledger service
- [ ] Transfer endpoint with idempotency
- [ ] Redis integration
- [ ] RabbitMQ publisher

### Week 3: Audit Service
- [x] Complete database schema (6 tables)
- [ ] Golang project setup
- [ ] GORM models
- [ ] RabbitMQ consumer (audit events)
- [ ] Fraud detection logic
- [ ] AML compliance checks
- [ ] SAR auto-generation
- [ ] REST API (query audit logs)

### Week 4: Integration & Deployment
- [ ] Docker Compose (all services)
- [ ] NGINX API Gateway config
- [ ] End-to-end P2P transfer test
- [ ] Idempotency testing
- [ ] Fraud detection testing
- [ ] API documentation (Swagger)
- [ ] Performance testing

---

## 🗂️ FILE STRUCTURE

```
infrastructure/db/
├── user-service/
│   └── V1__complete_user_schema.sql ✅ (6 tables)
├── payment-service/
│   └── V1__complete_payment_schema.sql ✅ (7 tables)
└── audit-service/
    └── V1__complete_audit_schema.sql ✅ (6 tables)

backend/
├── java-services/
│   ├── user-service/
│   │   ├── pom.xml
│   │   └── src/main/java/com/xupay/user/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── dto/
│   │       ├── entity/
│   │       ├── repository/
│   │       ├── service/
│   │       └── grpc/
│   └── payment-service/
│       ├── pom.xml
│       └── src/main/java/com/xupay/payment/
│           ├── config/
│           ├── controller/
│           ├── dto/
│           ├── entity/ (Wallet, Transaction, LedgerEntry)
│           ├── repository/
│           ├── service/ (LedgerService ⭐)
│           └── grpc/client/
└── go-services/
    └── audit-service/
        ├── cmd/api/main.go
        ├── internal/
        │   ├── handler/
        │   ├── model/
        │   ├── repository/
        │   ├── service/
        │   └── worker/ (RabbitMQ consumer)
        └── go.mod

infrastructure/docker/
└── docker-compose.yml (all services + DB + Redis + RabbitMQ)
```

---

## ✅ PRODUCTION CHECKLIST

### Database
- [x] Complete user_db schema (6 tables)
- [x] Complete payment_db schema with double-entry (7 tables)
- [x] Complete audit_db schema with compliance (6 tables)
- [x] Constraint trigger for balanced transactions
- [x] Functions for balance calculation
- [x] Indexes for performance
- [ ] Database backups configured
- [ ] Replication setup

### Services
- [ ] User Service (Java) - Auth + KYC + gRPC server
- [ ] Payment Service (Java) - Double-entry + idempotency + gRPC client
- [ ] Audit Service (Go) - RabbitMQ consumer + fraud detection
- [ ] All services containerized
- [ ] Health check endpoints
- [ ] Logging (JSON format)
- [ ] Metrics (Prometheus)

### Infrastructure
- [ ] PostgreSQL x3 (user_db, payment_db, audit_db)
- [ ] Redis (idempotency cache)
- [ ] RabbitMQ (event bus)
- [ ] NGINX (API Gateway)
- [ ] Docker Compose orchestration
- [ ] SSL/TLS certificates
- [ ] Environment variables management

### Security
- [ ] JWT authentication
- [ ] Password hashing (BCrypt)
- [ ] API rate limiting
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] CORS configuration

### Testing
- [ ] Unit tests (>80% coverage)
- [ ] Integration tests
- [ ] E2E P2P transfer test
- [ ] Idempotency test (duplicate requests)
- [ ] Fraud detection test
- [ ] Load testing (1000 req/s)

---

## 🚨 CRITICAL RULES (MUST FOLLOW)

1. **NEVER use FLOAT for money** → Use BIGINT cents
2. **NEVER update ledger_entries** → Create reversals instead
3. **NEVER skip idempotency_key** → Every payment needs it
4. **NEVER block on RabbitMQ events** → Async only
5. **NEVER delete audit_events** → Immutable by design
6. **ALWAYS use @Transactional(SERIALIZABLE)** → For ledger writes
7. **ALWAYS validate debits = credits** → Constraint enforces this
8. **ALWAYS cache idempotency responses** → 24h TTL

---

## 📖 REFERENCE DOCUMENTS

| Document | Purpose |
|----------|---------|
| [finflow_architecture_guide.md](../plan-guide/finflow_architecture_guide.md) | Complete architecture with diagrams |
| [developer_handbook.md](../plan-guide/developer_handbook.md) | Full implementation guide |
| [fintech-double-entry-backend-guide.md](Downloads) | Double-entry accounting deep dive |
| [complete-data-flow-state-machines.md](Downloads) | Transaction lifecycle (15 steps) |
| [claude-ai-developer-kit-xupay.md](./memory-bank/claude-ai-developer-kit-xupay.md) | Development workflow guide |

---

## 🎯 MVP SUCCESS CRITERIA

- [ ] User can register with email + password
- [ ] User can login (JWT token returned)
- [ ] User can complete KYC (upload document)
- [ ] Admin can verify KYC (changes tier)
- [ ] User can create wallet
- [ ] User can check wallet balance (calculated from ledger)
- [ ] User can send P2P transfer
- [ ] Transfer enforces KYC tier limits
- [ ] Duplicate transfer rejected (idempotency)
- [ ] Fraud rules flag suspicious transfers
- [ ] AML check logs daily volumes
- [ ] Audit events logged for all actions
- [ ] SAR auto-created for high-risk users
- [ ] `docker-compose up` starts everything
- [ ] Swagger API docs accessible
- [ ] Balance sheet always balances (debits=credits)

---