# Fraud Detection Service

An intelligent microservice for real-time fraud detection and risk assessment in the XuPay payment gateway system.

## Overview

The Fraud Detection Service is responsible for:
- Real-time transaction fraud analysis
- Risk scoring and decision making
- Rule-based fraud detection
- Pattern matching and blacklist management
- Velocity checks
- Geolocation analysis
- Device fingerprinting
- Alert management

## Architecture

### Directory Structure

```
fraud-service/
├── cmd/
│   └── server/              # Main application entry point
├── internal/
│   ├── handlers/            # HTTP/gRPC handlers
│   ├── models/              # Data models and schemas
│   ├── repository/          # Database layer
│   ├── service/             # Business logic
│   ├── config/              # Configuration management
│   └── middleware/          # Middleware components
├── pkg/
│   └── proto/               # Protocol buffer definitions
├── migrations/              # Database migrations
├── docs/                    # Additional documentation
├── go.mod
└── go.sum
```

## Data Models

### Core Entities

#### FraudCheck
The main fraud analysis entity:
- **ID**: Unique check identifier (UUID)
- **Payment ID**: Reference to payment being checked
- **Status**: Check status (Pending, Processing, Completed, Failed)
- **Decision**: Risk decision (Approve, Review, Decline, Block)
- **Risk Level**: Risk category (Low, Medium, High, Critical)
- **Risk Score**: Numerical score (0-100)
- **Reasons**: List of fraud indicators found
- **Transaction Details**: Amount, currency, payment method
- **User Context**: IP address, device fingerprint, location
- **Contact Info**: Email, phone number
- **Addresses**: Billing and shipping addresses

#### Fraud Decision Flow
```
CHECK INITIATED → PROCESSING → DECISION
                              ├─ APPROVE (Risk: Low)
                              ├─ REVIEW (Risk: Medium)
                              ├─ DECLINE (Risk: High)
                              └─ BLOCK (Risk: Critical)
```

#### FraudRule
Configurable fraud detection rules:
- Rule name and description
- Rule type (Velocity, Geolocation, Amount, Pattern, etc.)
- Conditions (JSONB for flexible rule definition)
- Action (Approve, Review, Decline, Block)
- Weight (contribution to risk score)
- Priority (execution order)
- Active status

#### FraudRuleExecution
Audit trail of rule executions:
- Rule that was executed
- Whether it matched
- Score contribution
- Reason and details

#### FraudPattern
Blacklist/whitelist patterns:
- Pattern type (Card, Email, IP, Device)
- Pattern value
- Severity level
- Expiration date
- Reason for listing

#### VelocityCheck
Transaction velocity monitoring:
- Entity type (Card, Email, IP, Customer)
- Time window (1h, 24h, 7d)
- Transaction count
- Total amount
- Threshold exceeded flag

#### GeolocationCheck
IP-based location analysis:
- IP address
- Country, city, coordinates
- Proxy/VPN/Tor detection
- High-risk country flag
- Risk score

#### DeviceFingerprint
Device identification and tracking:
- Fingerprint hash
- Browser and system information
- Transaction history
- Fraud count
- Blacklist status

#### FraudAlert
System-generated alerts:
- Alert type and severity
- Associated payment and fraud check
- Resolution status
- Investigation notes

## Fraud Detection Strategies

### 1. Rule-Based Detection

Rules are evaluated based on:
- **Velocity Rules**: Transaction frequency per time window
- **Amount Rules**: Unusual transaction amounts
- **Geolocation Rules**: Location mismatch or high-risk countries
- **Pattern Rules**: Known fraud patterns
- **Time Rules**: Unusual transaction times

### 2. Risk Scoring

Risk score (0-100) is calculated by:
```
Total Risk Score = Σ(Rule_i × Weight_i)
```

Risk levels:
- **Low** (0-25): Approve automatically
- **Medium** (26-50): Flag for review
- **High** (51-75): Decline transaction
- **Critical** (76-100): Block customer

### 3. Blacklist/Whitelist

Pattern matching against known fraud indicators:
- Card tokens
- Email addresses
- IP addresses
- Device fingerprints

### 4. Velocity Checks

Monitor transaction frequency:
- Transactions per hour/day/week
- Amount spent per time period
- Per card, customer, IP, or device

### 5. Geolocation Analysis

Location-based risk assessment:
- IP geolocation lookup
- Country risk scoring
- Proxy/VPN detection
- Location velocity (impossible travel)

### 6. Device Fingerprinting

Track and analyze devices:
- Browser fingerprint
- Screen resolution
- Timezone and language
- Historical behavior

## Database Schema

### Tables
- `fraud_checks` - Fraud analysis records
- `fraud_rules` - Configurable detection rules
- `fraud_rule_executions` - Rule execution logs
- `fraud_patterns` - Blacklist/whitelist patterns
- `velocity_checks` - Velocity tracking
- `geolocation_checks` - IP location data
- `device_fingerprints` - Device tracking
- `fraud_alerts` - System alerts

