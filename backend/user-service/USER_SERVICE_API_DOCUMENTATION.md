# User Service API Documentation

A concise reference for the User Service API.

## Table of Contents
- [Base URL & Authentication](#base-url--authentication)
- [Authentication Endpoints](#authentication-endpoints)
- [User Profile & Limits](#user-profile--limits)
- [Contacts Management](#contacts-management)
- [KYC Document Management](#kyc-document-management)
- [Error Responses](#error-responses)
- [KYC Tiers & Limits](#kyc-tiers--limits)
- [Testing with cURL](#testing-with-curl)
- [OpenAPI / Swagger](#openapi--swagger)

---

## Base URL & Authentication

- Local: `http://localhost:8081`
- Docker: `http://user-service:8081`

Authentication is via JWT Bearer tokens.

Header example:
```http
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints (`/api/auth`)

### Register New User
- POST `/api/auth/register`
- Auth: Public

Request:
```json
{
  "email": "user@example.com",
  "password": "P@ssword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+84901234567"
}
```

Response (201):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2025-12-28T10:00:00Z",
  "user": {
    "id": "11111111-1111-1111-1111-111111111111",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+84901234567",
    "kycStatus": "PENDING",
    "kycTier": "TIER_0",
    "isActive": true,
    "createdAt": "2025-12-21T10:00:00Z"
  }
}
```

### Login
- POST `/api/auth/login`
- Auth: Public

Request:
```json
{
  "email": "user@example.com",
  "password": "P@ssword123"
}
```

Response (200): same token structure as Register.

### Logout
- POST `/api/auth/logout`
- Auth: Required
- Response: 204 No Content

### Validate Token
- GET `/api/auth/validate`
- Auth: Required
- Response: 200 OK

### Get Current User
- GET `/api/auth/me`
- Auth: Required

Response (200):
```json
{
  "id": "11111111-1111-1111-1111-111111111111",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+84901234567",
  "kycStatus": "APPROVED",
  "kycTier": "TIER_2",
  "isActive": true,
  "createdAt": "2025-12-21T10:00:00Z"
}
```

---

## User Profile & Limits (`/api/users`)

### Get My Profile
- GET `/api/users/me/profile`
- Auth: Required

Response (200):
```json
{
  "id": "11111111-1111-1111-1111-111111111111",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+84901234567",
  "dateOfBirth": "1990-01-15",
  "nationality": "USA",
  "kycStatus": "APPROVED",
  "kycTier": "TIER_2",
  "isActive": true,
  "isSuspended": false,
  "fraudScore": 10,
  "createdAt": "2025-12-21T10:00:00Z"
}
```

### Update My Profile
- PUT `/api/users/me/profile`
- Auth: Required

Request:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+84907654321",
  "dateOfBirth": "1992-05-15",
  "nationality": "VNM"
}
```

### Get My Transaction Limits
- GET `/api/users/me/limits`
- Auth: Required

Response (200):
```json
{
  "kycTier": "TIER_2",
  "dailySendLimitCents": 1000000,
  "dailyReceiveLimitCents": 2000000,
  "singleTransactionMaxCents": 500000,
  "monthlyVolumeLimitCents": 20000000,
  "maxTransactionsPerDay": 50,
  "maxTransactionsPerHour": 10,
  "canSendInternational": true,
  "canReceiveMerchantPayments": true
}
```

### Get My Daily Usage
- GET `/api/users/me/daily-usage`
- Auth: Required

Response (200):
```json
{
  "userId": "11111111-1111-1111-1111-111111111111",
  "usageDate": "2025-12-21",
  "totalSentCents": 500000,
  "totalSentCount": 5,
  "totalReceivedCents": 200000,
  "totalReceivedCount": 2,
  "hourlySentCounts": {
    "09": 2,
    "14": 3
  }
}
```

### Check Transaction Limit
- POST `/api/users/me/check-limit`
- Auth: Required

Request:
```json
{
  "amountCents": 100000,
  "type": "send"
}
```

Response (200):
```json
{
  "allowed": true,
  "reason": null,
  "remainingDailyCents": 900000
}
```

---

## Contacts Management (`/api/users/me/contacts`)

### Get My Contacts
- GET `/api/users/me/contacts`
- Auth: Required

Response (200):
```json
[
  {
    "id": "33333333-3333-3333-3333-333333333333",
    "contactUserId": "22222222-2222-2222-2222-222222222222",
    "email": "alice@example.com",
    "firstName": "Alice",
    "lastName": "Nguyen",
    "nickname": "Best Friend",
    "totalTransactions": 10,
    "lastTransactionAt": "2025-12-20T15:30:00Z",
    "isFavorite": false
  }
]
```

### Add Contact
- POST `/api/users/me/contacts`
- Auth: Required

Request:
```json
{
  "contactUserId": "22222222-2222-2222-2222-222222222222",
  "nickname": "My Friend"
}
```

Response (201): created contact object.

### Remove Contact
- DELETE `/api/users/me/contacts/{contactId}`
- Auth: Required
- Response: 204 No Content

---

## KYC Document Management (`/api/kyc`)

### Upload KYC Document
- POST `/api/kyc/upload-document`
- Auth: Required
- Content-Type: application/json

Request:
```json
{
  "documentType": "PASSPORT",
  "documentNumber": "P1234567",
  "documentCountry": "USA",
  "fileUrl": "https://s3.amazonaws.com/bucket/passport.jpg"
}
```

Document types: PASSPORT, DRIVERS_LICENSE, NATIONAL_ID, UTILITY_BILL, SELFIE

Response (201):
```json
{
  "id": "44444444-4444-4444-4444-444444444444",
  "userId": "11111111-1111-1111-1111-111111111111",
  "documentType": "PASSPORT",
  "documentNumber": "P1234567",
  "documentCountry": "USA",
  "fileUrl": "https://s3.amazonaws.com/bucket/passport.jpg",
  "fileSizeBytes": 1024000,
  "mimeType": "image/jpeg",
  "verificationStatus": "PENDING",
  "verificationNotes": null,
  "verifiedBy": null,
  "verifiedAt": null,
  "expiresAt": null,
  "createdAt": "2025-12-21T10:00:00Z",
  "updatedAt": "2025-12-21T10:00:00Z"
}
```

### Get My Documents
- GET `/api/kyc/documents`
- Auth: Required

### Get Document by ID
- GET `/api/kyc/{id}`
- Auth: Required (owner or admin with ROLE_ADMIN)

### Get Pending Documents (Admin Only)
- GET `/api/kyc/pending`
- Auth: Required (ROLE_ADMIN)

### Approve Document (Admin Only)
- POST `/api/kyc/{id}/approve`
- Auth: Required (ROLE_ADMIN)

Request:
```json
{
  "notes": "Document verified successfully"
}
```

Response (200): KYC document with verificationStatus: "APPROVED". Note: verifiedBy will contain the admin UUID (admin must have ROLE_ADMIN).

### Reject Document (Admin Only)
- POST `/api/kyc/{id}/reject`
- Auth: Required (ROLE_ADMIN)

Request:
```json
{
  "reason": "Document is blurry and unreadable"
}
```

Response (200): KYC document with verificationStatus: "REJECTED".

---

## Error Responses

Common error format:
```json
{
  "code": "USER_NOT_FOUND",
  "message": "User with ID 11111111-1111-1111-1111-111111111111 not found",
  "timestamp": "2025-12-21T10:00:00Z"
}
```

Common status codes:
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict
- 500 Internal Server Error

---

## KYC Tiers & Limits

| Tier | Daily Send | Daily Receive | Single Transaction | Monthly Volume | Restrictions |
| --- | --- | --- | --- | --- | --- |
| TIER_0 | $100 | $100 | $50 | $1,000 | No international |
| TIER_1 | $1,000 | $2,000 | $500 | $20,000 | No international |
| TIER_2 | $10,000 | $20,000 | $5,000 | $200,000 | International allowed |
| TIER_3 | $100,000 | $200,000 | $50,000 | $1,000,000 | Full access |

---

## Testing with cURL

Register:
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "P@ssword123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+84901234567"
  }'
```

Login:
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "P@ssword123"
  }'
```

Get Profile (with token):
```bash
curl -X GET http://localhost:8081/api/users/me/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## OpenAPI / Swagger

- Swagger UI: `http://localhost:8081/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8081/v3/api-docs`
