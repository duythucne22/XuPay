package models

import (
	"time"

	"github.com/google/uuid"
)

// FraudCheckStatus represents the status of a fraud check
type FraudCheckStatus string

const (
	FraudCheckStatusPending   FraudCheckStatus = "PENDING"
	FraudCheckStatusProcessing FraudCheckStatus = "PROCESSING"
	FraudCheckStatusCompleted FraudCheckStatus = "COMPLETED"
	FraudCheckStatusFailed    FraudCheckStatus = "FAILED"
)

// FraudDecision represents the decision made by fraud detection
type FraudDecision string

const (
	FraudDecisionApprove FraudDecision = "APPROVE"
	FraudDecisionReview  FraudDecision = "REVIEW"
	FraudDecisionDecline FraudDecision = "DECLINE"
	FraudDecisionBlock   FraudDecision = "BLOCK"
)

// RiskLevel represents the risk level of a transaction
type RiskLevel string

const (
	RiskLevelLow      RiskLevel = "LOW"
	RiskLevelMedium   RiskLevel = "MEDIUM"
	RiskLevelHigh     RiskLevel = "HIGH"
	RiskLevelCritical RiskLevel = "CRITICAL"
)

// FraudCheck represents a fraud detection check
type FraudCheck struct {
	ID            uuid.UUID        `json:"id" db:"id"`
	PaymentID     uuid.UUID        `json:"payment_id" db:"payment_id"`
	MerchantID    uuid.UUID        `json:"merchant_id" db:"merchant_id"`
	CustomerID    uuid.UUID        `json:"customer_id" db:"customer_id"`
	Status        FraudCheckStatus `json:"status" db:"status"`
	Decision      FraudDecision    `json:"decision" db:"decision"`
	RiskLevel     RiskLevel        `json:"risk_level" db:"risk_level"`
	RiskScore     float64          `json:"risk_score" db:"risk_score"` // 0-100
	Amount        int64            `json:"amount" db:"amount"`
	Currency      string           `json:"currency" db:"currency"`
	IpAddress     string           `json:"ip_address" db:"ip_address"`
	Country       string           `json:"country" db:"country"`
	DeviceFingerprint *string      `json:"device_fingerprint,omitempty" db:"device_fingerprint"`
	UserAgent     string           `json:"user_agent" db:"user_agent"`
	Email         string           `json:"email" db:"email"`
	PhoneNumber   *string          `json:"phone_number,omitempty" db:"phone_number"`
	BillingAddress []byte          `json:"billing_address" db:"billing_address"` // JSONB
	ShippingAddress []byte         `json:"shipping_address" db:"shipping_address"` // JSONB
	Metadata      []byte           `json:"metadata" db:"metadata"` // JSONB
	Reasons       []byte           `json:"reasons" db:"reasons"` // JSONB array of strings
	ProcessedAt   *time.Time       `json:"processed_at,omitempty" db:"processed_at"`
	CreatedAt     time.Time        `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time        `json:"updated_at" db:"updated_at"`
}

// FraudRule represents a fraud detection rule
type FraudRule struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	Name        string     `json:"name" db:"name"`
	Description string     `json:"description" db:"description"`
	RuleType    string     `json:"rule_type" db:"rule_type"` // VELOCITY, GEOLOCATION, AMOUNT, PATTERN, etc.
	Conditions  []byte     `json:"conditions" db:"conditions"` // JSONB
	Action      string     `json:"action" db:"action"` // APPROVE, REVIEW, DECLINE, BLOCK
	Weight      float64    `json:"weight" db:"weight"` // Rule weight for scoring
	IsActive    bool       `json:"is_active" db:"is_active"`
	Priority    int        `json:"priority" db:"priority"`
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`
}

// FraudRuleExecution represents the execution of a fraud rule
type FraudRuleExecution struct {
	ID           uuid.UUID  `json:"id" db:"id"`
	FraudCheckID uuid.UUID  `json:"fraud_check_id" db:"fraud_check_id"`
	RuleID       uuid.UUID  `json:"rule_id" db:"rule_id"`
	RuleName     string     `json:"rule_name" db:"rule_name"`
	Matched      bool       `json:"matched" db:"matched"`
	Score        float64    `json:"score" db:"score"`
	Reason       string     `json:"reason" db:"reason"`
	Details      []byte     `json:"details" db:"details"` // JSONB
	ExecutedAt   time.Time  `json:"executed_at" db:"executed_at"`
}

