# Frontend Layer Architecture - Visual Guide

## File Organization (Clean Structure) 📁

```
frontend/xupay-frontend/
│
├── src/
│   ├── lib/                          ← Core API clients
│   │   ├── paymentServiceClient.ts   ✅ Payment API (real)
│   │   ├── userServiceClient.ts      ✅ User API (real)
│   │   ├── mockPaymentClient.ts      🧪 Payment mock
│   │   ├── mockUserClient.ts         🧪 User mock
│   │   ├── mock-data.ts              📊 Shared test data
│   │   └── api/                      ⚠️ DEPRECATED (old approach)
│   │
│   ├── mocks/                        ← MSW setup
│   │   ├── handlers.ts               🌐 HTTP interceptors
│   │   ├── browser.ts                🔧 Worker initialization
│   │   └── index.ts                  📦 Exports
│   │
│   ├── hooks/api/                    ← React Query hooks
│   │   ├── useAuth.new.ts            ✅ Auth hooks (new)
│   │   ├── useTransactions.new.ts    ✅ Transaction hooks (new)
│   │   ├── useWallets.new.ts         ✅ Wallet hooks (new)
│   │   ├── useAuth.ts                ⚠️ Old (to migrate)
│   │   ├── useTransactions.ts        ⚠️ Old (to migrate)
│   │   └── useWallets.ts             ⚠️ Old (to migrate)
│   │
│   ├── providers/
│   │   └── ReactQueryProvider.tsx    🚀 Auto-starts MSW
│   │
│   └── components/                   ← UI components
│       └── features/
│
├── public/
│   └── mockServiceWorker.js          🔧 MSW service worker (generated)
│
├── .env.local.example                📝 Config template
├── .env.local                        🔒 Your config (gitignored)
│
└── Documentation:
    ├── API_ARCHITECTURE.md           📚 Architecture guide
    ├── MOCK_SETUP_COMPLETE.md        ✅ Implementation summary
    ├── setup-mocks.ps1               🔧 Windows setup script
    └── setup-mocks.sh                🔧 Linux/Mac setup script
```

---

## Request Flow (with Mocks) 🔁

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER INTERACTION                                             │
│    Component: QuickActions.tsx, TransferForm.tsx, etc.         │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. REACT QUERY HOOK                                             │
│    useTransfer() from useTransactions.new.ts                    │
│    • Manages loading/error states                              │
│    • Handles cache invalidation                                │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. SERVICE CLIENT                                               │
│    getPaymentServiceClient()                                    │
│    ├─ Checks: NEXT_PUBLIC_USE_MOCKS                           │
│    ├─ IF true  → MockPaymentServiceClient                     │
│    └─ IF false → PaymentServiceClient (real)                  │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
         ┌───────────────────┴────────────────────┐
         │                                        │
         ↓ MOCK MODE                     REAL MODE ↓
┌─────────────────────┐            ┌──────────────────────┐
│ MockPaymentClient   │            │ axios HTTP request   │
│ • In-memory data    │            │ POST /api/payments/  │
│ • Instant response  │            │    transfer          │
│ • No backend needed │            │ → localhost:8082     │
└──────────┬──────────┘            └──────────┬───────────┘
           │                                  │
           ↓                                  ↓
  ┌────────────────┐              ┌─────────────────────┐
  │ Mock Data Store│              │ Backend Service     │
  │ (Map/Array)    │              │ (Java Spring Boot)  │
  └────────┬───────┘              └──────────┬──────────┘
           │                                  │
           └──────────────┬───────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. RESPONSE                                                     │
│    TransferResponse { transactionId, status, ... }             │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. REACT QUERY CACHE                                            │
│    • Stores response                                            │
│    • Invalidates related queries (wallet balance, tx list)     │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. UI UPDATE                                                    │
│    • Success message shown                                      │
│    • RecentTransactions.tsx updates                            │
│    • Balance refreshes                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## MSW HTTP Interception (Alternative to Mock Clients) 🌐

```
Browser makes HTTP request:
  POST http://localhost:8082/api/payments/transfer
         ↓
    ┌────────────────────┐
    │ Service Worker     │  (public/mockServiceWorker.js)
    │ Intercepts request │
    └─────────┬──────────┘
              ↓
    ┌────────────────────┐
    │ MSW Handlers       │  (src/mocks/handlers.ts)
    │ Matches URL/method │
    └─────────┬──────────┘
              ↓
    ┌────────────────────┐
    │ Returns mock JSON  │
    │ { transactionId,   │
    │   status: 'DONE',  │
    │   ...}             │
    └─────────┬──────────┘
              ↓
    Response received by axios/fetch
    (client thinks it's real!)
```

**Note**: MSW is useful when you want to test real HTTP logic (headers, errors, retry) without changing client code.

---

## Mock vs Real - Decision Matrix 🎯

| Scenario | Use Mock Clients | Use MSW | Use Real Backend |
|----------|-----------------|---------|------------------|
| **Local UI dev (no backend)** | ✅ | ✅ | ❌ |
| **Component unit tests** | ✅ | ❌ | ❌ |
| **HTTP/network tests** | ❌ | ✅ | ❌ |
| **Integration tests** | ❌ | ❌ | ✅ |
| **E2E tests** | ❌ | ⚠️ (partial) | ✅ |
| **Prod/staging** | ❌ | ❌ | ✅ |

**Recommendation**: Use **both approaches** for maximum flexibility:
- **Mock clients** for fast unit tests
- **MSW** for realistic HTTP behavior testing
- **Real backend** for integration/E2E tests

---

## Environment Toggle 🔄

```env
# .env.local (development - no backend)
NEXT_PUBLIC_USE_MOCKS=true

# .env.local (local with backend)
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:8081
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:8082

# .env.production (deployed)
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_USER_SERVICE_URL=https://api.xupay.com/user
NEXT_PUBLIC_PAYMENT_SERVICE_URL=https://api.xupay.com/payment
```

---

## Type Safety Chain 🔗

```typescript
Backend DTO (Java)
    ↓
paymentServiceClient.ts interfaces
    ↓
TransferRequest, TransferResponse, etc.
    ↓
useTransactions.new.ts (React Query)
    ↓
Component props/state
    ↓
UI renders
```

**All type-safe** ✅ - TypeScript catches mismatches at compile time.

---

## Quick Commands 💻

```bash
# Setup (first time)
npm install msw --save-dev
npx msw init public/ --save
cp .env.local.example .env.local

# Development (mock mode)
NEXT_PUBLIC_USE_MOCKS=true npm run dev

# Development (real backend)
NEXT_PUBLIC_USE_MOCKS=false npm run dev

# Run tests with mocks
npm test

# Build production (no mocks)
npm run build
```

---

## Status Legend

- ✅ **Complete & tested**
- 🧪 **Mock implementation**
- 🌐 **Network interceptor**
- 🔧 **Configuration**
- ⚠️ **Deprecated/legacy**
- 🔄 **Needs migration**
- 📦 **Ready to use**