### Key Indexes
- Lookup by payment ID
- Filter by decision and risk level
- Time-based queries
- Pattern matching
- Entity lookups for velocity checks

## API Endpoints

### gRPC API

```protobuf
service FraudService {
  rpc CheckFraud(CheckFraudRequest) returns (CheckFraudResponse);
  rpc GetFraudCheck(GetFraudCheckRequest) returns (GetFraudCheckResponse);
  rpc ListFraudChecks(ListFraudChecksRequest) returns (ListFraudChecksResponse);
  rpc CreateFraudRule(CreateFraudRuleRequest) returns (CreateFraudRuleResponse);
  rpc UpdateFraudRule(UpdateFraudRuleRequest) returns (UpdateFraudRuleResponse);
  rpc DeleteFraudRule(DeleteFraudRuleRequest) returns (DeleteFraudRuleResponse);
  rpc ListFraudRules(ListFraudRulesRequest) returns (ListFraudRulesResponse);
  rpc AddToBlacklist(AddToBlacklistRequest) returns (AddToBlacklistResponse);
  rpc RemoveFromBlacklist(RemoveFromBlacklistRequest) returns (RemoveFromBlacklistResponse);
  rpc CheckBlacklist(CheckBlacklistRequest) returns (CheckBlacklistResponse);
}
```

## Sample Fraud Rules

### Velocity Rule Example
```json
{
  "name": "High Velocity Cards",
  "rule_type": "VELOCITY",
  "conditions": {
    "entity_type": "CARD",
    "time_window": "1h",
    "max_transactions": "5",
    "max_amount": "1000000"
  },
  "action": "DECLINE",
  "weight": 30.0,
  "priority": 1
}
```

### Geolocation Rule Example
```json
{
  "name": "High Risk Countries",
  "rule_type": "GEOLOCATION",
  "conditions": {
    "high_risk_countries": ["XX", "YY", "ZZ"],
    "block_vpn": "true",
    "block_proxy": "true"
  },
  "action": "REVIEW",
  "weight": 25.0,
  "priority": 2
}
```

### Amount Rule Example
```json
{
  "name": "Large Transactions",
  "rule_type": "AMOUNT",
  "conditions": {
    "min_amount": "500000",
    "first_transaction": "true"
  },
  "action": "REVIEW",
  "weight": 20.0,
  "priority": 3
}
```

## Dependencies

- **Gin**: HTTP web framework
- **pgx/v5**: PostgreSQL driver
- **Redis**: Caching and real-time data
- **gRPC/Protobuf**: API definitions
- **IP Geolocation API**: For location lookups

## Configuration

```yaml
server:
  port: 8081
  grpc_port: 50052

database:
  host: localhost
  port: 5432
  name: fraud_db
  user: fraud_user
  password: ${DB_PASSWORD}
  max_connections: 25

redis:
  host: localhost
  port: 6379
  password: ${REDIS_PASSWORD}
  db: 1

geolocation:
  provider: maxmind
  api_key: ${GEOLOCATION_API_KEY}
  cache_ttl: 24h

risk_thresholds:
  approve_max: 25
  review_min: 26
  review_max: 50
  decline_min: 51
  decline_max: 75
  block_min: 76
```

## Integration with Payment Service

The Fraud Service is called by the Payment Service:

1. Payment Service creates a payment
2. Calls FraudService.CheckFraud() with transaction details
3. Fraud Service evaluates rules and returns decision
4. Payment Service acts on the decision:
   - **APPROVE**: Process payment
   - **REVIEW**: Hold for manual review
   - **DECLINE**: Reject payment
   - **BLOCK**: Block customer and reject

## Security Considerations

1. **Data Privacy**: Hash sensitive identifiers
2. **Access Control**: Restrict rule management
3. **Audit Logging**: Log all fraud decisions
4. **Rate Limiting**: Prevent API abuse
5. **Encryption**: Protect sensitive pattern data

## Getting Started

### Prerequisites
- Go 1.25.4 or later
- PostgreSQL 14+
- Redis 7+

### Setup

1. Initialize database:
```bash
psql -U postgres -f migrations/001_create_fraud_tables.sql
```

2. Configure environment:
```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=fraud_db
export REDIS_HOST=localhost
```

3. Build and run:
```bash
go build -o fraud-service cmd/server/main.go
./fraud-service
```

## Testing

```bash
go test ./...
```

## Monitoring

Key metrics to monitor:
- Fraud detection rate (true/false positives)
- Average check processing time
- Rule execution performance
- Decision distribution (Approve/Review/Decline/Block)
- Alert volume
- API latency

## Machine Learning Integration (Future)

Plans for ML-based fraud detection:
- [ ] Anomaly detection models
- [ ] Behavioral analysis
- [ ] Pattern recognition
- [ ] Adaptive risk scoring
- [ ] Feature engineering pipeline

## Future Enhancements

- [ ] Machine learning models
- [ ] Graph-based fraud detection
- [ ] Real-time streaming analytics
- [ ] Advanced reporting dashboard
- [ ] A/B testing for rules
- [ ] Consortium fraud data sharing
- [ ] Behavioral biometrics
