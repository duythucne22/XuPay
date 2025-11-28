# XuPay Schema Architecture Documentation

## Overview

This document provides a comprehensive overview of the schema architecture for the XuPay payment gateway system, focusing on the Payment and Fraud Detection services.

## Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      XuPay Platform                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐      ┌──────────────────┐           │
│  │  Payment Service │◄────►│  Fraud Service   │           │
│  │                  │      │                  │           │
│  │  - Payments      │      │  - Fraud Checks  │           │
│  │  - Transactions  │      │  - Rules Engine  │           │
│  │  - Merchants     │      │  - Risk Scoring  │           │
│  │  - Customers     │      │  - Blacklists    │           │
│  │  - Webhooks      │      │  - Alerts        │           │
│  └──────────────────┘      └──────────────────┘           │
│           │                          │                      │
│           │                          │                      │
│  ┌────────▼──────────────────────────▼──────────┐         │
│  │         Settlement Service                    │         │
│  │         - Payouts                             │         │
│  │         - Reconciliation                      │         │
│  └───────────────────────────────────────────────┘         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Payment Service Schema

### Entity Relationship Diagram

```
┌─────────────┐
│  Merchants  │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────┐     ┌──────────────┐
│  Payments   │────►│ PaymentCards │
└──────┬──────┘ 1:1 └──────────────┘
       │
       │ 1:N
       │
┌──────▼──────────────┐
│ PaymentTransactions │
└─────────────────────┘

┌────────────┐
│ Customers  │
└──────┬─────┘
       │
       │ 1:N
       │
┌──────▼──────┐
│  Payments   │
└─────────────┘

┌─────────────┐     ┌──────────────────┐
│  Payments   │────►│ PaymentWebhooks  │
└─────────────┘ 1:N └──────────────────┘
```

### Payment Status State Machine

```
     ┌─────────┐
     │ PENDING │
     └────┬────┘
          │
          ▼
   ┌────────────┐
   │ PROCESSING │
   └─────┬──────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌────────┐
│COMPLETED│ │ FAILED │
└─────────┘ └───┬────┘
                │
           ┌────┴─────┐
           │          │
           ▼          ▼
      ┌──────────┐ ┌──────────┐
      │CANCELLED │ │ REFUNDED │
      └──────────┘ └──────────┘
```

### Core Tables

#### merchants
| Column        | Type         | Description                    |
|---------------|--------------|--------------------------------|
| id            | UUID         | Primary key                    |
| name          | VARCHAR(255) | Merchant name                  |
| email         | VARCHAR(255) | Contact email (unique)         |
| api_key       | VARCHAR(255) | Authentication key (unique)    |
| webhook_url   | VARCHAR(512) | Webhook endpoint               |
| is_active     | BOOLEAN      | Account status                 |
| settings      | JSONB        | Configuration settings         |
| created_at    | TIMESTAMP    | Creation timestamp             |
| updated_at    | TIMESTAMP    | Last update timestamp          |

#### customers
| Column        | Type         | Description                    |
|---------------|--------------|--------------------------------|
| id            | UUID         | Primary key                    |
| email         | VARCHAR(255) | Customer email                 |
| name          | VARCHAR(255) | Customer name                  |
| phone_number  | VARCHAR(50)  | Phone number                   |
| address       | JSONB        | Address details                |
| created_at    | TIMESTAMP    | Creation timestamp             |
| updated_at    | TIMESTAMP    | Last update timestamp          |

#### payments
| Column         | Type         | Description                    |
|----------------|--------------|--------------------------------|
| id             | UUID         | Primary key                    |
| merchant_id    | UUID         | Foreign key to merchants       |
| customer_id    | UUID         | Foreign key to customers       |
| order_id       | VARCHAR(255) | Merchant order reference       |
| amount         | BIGINT       | Amount in smallest unit        |
| currency       | VARCHAR(3)   | Currency code (USD, EUR, etc.) |
| payment_method | VARCHAR(50)  | Payment method type            |
| status         | VARCHAR(50)  | Payment status                 |
| description    | TEXT         | Payment description            |
| metadata       | JSONB        | Additional data                |
| fraud_check_id | UUID         | Reference to fraud check       |
| fraud_score    | DECIMAL(5,2) | Risk score (0-100)             |
| ip_address     | VARCHAR(45)  | Customer IP address            |
| user_agent     | TEXT         | Browser user agent             |
| error_code     | VARCHAR(100) | Error code if failed           |
| error_message  | TEXT         | Error message if failed        |
| created_at     | TIMESTAMP    | Creation timestamp             |
| updated_at     | TIMESTAMP    | Last update timestamp          |
| completed_at   | TIMESTAMP    | Completion timestamp           |