// FraudPattern represents known fraud patterns
type FraudPattern struct {
	ID           uuid.UUID  `json:"id" db:"id"`
	PatternType  string     `json:"pattern_type" db:"pattern_type"` // CARD, EMAIL, IP, DEVICE, etc.
	PatternValue string     `json:"pattern_value" db:"pattern_value"`
	Reason       string     `json:"reason" db:"reason"`
	Severity     RiskLevel  `json:"severity" db:"severity"`
	IsBlacklisted bool      `json:"is_blacklisted" db:"is_blacklisted"`
	ExpiresAt    *time.Time `json:"expires_at,omitempty" db:"expires_at"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at" db:"updated_at"`
}

// VelocityCheck represents velocity-based fraud checks
type VelocityCheck struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	EntityType  string     `json:"entity_type" db:"entity_type"` // CARD, EMAIL, IP, CUSTOMER
	EntityValue string     `json:"entity_value" db:"entity_value"`
	TimeWindow  string     `json:"time_window" db:"time_window"` // 1h, 24h, 7d, etc.
	Count       int        `json:"count" db:"count"`
	TotalAmount int64      `json:"total_amount" db:"total_amount"`
	Threshold   int        `json:"threshold" db:"threshold"`
	Exceeded    bool       `json:"exceeded" db:"exceeded"`
	WindowStart time.Time  `json:"window_start" db:"window_start"`
	WindowEnd   time.Time  `json:"window_end" db:"window_end"`
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
}

// GeolocationCheck represents geolocation-based fraud checks
type GeolocationCheck struct {
	ID               uuid.UUID  `json:"id" db:"id"`
	FraudCheckID     uuid.UUID  `json:"fraud_check_id" db:"fraud_check_id"`
	IpAddress        string     `json:"ip_address" db:"ip_address"`
	Country          string     `json:"country" db:"country"`
	City             *string    `json:"city,omitempty" db:"city"`
	Latitude         *float64   `json:"latitude,omitempty" db:"latitude"`
	Longitude        *float64   `json:"longitude,omitempty" db:"longitude"`
	IsProxy          bool       `json:"is_proxy" db:"is_proxy"`
	IsVpn            bool       `json:"is_vpn" db:"is_vpn"`
	IsTor            bool       `json:"is_tor" db:"is_tor"`
	IsHighRiskCountry bool      `json:"is_high_risk_country" db:"is_high_risk_country"`
	RiskScore        float64    `json:"risk_score" db:"risk_score"`
	CreatedAt        time.Time  `json:"created_at" db:"created_at"`
}

// DeviceFingerprint represents device fingerprinting data
type DeviceFingerprint struct {
	ID              uuid.UUID  `json:"id" db:"id"`
	FingerprintHash string     `json:"fingerprint_hash" db:"fingerprint_hash"`
	UserAgent       string     `json:"user_agent" db:"user_agent"`
	ScreenResolution *string   `json:"screen_resolution,omitempty" db:"screen_resolution"`
	Timezone        *string    `json:"timezone,omitempty" db:"timezone"`
	Language        *string    `json:"language,omitempty" db:"language"`
	Plugins         []byte     `json:"plugins" db:"plugins"` // JSONB
	FirstSeen       time.Time  `json:"first_seen" db:"first_seen"`
	LastSeen        time.Time  `json:"last_seen" db:"last_seen"`
	TransactionCount int       `json:"transaction_count" db:"transaction_count"`
	FraudCount      int        `json:"fraud_count" db:"fraud_count"`
	IsBlacklisted   bool       `json:"is_blacklisted" db:"is_blacklisted"`
}

// FraudAlert represents alerts generated by the fraud system
type FraudAlert struct {
	ID           uuid.UUID  `json:"id" db:"id"`
	FraudCheckID uuid.UUID  `json:"fraud_check_id" db:"fraud_check_id"`
	PaymentID    uuid.UUID  `json:"payment_id" db:"payment_id"`
	AlertType    string     `json:"alert_type" db:"alert_type"`
	Severity     RiskLevel  `json:"severity" db:"severity"`
	Message      string     `json:"message" db:"message"`
	Details      []byte     `json:"details" db:"details"` // JSONB
	IsResolved   bool       `json:"is_resolved" db:"is_resolved"`
	ResolvedBy   *uuid.UUID `json:"resolved_by,omitempty" db:"resolved_by"`
	ResolvedAt   *time.Time `json:"resolved_at,omitempty" db:"resolved_at"`
	Notes        *string    `json:"notes,omitempty" db:"notes"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at" db:"updated_at"`
}
