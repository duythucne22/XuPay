# Payment Service API Documentation 🚀

## Quick overview
- **Service**: Payment Service (wallets, transfers, ledgering, fraud detection, idempotency)
- **Local base URL**: `http://localhost:8082` (adjust for your environment)
- **Auth**: JWT Bearer tokens are required for most endpoints. Add header: `Authorization: Bearer <token>`

---

## Important concepts ⚠️
- **Idempotency**: Transfers include an idempotency key (header `X-Idempotency-Key` or body field `idempotencyKey`) to avoid duplicate processing.
- **Fraud rules**: Transactions are evaluated by the FraudDetectionService which may return actions: ALLOW, REVIEW, BLOCK.
- **Redis**: Service includes `RedisConfig`—used for caching or distributed short-lived data (locks, rate limiting). Tests mock Redis or use Testcontainers for integration.

---

## Endpoints (Controller-level) 🔧

### Transactions

#### Create / Transfer
- **POST** `/api/payments/transfer`
- **Auth**: Required
- **Headers**: `Content-Type: application/json`, optional `X-Idempotency-Key: <uuid>`

**Request body**:
```json
{
  "idempotencyKey": "11111111-1111-1111-1111-111111111111",
  "fromUserId": "11111111-1111-1111-1111-111111111111",
  "toUserId": "22222222-2222-2222-2222-222222222222",
  "amountCents": 10000,
  "description": "Payment for order #123",
  "ipAddress": "127.0.0.1",
  "userAgent": "XUPayClient/1.0"
}
```

**Responses**:
- **201 Created** — Completed immediately
- **200 OK** — Processing (async) — returns a transfer resource with status `PROCESSING`

**Example response (completed)**:
```json
{
  "transactionId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "idempotencyKey": "11111111-1111-1111-1111-111111111111",
  "fromUserId": "11111111-1111-1111-1111-111111111111",
  "toUserId": "22222222-2222-2222-2222-222222222222",
  "amountCents": 10000,
  "amount": 100.00,
  "currency": "VND",
  "status": "COMPLETED",
  "createdAt": "2025-12-21T11:00:00"
}
```

---

#### Get Transaction Detail
- **GET** `/api/payments/{transactionId}`
- **Auth**: Required
- **Response**: `TransactionDetailResponse` with status, amount, description, timestamps

#### Get by Idempotency Key
- **GET** `/api/payments/idempotency/{idempotencyKey}`
- **Auth**: Required
- Returns existing transfer if previously processed, otherwise 404

#### List Transactions (filter by user)
- **GET** `/api/payments?userId={uuid}&page=0&size=20`
- **Auth**: Required
- Returns paged transaction results

---

### Wallets

#### Create Wallet
- **POST** `/api/wallets`
- **Auth**: Required

**Request**:
```json
{
  "userId": "11111111-1111-1111-1111-111111111111",
  "walletType": "PERSONAL",
  "currency": "VND"
}
```

**Response (201)**:
```json
{
  "walletId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "userId": "11111111-1111-1111-1111-111111111111",
  "glAccountCode": "GL-100",
  "walletType": "PERSONAL",
  "currency": "VND",
  "balanceCents": 0,
  "isActive": true,
  "createdAt": "2025-12-21T11:05:00"
}
```

#### Get Wallet By User
- **GET** `/api/wallets/user/{userId}`
- **Auth**: Required
- **Response**: `WalletBalanceResponse` (balanceCents, amount, currency, flags)

#### Get Wallet Balance
- **GET** `/api/wallets/{walletId}/balance`
- **Auth**: Required

#### Freeze / Unfreeze Wallet
- **PUT** `/api/wallets/{walletId}/freeze`
- **Auth**: Required (admin in some deployments)

**Request**:
```json
{ "freeze": true, "reason": "Fraud risk" }
```

**Response**: 200 OK (no body) or 409 Conflict if already frozen

---

## Error responses & status codes ❗
- 400 Bad Request — validation errors
- 401 Unauthorized — missing/invalid JWT
- 403 Forbidden — insufficient permissions
- 404 Not Found — resource missing
- 409 Conflict — idempotency or state conflicts (e.g., already frozen)
- 422 Unprocessable Entity — domain validation (e.g., insufficient funds)
- 500 Internal Server Error — unexpected server errors

Errors return a JSON `ErrorResponse`:
```json
{ "code": "INSUFFICIENT_FUNDS", "message": "Not enough balance", "timestamp": "..." }
```

---

## Testing & dev notes ✅
- Controller tests: use `@WebMvcTest` and `@MockBean TransactionService` / `WalletService` (we added those tests already).
- Service tests: mock `UserServiceClient`, repositories, and `FraudDetectionService`. Use Mockito for unit tests.
- Integration tests: use Testcontainers for Postgres and Redis to validate end-to-end flows.

**Run tests**:
```bash
# Run all tests in payment-service module
cd backend/payment-service
mvn test
```

---

## Postman collection
- File: `Payment_Service_Postman_Collection.json` (import into Postman)
- Variables: `{{baseUrl}}`, `{{jwt_token}}`, `{{idempotencyKey}}`

---

## OpenAPI / Swagger
- The project does not include an OpenAPI config by default.
- To enable, add the `springdoc-openapi-ui` dependency and a tiny config class. Swagger UI will be available at `/swagger-ui.html` and JSON at `/v3/api-docs`.

Dependency example (Maven):
```xml
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  <version>2.1.0</version>
</dependency>
```

---

## cURL examples
Create transfer (idempotent):
```bash
curl -X POST {{baseUrl}}/api/payments/transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Idempotency-Key: $(uuidgen)" \
  -d '{"idempotencyKey":"11111111-1111-1111-1111-111111111111","fromUserId":"11111111-1111-1111-1111-111111111111","toUserId":"22222222-2222-2222-2222-222222222222","amountCents":10000,"description":"Payment"}'
```

Get wallet balance:
```bash
curl -X GET {{baseUrl}}/api/wallets/{{walletId}}/balance -H "Authorization: Bearer $TOKEN"
```

---

## Notes & next steps 💡
- I can export the OpenAPI JSON automatically (if you add springdoc) and generate a TypeScript axios client like I did for the User Service.
- I can also add Postman tests (scripts) for idempotency and fraud scenarios if you want.