#### payment_cards
| Column           | Type         | Description                    |
|------------------|--------------|--------------------------------|
| id               | UUID         | Primary key                    |
| payment_id       | UUID         | Foreign key to payments        |
| card_token       | VARCHAR(255) | Tokenized card number          |
| card_brand       | VARCHAR(50)  | Card brand (Visa, MC, etc.)    |
| last4            | VARCHAR(4)   | Last 4 digits                  |
| expiry_month     | INTEGER      | Expiry month (1-12)            |
| expiry_year      | INTEGER      | Expiry year                    |
| cardholder_name  | VARCHAR(255) | Name on card                   |
| billing_address  | JSONB        | Billing address                |
| created_at       | TIMESTAMP    | Creation timestamp             |

#### payment_transactions
| Column                | Type         | Description                    |
|-----------------------|--------------|--------------------------------|
| id                    | UUID         | Primary key                    |
| payment_id            | UUID         | Foreign key to payments        |
| transaction_type      | VARCHAR(50)  | Type (AUTHORIZE, CAPTURE, etc.)|
| amount                | BIGINT       | Transaction amount             |
| status                | VARCHAR(50)  | Transaction status             |
| gateway_transaction_id| VARCHAR(255) | Gateway transaction ID         |
| gateway_response      | JSONB        | Gateway API response           |
| error_code            | VARCHAR(100) | Error code if failed           |
| error_message         | TEXT         | Error message if failed        |
| created_at            | TIMESTAMP    | Creation timestamp             |

#### payment_webhooks
| Column        | Type         | Description                    |
|---------------|--------------|--------------------------------|
| id            | UUID         | Primary key                    |
| payment_id    | UUID         | Foreign key to payments        |
| merchant_id   | UUID         | Foreign key to merchants       |
| event_type    | VARCHAR(100) | Event type                     |
| payload       | JSONB        | Webhook payload                |
| status        | VARCHAR(50)  | Delivery status                |
| attempts      | INTEGER      | Delivery attempts              |
| last_attempt  | TIMESTAMP    | Last delivery attempt          |
| created_at    | TIMESTAMP    | Creation timestamp             |

## Fraud Service Schema

### Entity Relationship Diagram

```
┌──────────────┐
│ FraudChecks  │
└──────┬───────┘
       │
       │ 1:N
       │
┌──────▼──────────────┐     ┌──────────────┐
│ FraudRuleExecutions │────►│  FraudRules  │
└─────────────────────┘  N:1└──────────────┘

┌──────────────┐     ┌──────────────────┐
│ FraudChecks  │────►│ GeolocationChecks│
└──────────────┘ 1:1 └──────────────────┘

┌──────────────┐     ┌──────────────┐
│ FraudChecks  │────►│ FraudAlerts  │
└──────────────┘ 1:N └──────────────┘
```

### Fraud Decision Flow

```
  ┌──────────────────┐
  │ Fraud Check      │
  │ Initiated        │
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │ Execute Rules    │
  │ - Velocity       │
  │ - Geolocation    │
  │ - Pattern Match  │
  │ - Amount         │
  │ - Device         │
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │ Calculate Score  │
  │ Score = Σ(Rule × │
  │         Weight)  │
  └────────┬─────────┘
           │
      ┌────┴────┐
      │         │
      ▼         ▼
┌──────────┐ ┌──────────┐
│ Risk:    │ │ Risk:    │
│ Low      │ │ Medium   │
│ APPROVE  │ │ REVIEW   │
└──────────┘ └──────────┘
      ▼         ▼
┌──────────┐ ┌──────────┐
│ Risk:    │ │ Risk:    │
│ High     │ │ Critical │
│ DECLINE  │ │ BLOCK    │
└──────────┘ └──────────┘
```

### Core Tables

