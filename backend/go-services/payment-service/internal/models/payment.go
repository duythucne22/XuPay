package models

import (
	"time"

	"github.com/google/uuid"
)

// PaymentStatus represents the status of a payment
type PaymentStatus string

const (
	PaymentStatusPending   PaymentStatus = "PENDING"
	PaymentStatusProcessing PaymentStatus = "PROCESSING"
	PaymentStatusCompleted PaymentStatus = "COMPLETED"
	PaymentStatusFailed    PaymentStatus = "FAILED"
	PaymentStatusCancelled PaymentStatus = "CANCELLED"
	PaymentStatusRefunded  PaymentStatus = "REFUNDED"
)

// PaymentMethod represents the payment method used
type PaymentMethod string

const (
	PaymentMethodCreditCard PaymentMethod = "CREDIT_CARD"
	PaymentMethodDebitCard  PaymentMethod = "DEBIT_CARD"
	PaymentMethodBankTransfer PaymentMethod = "BANK_TRANSFER"
	PaymentMethodWallet     PaymentMethod = "WALLET"
	PaymentMethodUPI        PaymentMethod = "UPI"
)

// Currency represents supported currencies
type Currency string

const (
	CurrencyUSD Currency = "USD"
	CurrencyEUR Currency = "EUR"
	CurrencyGBP Currency = "GBP"
	CurrencyINR Currency = "INR"
	CurrencyVND Currency = "VND"
)

// Payment represents the main payment entity
type Payment struct {
	ID              uuid.UUID     `json:"id" db:"id"`
	MerchantID      uuid.UUID     `json:"merchant_id" db:"merchant_id"`
	CustomerID      uuid.UUID     `json:"customer_id" db:"customer_id"`
	OrderID         string        `json:"order_id" db:"order_id"`
	Amount          int64         `json:"amount" db:"amount"` // Amount in smallest currency unit (e.g., cents)
	Currency        Currency      `json:"currency" db:"currency"`
	PaymentMethod   PaymentMethod `json:"payment_method" db:"payment_method"`
	Status          PaymentStatus `json:"status" db:"status"`
	Description     string        `json:"description" db:"description"`
	Metadata        []byte        `json:"metadata" db:"metadata"` // JSONB for flexible data
	FraudCheckID    *uuid.UUID    `json:"fraud_check_id,omitempty" db:"fraud_check_id"`
	FraudScore      *float64      `json:"fraud_score,omitempty" db:"fraud_score"`
	IpAddress       string        `json:"ip_address" db:"ip_address"`
	UserAgent       string        `json:"user_agent" db:"user_agent"`
	CreatedAt       time.Time     `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time     `json:"updated_at" db:"updated_at"`
	CompletedAt     *time.Time    `json:"completed_at,omitempty" db:"completed_at"`
	ErrorCode       *string       `json:"error_code,omitempty" db:"error_code"`
	ErrorMessage    *string       `json:"error_message,omitempty" db:"error_message"`
}

// PaymentCard represents card information (tokenized)
type PaymentCard struct {
	ID            uuid.UUID  `json:"id" db:"id"`
	PaymentID     uuid.UUID  `json:"payment_id" db:"payment_id"`
	CardToken     string     `json:"card_token" db:"card_token"` // Tokenized card number
	CardBrand     string     `json:"card_brand" db:"card_brand"`
	Last4         string     `json:"last4" db:"last4"`
	ExpiryMonth   int        `json:"expiry_month" db:"expiry_month"`
	ExpiryYear    int        `json:"expiry_year" db:"expiry_year"`
	CardholderName string    `json:"cardholder_name" db:"cardholder_name"`
	BillingAddress []byte     `json:"billing_address" db:"billing_address"` // JSONB
	CreatedAt     time.Time  `json:"created_at" db:"created_at"`
}

// PaymentTransaction represents individual transaction attempts
type PaymentTransaction struct {
	ID                  uuid.UUID     `json:"id" db:"id"`
	PaymentID           uuid.UUID     `json:"payment_id" db:"payment_id"`
	TransactionType     string        `json:"transaction_type" db:"transaction_type"` // AUTHORIZE, CAPTURE, REFUND
	Amount              int64         `json:"amount" db:"amount"`
	Status              PaymentStatus `json:"status" db:"status"`
	GatewayTransactionID *string      `json:"gateway_transaction_id,omitempty" db:"gateway_transaction_id"`
	GatewayResponse     []byte        `json:"gateway_response" db:"gateway_response"` // JSONB
	ErrorCode           *string       `json:"error_code,omitempty" db:"error_code"`
	ErrorMessage        *string       `json:"error_message,omitempty" db:"error_message"`
	CreatedAt           time.Time     `json:"created_at" db:"created_at"`
}

// Merchant represents the merchant entity
type Merchant struct {
	ID              uuid.UUID  `json:"id" db:"id"`
	Name            string     `json:"name" db:"name"`
	Email           string     `json:"email" db:"email"`
	ApiKey          string     `json:"api_key" db:"api_key"`
	WebhookURL      string     `json:"webhook_url" db:"webhook_url"`
	IsActive        bool       `json:"is_active" db:"is_active"`
	Settings        []byte     `json:"settings" db:"settings"` // JSONB
	CreatedAt       time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at" db:"updated_at"`
}

// Customer represents the customer entity
type Customer struct {
	ID           uuid.UUID  `json:"id" db:"id"`
	Email        string     `json:"email" db:"email"`
	Name         string     `json:"name" db:"name"`
	PhoneNumber  *string    `json:"phone_number,omitempty" db:"phone_number"`
	Address      []byte     `json:"address" db:"address"` // JSONB
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at" db:"updated_at"`
}

// PaymentWebhook represents webhook events for payment updates
type PaymentWebhook struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	PaymentID   uuid.UUID  `json:"payment_id" db:"payment_id"`
	MerchantID  uuid.UUID  `json:"merchant_id" db:"merchant_id"`
	EventType   string     `json:"event_type" db:"event_type"`
	Payload     []byte     `json:"payload" db:"payload"` // JSONB
	Status      string     `json:"status" db:"status"` // PENDING, SENT, FAILED
	Attempts    int        `json:"attempts" db:"attempts"`
	LastAttempt *time.Time `json:"last_attempt,omitempty" db:"last_attempt"`
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
}
