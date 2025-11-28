# Payment Service

A robust microservice for handling payment processing in the XuPay payment gateway system.

## Overview

The Payment Service is responsible for:
- Processing payment transactions
- Managing payment lifecycle (create, process, complete, refund, cancel)
- Storing payment and transaction data
- Managing merchant and customer information
- Handling payment webhooks
- Integrating with payment gateways

## Architecture

### Directory Structure

```
payment-service/
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

#### Payment
The main payment entity containing all transaction information:
- **ID**: Unique payment identifier (UUID)
- **Merchant ID**: Reference to the merchant
- **Customer ID**: Reference to the customer
- **Order ID**: Merchant's order reference
- **Amount**: Payment amount in smallest currency unit
- **Currency**: Currency code (USD, EUR, GBP, INR, VND)
- **Payment Method**: Type of payment (Credit Card, Debit Card, Bank Transfer, Wallet, UPI)
- **Status**: Current payment status (Pending, Processing, Completed, Failed, Cancelled, Refunded)
- **Fraud Check ID**: Reference to fraud detection result
- **Fraud Score**: Risk score from fraud detection
- **Metadata**: Flexible JSONB field for additional data

#### Payment Status Flow
```
PENDING → PROCESSING → COMPLETED
                    ↓
                  FAILED
                    ↓
                CANCELLED
                    ↓
                REFUNDED
```

#### PaymentCard
Tokenized card information (PCI-DSS compliant):
- Card token (no raw card numbers stored)
- Card brand
- Last 4 digits
- Expiry date
- Billing address

#### PaymentTransaction
Individual transaction attempts:
- Transaction type (Authorize, Capture, Refund, Void)
- Gateway transaction ID
- Gateway response
- Status and error details

#### Merchant
Merchant entity:
- API key for authentication
- Webhook URL for callbacks
- Settings and configuration

#### Customer
Customer entity:
- Contact information
- Billing address
- Payment history

#### PaymentWebhook
Webhook delivery tracking:
- Event type
- Payload
- Delivery status
- Retry attempts

## Database Schema

### Tables
- `merchants` - Merchant accounts
- `customers` - Customer profiles
- `payments` - Payment records
- `payment_cards` - Tokenized card data
- `payment_transactions` - Transaction attempts
- `payment_webhooks` - Webhook delivery logs

### Key Indexes
- Payment lookup by merchant, customer, order ID
- Status-based queries
- Time-based queries for reporting
- Fraud check references

## API Endpoints

### gRPC API

```protobuf
service PaymentService {
  rpc CreatePayment(CreatePaymentRequest) returns (CreatePaymentResponse);
  rpc GetPayment(GetPaymentRequest) returns (GetPaymentResponse);
  rpc ListPayments(ListPaymentsRequest) returns (ListPaymentsResponse);
  rpc UpdatePaymentStatus(UpdatePaymentStatusRequest) returns (UpdatePaymentStatusResponse);
  rpc ProcessPayment(ProcessPaymentRequest) returns (ProcessPaymentResponse);
  rpc RefundPayment(RefundPaymentRequest) returns (RefundPaymentResponse);
  rpc CancelPayment(CancelPaymentRequest) returns (CancelPaymentResponse);
}
```

## Dependencies

- **Gin**: HTTP web framework
- **pgx/v5**: PostgreSQL driver
- **Redis**: Caching and session management
- **gRPC/Protobuf**: API definitions
- **UUID**: Unique identifier generation

## Configuration

Configuration should be managed through environment variables or config files:

```yaml
server:
  port: 8080
  grpc_port: 50051

database:
  host: localhost
  port: 5432
  name: payment_db
  user: payment_user
  password: ${DB_PASSWORD}
  max_connections: 25

redis:
  host: localhost
  port: 6379
  password: ${REDIS_PASSWORD}
  db: 0

fraud_service:
  url: fraud-service:50052
  timeout: 5s

payment_gateway:
  provider: stripe
  api_key: ${GATEWAY_API_KEY}
```

## Integration with Fraud Service

The Payment Service integrates with the Fraud Service for risk assessment:

1. When a payment is created, it triggers a fraud check
2. The fraud service returns a risk score and decision
3. Based on the decision:
   - **APPROVE**: Payment proceeds normally
   - **REVIEW**: Payment is held for manual review
   - **DECLINE**: Payment is rejected
   - **BLOCK**: Customer/card is blocked

## Security Considerations

1. **PCI-DSS Compliance**: Never store raw card data
2. **Tokenization**: Use payment gateway tokenization
3. **API Authentication**: Use API keys for merchant authentication
4. **Data Encryption**: Encrypt sensitive data at rest and in transit
5. **Audit Logging**: Log all payment operations
6. **Rate Limiting**: Prevent abuse and brute force attacks

## Getting Started

### Prerequisites
- Go 1.25.4 or later
- PostgreSQL 14+
- Redis 7+

### Setup

1. Initialize database:
```bash
psql -U postgres -f migrations/001_create_payment_tables.sql
```

2. Configure environment:
```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=payment_db
export REDIS_HOST=localhost
```

3. Build and run:
```bash
go build -o payment-service cmd/server/main.go
./payment-service
```

## Testing

```bash
go test ./...
```

## Monitoring

Key metrics to monitor:
- Payment success/failure rates
- Average processing time
- Fraud rejection rate
- API latency
- Database connection pool
- Error rates by type

## Future Enhancements

- [ ] Support for additional payment methods
- [ ] Subscription and recurring payments
- [ ] Multi-currency support
- [ ] Payment routing and failover
- [ ] Advanced analytics and reporting
- [ ] Dispute and chargeback management