#### fraud_checks
| Column            | Type         | Description                    |
|-------------------|--------------|--------------------------------|
| id                | UUID         | Primary key                    |
| payment_id        | UUID         | Reference to payment           |
| merchant_id       | UUID         | Reference to merchant          |
| customer_id       | UUID         | Reference to customer          |
| status            | VARCHAR(50)  | Check status                   |
| decision          | VARCHAR(50)  | Fraud decision                 |
| risk_level        | VARCHAR(50)  | Risk level category            |
| risk_score        | DECIMAL(5,2) | Risk score (0-100)             |
| amount            | BIGINT       | Transaction amount             |
| currency          | VARCHAR(3)   | Currency code                  |
| ip_address        | VARCHAR(45)  | Customer IP                    |
| country           | VARCHAR(2)   | Country code                   |
| device_fingerprint| VARCHAR(255) | Device fingerprint hash        |
| user_agent        | TEXT         | Browser user agent             |
| email             | VARCHAR(255) | Customer email                 |
| phone_number      | VARCHAR(50)  | Customer phone                 |
| billing_address   | JSONB        | Billing address                |
| shipping_address  | JSONB        | Shipping address               |
| metadata          | JSONB        | Additional data                |
| reasons           | JSONB        | Array of fraud indicators      |
| processed_at      | TIMESTAMP    | Processing completion time     |
| created_at        | TIMESTAMP    | Creation timestamp             |
| updated_at        | TIMESTAMP    | Last update timestamp          |

#### fraud_rules
| Column      | Type         | Description                    |
|-------------|--------------|--------------------------------|
| id          | UUID         | Primary key                    |
| name        | VARCHAR(255) | Rule name (unique)             |
| description | TEXT         | Rule description               |
| rule_type   | VARCHAR(100) | Type (VELOCITY, GEOLOCATION)   |
| conditions  | JSONB        | Rule conditions                |
| action      | VARCHAR(50)  | Action to take                 |
| weight      | DECIMAL(5,2) | Score weight                   |
| is_active   | BOOLEAN      | Rule enabled status            |
| priority    | INTEGER      | Execution priority             |
| created_at  | TIMESTAMP    | Creation timestamp             |
| updated_at  | TIMESTAMP    | Last update timestamp          |

#### fraud_rule_executions
| Column        | Type         | Description                    |
|---------------|--------------|--------------------------------|
| id            | UUID         | Primary key                    |
| fraud_check_id| UUID         | Foreign key to fraud_checks    |
| rule_id       | UUID         | Foreign key to fraud_rules     |
| rule_name     | VARCHAR(255) | Rule name snapshot             |
| matched       | BOOLEAN      | Whether rule matched           |
| score         | DECIMAL(5,2) | Score contribution             |
| reason        | TEXT         | Match reason                   |
| details       | JSONB        | Execution details              |
| executed_at   | TIMESTAMP    | Execution timestamp            |

#### fraud_patterns
| Column         | Type         | Description                    |
|----------------|--------------|--------------------------------|
| id             | UUID         | Primary key                    |
| pattern_type   | VARCHAR(50)  | Type (CARD, EMAIL, IP, DEVICE) |
| pattern_value  | VARCHAR(255) | Pattern value                  |
| reason         | TEXT         | Why it's listed                |
| severity       | VARCHAR(50)  | Severity level                 |
| is_blacklisted | BOOLEAN      | Blacklist flag                 |
| expires_at     | TIMESTAMP    | Expiration time                |
| created_at     | TIMESTAMP    | Creation timestamp             |
| updated_at     | TIMESTAMP    | Last update timestamp          |

#### velocity_checks
| Column       | Type         | Description                    |
|--------------|--------------|--------------------------------|
| id           | UUID         | Primary key                    |
| entity_type  | VARCHAR(50)  | Entity type (CARD, EMAIL, IP)  |
| entity_value | VARCHAR(255) | Entity value                   |
| time_window  | VARCHAR(50)  | Time window (1h, 24h, 7d)      |
| count        | INTEGER      | Transaction count              |
| total_amount | BIGINT       | Total amount                   |
| threshold    | INTEGER      | Threshold limit                |
| exceeded     | BOOLEAN      | Threshold exceeded flag        |
| window_start | TIMESTAMP    | Window start time              |
| window_end   | TIMESTAMP    | Window end time                |
| created_at   | TIMESTAMP    | Creation timestamp             |

#### geolocation_checks
| Column             | Type         | Description                    |
|--------------------|--------------|--------------------------------|
| id                 | UUID         | Primary key                    |
| fraud_check_id     | UUID         | Foreign key to fraud_checks    |
| ip_address         | VARCHAR(45)  | IP address                     |
| country            | VARCHAR(2)   | Country code                   |
| city               | VARCHAR(255) | City name                      |
| latitude           | DECIMAL(10,7)| Latitude coordinate            |
| longitude          | DECIMAL(10,7)| Longitude coordinate           |
| is_proxy           | BOOLEAN      | Proxy detected                 |
| is_vpn             | BOOLEAN      | VPN detected                   |
| is_tor             | BOOLEAN      | Tor detected                   |
| is_high_risk_country| BOOLEAN     | High risk country flag         |
| risk_score         | DECIMAL(5,2) | Location risk score            |
| created_at         | TIMESTAMP    | Creation timestamp             |

#### device_fingerprints
| Column            | Type         | Description                    |
|-------------------|--------------|--------------------------------|
| id                | UUID         | Primary key                    |
| fingerprint_hash  | VARCHAR(255) | Fingerprint hash (unique)      |
| user_agent        | TEXT         | Browser user agent             |
| screen_resolution | VARCHAR(50)  | Screen resolution              |
| timezone          | VARCHAR(100) | Timezone                       |
| language          | VARCHAR(10)  | Browser language               |
| plugins           | JSONB        | Browser plugins                |
| first_seen        | TIMESTAMP    | First seen timestamp           |
| last_seen         | TIMESTAMP    | Last seen timestamp            |
| transaction_count | INTEGER      | Total transactions             |
| fraud_count       | INTEGER      | Fraud transactions             |
| is_blacklisted    | BOOLEAN      | Blacklist flag                 |

#### fraud_alerts
| Column        | Type         | Description                    |
|---------------|--------------|--------------------------------|
| id            | UUID         | Primary key                    |
| fraud_check_id| UUID         | Foreign key to fraud_checks    |
| payment_id    | UUID         | Reference to payment           |
| alert_type    | VARCHAR(100) | Alert type                     |
| severity      | VARCHAR(50)  | Alert severity                 |
| message       | TEXT         | Alert message                  |
| details       | JSONB        | Alert details                  |
| is_resolved   | BOOLEAN      | Resolution status              |
| resolved_by   | UUID         | Resolver user ID               |
| resolved_at   | TIMESTAMP    | Resolution timestamp           |
| notes         | TEXT         | Resolution notes               |
| created_at    | TIMESTAMP    | Creation timestamp             |
| updated_at    | TIMESTAMP    | Last update timestamp          |

## Integration Flow

### Payment Creation with Fraud Check

```
1. Client → Payment Service: CreatePayment()
2. Payment Service: Create payment record (status: PENDING)
3. Payment Service → Fraud Service: CheckFraud()
4. Fraud Service: Execute fraud rules
5. Fraud Service: Calculate risk score
6. Fraud Service → Payment Service: Return decision
7. Payment Service: Update payment with fraud_check_id and fraud_score
8. Based on decision:
   - APPROVE: Process payment (status: PROCESSING → COMPLETED)
   - REVIEW: Hold payment (status: PENDING)
   - DECLINE: Reject payment (status: FAILED)
   - BLOCK: Block customer and reject (status: FAILED)
9. Payment Service: Send webhook to merchant
```

## Data Retention and Archival

### Payment Service
- **Active Payments**: 90 days hot storage
- **Historical Payments**: Move to cold storage after 90 days
- **Retention Period**: 7 years for compliance

### Fraud Service
- **Active Fraud Checks**: 30 days hot storage
- **Historical Checks**: Move to cold storage after 30 days
- **Device Fingerprints**: Keep indefinitely
- **Blacklist Patterns**: Keep until expiration

## Performance Considerations

### Indexing Strategy
- Primary keys: UUID with B-tree indexes
- Foreign keys: Indexed for join performance
- Status fields: Indexed for filtering
- Timestamp fields: Indexed for time-range queries
- JSONB fields: GIN indexes for fast lookups

### Partitioning
- Payments table: Partition by created_at (monthly)
- Fraud checks table: Partition by created_at (monthly)
- Transactions table: Partition by created_at (monthly)

### Caching Strategy
- Redis for:
  - Active fraud rules
  - Blacklist patterns
  - Velocity counters
  - Session data
  - Hot merchant configurations

## Security

### Data Protection
- **Encryption at Rest**: All sensitive fields encrypted
- **Encryption in Transit**: TLS 1.3 for all communications
- **Tokenization**: Card data never stored in raw form
- **Hashing**: Sensitive patterns hashed with salt

### Access Control
- **API Authentication**: Merchant API keys
- **Internal Services**: mTLS certificates
- **Database**: Role-based access control
- **Audit Logging**: All data access logged

## Monitoring and Alerts

### Key Metrics
- Payment success/failure rates
- Fraud detection accuracy (precision/recall)
- API latency (p50, p95, p99)
- Database query performance
- Error rates by type

### Alerting Thresholds
- Payment failure rate > 5%
- Fraud false positive rate > 10%
- API latency p95 > 500ms
- Database connection pool > 80%
- Error rate > 1%

## Conclusion

This schema architecture provides a robust foundation for the XuPay payment gateway system, with clear separation of concerns between payment processing and fraud detection, comprehensive data models, and consideration for performance, security, and scalability.
