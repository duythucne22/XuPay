# 🚀 FRONTEND-BACKEND INTEGRATION AUTOMATION GUIDE

> **Purpose:** Step-by-step guide for AI agent to wire Next.js frontend to Payment Service backend  
> **Architecture Pattern:** Mirror backend flow (DB → Entity → Repository → Mapper → Service → Controller)  
> **Status:** Complete implementation workflow  
> **Last Updated:** December 20, 2025

---

## 📊 ARCHITECTURE PATTERN COMPARISON

### Backend Flow (Spring Boot)
```
PostgreSQL Database
    ↓
Entity (JPA)
    ↓
Repository (JpaRepository)
    ↓
DTO Mapper (MapStruct)
    ↓
Service (Business Logic)
    ↓
Controller (REST Endpoints)
```

### Frontend Flow (Next.js) - **MIRROR PATTERN**
```
Backend API (Payment Service)
    ↓
API Types (TypeScript Interfaces)
    ↓
API Client (HTTP Layer)
    ↓
Adapter/Mapper (DTO → UI Types)
    ↓
React Query Hooks (Business Logic)
    ↓
React Components (UI Pages)
```

---

## 🎯 PHASE 5: BACKEND INTEGRATION (STEP-BY-STEP)

### CRITICAL RULE
**Do NOT skip layers.** Each layer has a specific purpose. Skipping causes:
- Type mismatches between backend and UI
- Enum casing errors (UPPERCASE vs lowercase)
- Amount handling bugs (cents vs decimal)
- Unmaintainable code

---

## 📋 LAYER 1: API TYPES (Backend Contract)

**Purpose:** Define TypeScript interfaces that EXACTLY match backend JSON responses.

**Authority:** Backend API contract from:
- `FRONTEND_INTEGRATION_GUIDE.md`
- `Payment Service Implementation Guide`
- Actual JSON responses from `API_TESTING_GUIDE.md`

### File: `src/lib/api/payment.types.ts`

**Requirements:**
1. **EXACT enum casing** - Backend uses UPPERCASE (e.g., `PERSONAL`, `COMPLETED`)
2. **Amount in cents** - Backend sends `amountCents: number` (not decimal)
3. **ISO timestamps** - `createdAt: string` (ISO 8601 format)
4. **All optional fields marked** - Use `?` for nullable backend fields
5. **No derived fields** - Only what backend returns

**Example Structure (Enforced):**

```typescript
// ✅ CORRECT - Matches backend exactly
export interface WalletResponse {
  walletId: string
  userId: string
  glAccountCode: string
  walletType: 'PERSONAL' | 'BUSINESS' | 'MERCHANT'  // ← UPPERCASE
  currency: string
  balanceCents: number  // ← cents, not decimal
  isActive: boolean
  isFrozen: boolean
  createdAt: string  // ← ISO string
  updatedAt?: string
}

export interface TransferRequest {
  idempotencyKey: string
  fromUserId: string
  toUserId: string
  amountCents: number  // ← user sends cents
  description?: string
}

export interface TransferResponse {
  transactionId: string
  idempotencyKey: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REVERSED'
  amountCents: number
  fraudScore: number
  fraudFlags?: string[]
  completedAt?: string
  createdAt: string
  ledgerEntries?: LedgerEntry[]
}

export interface LedgerEntry {
  id: string
  entryType: 'DEBIT' | 'CREDIT'  // ← UPPERCASE
  glAccountCode: string
  amountCents: number
  description: string
}

// Error response (Spring Boot default)
export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}
```

**Validation:**
- [ ] All type names end with `Response`, `Request`, `Dto`
- [ ] All enums in UPPERCASE
- [ ] All amounts as `number` in cents
- [ ] All dates as `string` (ISO)
- [ ] Optional fields marked with `?`
- [ ] No transformation logic here (pure data)

**Location:**
```
src/lib/api/
├── payment.types.ts       ← All payment/wallet DTOs
├── user.types.ts          ← User/auth DTOs (if wiring User Service)
└── common.types.ts        ← Shared types (ApiError, etc.)
```

---

## 📡 LAYER 2: API CLIENT (HTTP Layer)

**Purpose:** HTTP wrapper that:
- Handles base URL
- Manages headers (auth, content-type)
- Parses responses using types from Layer 1
- Centralized error handling

**Authority:** Backend's response format from testing guide.

### File: `src/lib/api/client.ts`

**Requirements:**
1. **No business logic** - Only HTTP concerns
2. **Type-safe** - All responses use Layer 1 types
3. **Error standardization** - Spring errors parsed consistently
4. **Request/response logging** - For debugging

**Example Structure:**

```typescript
import { ApiError } from './payment.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8082'

class ApiClient {
  private baseUrl: string
  private token?: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // Set JWT token for authenticated requests
  setToken(token: string) {
    this.token = token
  }

  // Core HTTP method (all requests go through here)
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Add JWT if set
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      // Parse response body
      const data = await response.json()

      // Check for HTTP errors (4xx, 5xx)
      if (!response.ok) {
        const error: ApiError = data
        console.error(`[${response.status}] ${error.message}`, error)
        throw new ApiErrorException(error)
      }

      return data as T
    } catch (error) {
      if (error instanceof ApiErrorException) {
        throw error
      }
      // Network error or JSON parse error
      console.error('Request failed:', error)
      throw new ApiErrorException({
        timestamp: new Date().toISOString(),
        status: 0,
        error: 'Network Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        path: endpoint,
      })
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }
}

// Custom exception for API errors
export class ApiErrorException extends Error {
  constructor(public apiError: ApiError) {
    super(apiError.message)
    this.name = 'ApiErrorException'
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL)
```

**Validation:**
- [ ] Base URL from `.env.NEXT_PUBLIC_API_BASE_URL`
- [ ] Request method (GET, POST) correct
- [ ] Headers include `Content-Type: application/json`
- [ ] JWT token added if available
- [ ] Response parsed with Layer 1 types
- [ ] Errors caught and standardized
- [ ] Console logs for debugging

**Location:**
```
src/lib/api/
├── client.ts              ← HTTP wrapper
├── payment.types.ts       ← Types
└── errors.ts              ← ApiErrorException class
```

---

## 🔄 LAYER 3: ADAPTER/MAPPER (DTO → UI Types)

**Purpose:** Convert backend DTOs to frontend display types.

**Why separate?**
- Backend enum: `UPPERCASE`
- Frontend display: `lowercase` or human-readable labels
- Backend amount: `amountCents: number`
- Frontend display: `balance: string` (formatted), `balanceVnd: number`

**Authority:** Backend responses (Layer 1 types).

### File: `src/lib/api/adapters.ts`

**Requirements:**
1. **One adapter per domain** (wallet, transaction, user)
2. **Pure functions** - No side effects
3. **Document derivations** - Show where derived fields come from
4. **Reversible for mutations** - If backend needs UPPERCASE, adapter converts back

**Example Structure:**

```typescript
import {
  WalletResponse,
  TransferResponse,
  LedgerEntry,
} from './payment.types'

// ============================================
// ADAPTER: WalletResponse → Wallet (UI Type)
// ============================================

export interface Wallet {
  id: string
  userId: string
  type: 'Personal' | 'Business' | 'Merchant'  // ← Friendly label
  currency: string
  balanceVnd: number  // ← Derived: balanceCents / 100
  balanceFormatted: string  // ← Derived: formatted currency
  isActive: boolean
  isFrozen: boolean
  createdAt: Date  // ← Derived: string → Date
  updatedAt?: Date
  glAccountCode: string
}

export function adaptWalletResponse(backend: WalletResponse): Wallet {
  return {
    id: backend.walletId,
    userId: backend.userId,
    type: adaptWalletType(backend.walletType),
    currency: backend.currency,
    balanceVnd: backend.balanceCents / 100,
    balanceFormatted: formatCurrency(backend.balanceCents / 100),
    isActive: backend.isActive,
    isFrozen: backend.isFrozen,
    createdAt: new Date(backend.createdAt),
    updatedAt: backend.updatedAt ? new Date(backend.updatedAt) : undefined,
    glAccountCode: backend.glAccountCode,
  }
}

// ============================================
// ADAPTER: TransferResponse → Transaction (UI Type)
// ============================================

export interface Transaction {
  id: string
  fromUserId: string
  toUserId: string
  amountVnd: number  // ← Derived: amountCents / 100
  amountFormatted: string  // ← Derived: formatted
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'Cancelled' | 'Reversed'
  description: string
  fraudScore: number
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'  // ← Derived from fraudScore
  isFlagged: boolean  // ← Derived: fraudScore >= 70
  isBlocked: boolean  // ← Derived: fraudScore >= 80
  completedAt?: Date
  createdAt: Date
  ledgerEntries?: LedgerEntry[]
}

export function adaptTransferResponse(backend: TransferResponse): Transaction {
  const fraudScore = backend.fraudScore

  return {
    id: backend.transactionId,
    fromUserId: backend.fromUserId,
    toUserId: backend.toUserId,
    amountVnd: backend.amountCents / 100,
    amountFormatted: formatCurrency(backend.amountCents / 100),
    status: adaptTransactionStatus(backend.status),
    description: backend.description || '',
    fraudScore,
    riskLevel: deriveRiskLevel(fraudScore),
    isFlagged: fraudScore >= 70,
    isBlocked: fraudScore >= 80,
    completedAt: backend.completedAt ? new Date(backend.completedAt) : undefined,
    createdAt: new Date(backend.createdAt),
    ledgerEntries: backend.ledgerEntries,
  }
}

// ============================================
// HELPER: Convert backend enums to UI enums
// ============================================

function adaptWalletType(backend: 'PERSONAL' | 'BUSINESS' | 'MERCHANT'): Wallet['type'] {
  const map = {
    PERSONAL: 'Personal',
    BUSINESS: 'Business',
    MERCHANT: 'Merchant',
  }
  return map[backend]
}

function adaptTransactionStatus(
  backend: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REVERSED',
): Transaction['status'] {
  const map = {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    CANCELLED: 'Cancelled',
    REVERSED: 'Reversed',
  }
  return map[backend]
}

function deriveRiskLevel(fraudScore: number): Transaction['riskLevel'] {
  if (fraudScore < 30) return 'Low'
  if (fraudScore < 60) return 'Medium'
  if (fraudScore < 80) return 'High'
  return 'Critical'
}

// ============================================
// HELPER: Reverse adapter (UI → Backend)
// ============================================

export function reverseTransferRequest(ui: {
  fromUserId: string
  toUserId: string
  amountVnd: number
  description: string
}): TransferRequest {
  return {
    idempotencyKey: generateUUID(),  // Frontend responsibility
    fromUserId: ui.fromUserId,
    toUserId: ui.toUserId,
    amountCents: Math.round(ui.amountVnd * 100),  // ← Convert back to cents
    description: ui.description,
  }
}

// ============================================
// HELPERS: Formatting
// ============================================

export function formatCurrency(vnd: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(vnd)
}

export function generateUUID(): string {
  return crypto.randomUUID()
}
```

**Validation:**
- [ ] All backend enums converted to friendly labels
- [ ] All amounts converted from cents to VND
- [ ] All dates converted from ISO string to Date
- [ ] Derived fields clearly documented (comments)
- [ ] Reverse adapter exists for mutations
- [ ] No business logic (pure data transformation)
- [ ] Null/undefined handling for optional fields

**Location:**
```
src/lib/api/
├── adapters.ts            ← All DTO → UI type conversions
├── client.ts
├── payment.types.ts
└── common.ts              ← Shared helpers
```

---

## 🪝 LAYER 4: REACT QUERY HOOKS (Business Logic)

**Purpose:** Data fetching layer that:
- Calls API client (Layer 2)
- Uses adapter (Layer 3)
- Returns UI-friendly types
- Handles loading, error, caching
- Mutation handling (transfers)

**Authority:** React Query best practices + backend endpoints.

### File: `src/hooks/api/useWallets.ts`

**Requirements:**
1. **Query hooks** for read operations
2. **Mutation hooks** for write operations
3. **Return UI types** (post-adapter)
4. **Error handling** using Layer 2 exceptions
5. **Loading states** for UI feedback

**Example Structure:**

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, ApiErrorException } from '@/lib/api/client'
import {
  WalletResponse,
  TransferRequest,
  TransferResponse,
} from '@/lib/api/payment.types'
import {
  Wallet,
  Transaction,
  adaptWalletResponse,
  adaptTransferResponse,
  reverseTransferRequest,
  formatCurrency,
} from '@/lib/api/adapters'
import { toast } from 'sonner'

// ============================================
// QUERY: Get wallet balance
// ============================================

export function useWalletBalance(walletId: string | undefined) {
  return useQuery({
    queryKey: ['wallet', 'balance', walletId],
    queryFn: async () => {
      if (!walletId) throw new Error('Wallet ID required')

      const backend = await apiClient.get<WalletResponse>(
        `/api/wallets/${walletId}/balance`,
      )
      return adaptWalletResponse(backend)
    },
    enabled: !!walletId,  // Only run if walletId exists
    staleTime: 5 * 60 * 1000,  // 5 minutes
  })
}

// ============================================
// QUERY: Get all wallets for user
// ============================================

export function useWallets(userId: string | undefined) {
  return useQuery({
    queryKey: ['wallets', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required')

      // TODO: Implement when backend adds /api/wallets?userId=... endpoint
      // For now, would need to list from mock or fetch individually
      const response = await apiClient.get<WalletResponse[]>(
        `/api/wallets?userId=${userId}`,
      )
      return response.map(adaptWalletResponse)
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  })
}

// ============================================
// MUTATION: Create wallet
// ============================================

export function useCreateWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: { userId: string; walletType: 'PERSONAL' | 'BUSINESS' | 'MERCHANT' }) => {
      const backend = await apiClient.post<WalletResponse>('/api/wallets', {
        userId: params.userId,
        walletType: params.walletType,
      })
      return adaptWalletResponse(backend)
    },
    onSuccess: (data) => {
      // Invalidate wallet queries
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      toast.success(`Wallet created: ${data.type}`)
    },
    onError: (error) => {
      if (error instanceof ApiErrorException) {
        toast.error(error.apiError.message)
      } else {
        toast.error('Failed to create wallet')
      }
    },
  })
}

// ============================================
// MUTATION: Transfer money (CRITICAL)
// ============================================

export function useTransfer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: {
      fromUserId: string
      toUserId: string
      amountVnd: number
      description: string
    }) => {
      // Step 1: Validate amount
      if (params.amountVnd <= 0) {
        throw new Error('Amount must be greater than 0')
      }

      // Step 2: Convert to backend format
      const request = reverseTransferRequest(params)

      // Step 3: Call backend
      const backend = await apiClient.post<TransferResponse>(
        '/api/payments/transfer',
        request,
      )

      // Step 4: Adapt response
      const transaction = adaptTransferResponse(backend)

      // Step 5: Check fraud score and warn user
      if (transaction.isBlocked) {
        throw new Error(`Transfer blocked: High fraud risk (score: ${transaction.fraudScore})`)
      }

      if (transaction.isFlagged) {
        console.warn(`Transfer flagged: Fraud score ${transaction.fraudScore} - Monitor this transaction`)
        // UI layer can show warning toast
      }

      return transaction
    },
    onSuccess: (data) => {
      // Invalidate wallet balances
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] })

      // Invalidate transaction lists
      queryClient.invalidateQueries({ queryKey: ['transactions'] })

      toast.success(
        `Transfer completed: ${formatCurrency(data.amountVnd)} sent to ${data.toUserId}`,
      )
    },
    onError: (error) => {
      if (error instanceof ApiErrorException) {
        const err = error.apiError
        if (err.status === 403) {
          // Fraud blocked
          toast.error(`Fraud Detection: ${err.message}`)
        } else if (err.status === 409) {
          // Insufficient balance
          toast.error(`Insufficient balance: ${err.message}`)
        } else {
          toast.error(err.message)
        }
      } else if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Transfer failed')
      }
    },
  })
}

// ============================================
// QUERY: Get transaction detail
// ============================================

export function useTransaction(transactionId: string | undefined) {
  return useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => {
      if (!transactionId) throw new Error('Transaction ID required')

      const backend = await apiClient.get<TransferResponse>(
        `/api/payments/transactions/${transactionId}`,
      )
      return adaptTransferResponse(backend)
    },
    enabled: !!transactionId,
    staleTime: 30 * 1000,  // 30 seconds
  })
}
```

**Validation:**
- [ ] All queries use `useQuery` with proper `queryKey`
- [ ] All mutations use `useMutation` with error handling
- [ ] Response adapted before returning (Layer 3)
- [ ] Error handling catches `ApiErrorException`
- [ ] Toast notifications for success/error
- [ ] Query invalidation on mutation success
- [ ] Conditional queries use `enabled`
- [ ] Stale time appropriate per data freshness

**Location:**
```
src/hooks/api/
├── useWallets.ts          ← Wallet queries/mutations
├── useTransfers.ts        ← Transfer mutation
├── useTransactions.ts     ← Transaction queries
├── useCompliance.ts       ← SARs/fraud alerts
└── index.ts               ← Barrel export
```

---

## 🎨 LAYER 5: REACT COMPONENTS (UI Pages)

**Purpose:** Use Layer 4 hooks to fetch/mutate data, display in UI.

**Requirements:**
1. **Replace all mock imports** with hook imports
2. **Use UI types** from adapters (Layer 3)
3. **Keep animations** - No changes to Framer Motion
4. **Keep layout** - Only data source changes
5. **Handle loading/error states** from hooks

**Example: Transactions Page (Before → After)**

### BEFORE (Mock Data):
```typescript
'use client'

import { mockTransactions } from '@/lib/mock-data'
import { formatCurrency, formatDate, getTransactionStatusColor } from '@/lib/mock-data'

export default function TransactionsPage() {
  const transactions = mockTransactions  // ← Mock
  
  // Display code stays same...
}
```

### AFTER (Real Data):
```typescript
'use client'

import { useTransactions } from '@/hooks/api/useTransactions'  // ← New import
import { LoadingSpinner } from '@/components/common'

export default function TransactionsPage() {
  const { data: transactions, isLoading, error } = useTransactions()  // ← Real data
  
  // Handle loading
  if (isLoading) {
    return <LoadingSpinner message="Loading transactions..." />
  }
  
  // Handle error
  if (error) {
    return <AlertItem severity="error" message={error.message} />
  }
  
  // Display code stays same, but using UI types...
}
```

**CRITICAL RULES for Components:**
1. **Never access `amountCents`** - Use `amountVnd` or `amountFormatted`
2. **Never check for `status === 'COMPLETED'`** - Use `status === 'Completed'`
3. **Never use backend enum directly** - Use adapted enum
4. **Always destructure `data`** from hook before use
5. **Always handle `isLoading` state**
6. **Always handle `error` state**

**Example: Transaction Detail Page**

```typescript
'use client'

import { useTransaction } from '@/hooks/api/useTransactions'
import { LoadingSpinner } from '@/components/common'
import { AlertItem } from '@/components/common'
import { useParams } from 'next/navigation'

export default function TransactionDetailPage() {
  const params = useParams()
  const transactionId = params.id as string

  // Hook with real data
  const { data: transaction, isLoading, error } = useTransaction(transactionId)

  if (isLoading) {
    return <LoadingSpinner message="Loading transaction details..." />
  }

  if (error) {
    return <AlertItem severity="error" message={error.message} />
  }

  if (!transaction) {
    return <AlertItem severity="warning" message="Transaction not found" />
  }

  return (
    <div>
      {/* Show fraud warning if flagged */}
      {transaction.isFlagged && (
        <AlertItem
          severity="warning"
          message={`This transaction has a fraud score of ${transaction.fraudScore}`}
        />
      )}

      {/* Show fraud block error */}
      {transaction.isBlocked && (
        <AlertItem
          severity="error"
          message={`This transaction was blocked (fraud score: ${transaction.fraudScore})`}
        />
      )}

      {/* Display transaction (your existing component) */}
      <h2>{transaction.id}</h2>
      <p>Amount: {transaction.amountFormatted}</p>  {/* ← Use formatted */}
      <p>Status: {transaction.status}</p>  {/* ← Use adapted enum */}
      {/* ... rest of component ... */}
    </div>
  )
}
```

**Validation:**
- [ ] All mock imports removed
- [ ] All hook imports added
- [ ] `data` destructured from hook
- [ ] Loading state handled (show spinner)
- [ ] Error state handled (show alert)
- [ ] Only `amountVnd`/`amountFormatted` used (never `amountCents`)
- [ ] Only adapted enums used (never backend enums)
- [ ] Animations/layout unchanged

---

## 🔧 IMPLEMENTATION WORKFLOW (AUTOMATED)

Agent should follow this **exact order**:

### Step 1: Environment Check
```bash
# BEFORE touching code, verify:
curl http://localhost:8081/actuator/health    # User Service
curl http://localhost:8082/actuator/health    # Payment Service

# If both return 200, continue. Otherwise STOP.
```

### Step 2: Create Layer 1 (API Types)
```bash
# Create: src/lib/api/payment.types.ts
# Copy from: FRONTEND_INTEGRATION_GUIDE.md → API Response examples
# Validate: All enums UPPERCASE, all amounts in cents
# Test: npm run type-check (should pass)
```

### Step 3: Create Layer 2 (API Client)
```bash
# Create: src/lib/api/client.ts
# Implement: ApiClient class with get/post methods
# Test: npx tsx -e "import { apiClient } from '@/lib/api/client'; console.log('OK')"
```

### Step 4: Create Layer 3 (Adapters)
```bash
# Create: src/lib/api/adapters.ts
# Implement: adaptWalletResponse, adaptTransferResponse, etc.
# Validate: All adapters have reverse functions for mutations
# Test: Each adapter converts all fields correctly
```

### Step 5: Create Layer 4 (Hooks)
```bash
# Create: src/hooks/api/useWallets.ts
# Create: src/hooks/api/useTransfers.ts
# Create: src/hooks/api/useTransactions.ts
# Validate: All hooks use Layer 2 and Layer 3
# Test: Can call hooks without errors
```

### Step 6: Update Layer 5 (Components)
```bash
# For each Phase 4 page:
#   1. Remove mock data imports
#   2. Add hook imports
#   3. Replace data source
#   4. Add loading/error states
#   5. Test in browser

# Order:
# 1. Wallets page (simplest - single hook)
# 2. Wallet detail (single hook + params)
# 3. Transaction detail (single hook + params)
# 4. Transactions list (more complex - filtering)
# 5. Transfer form (mutation + error handling)
```

### Step 7: Test
```bash
npm run dev
# Test each page:
# - http://localhost:3000/app/wallets
# - http://localhost:3000/app/wallets/[id]
# - http://localhost:3000/app/transactions/[id]
# - Transfer flow with real backend
```

---

## 🚨 CRITICAL VALIDATION CHECKLIST

**Before declaring "done", agent must verify:**

### Type Safety
- [ ] `npm run type-check` passes (0 errors)
- [ ] No `any` types used
- [ ] All enums match backend exactly
- [ ] All optional fields marked with `?`

### Data Flow
- [ ] Layer 1 types mirror backend JSON 100%
- [ ] Layer 2 client calls correct endpoints
- [ ] Layer 3 adapters convert all fields
- [ ] Layer 4 hooks use adapters before returning
- [ ] Layer 5 components use hook data

### Amount Handling
- [ ] Backend sends `amountCents` (number)
- [ ] Adapter converts to `amountVnd` (number) and `amountFormatted` (string)
- [ ] Components use `amountVnd` or `amountFormatted`, NEVER `amountCents`
- [ ] Mutation reverses: `amountVnd * 100` → `amountCents`

### Enum Handling
- [ ] Backend enums are UPPERCASE (e.g., `COMPLETED`)
- [ ] Adapter converts to friendly (e.g., `Completed`)
- [ ] Components use adapted enums, NEVER backend enums
- [ ] No hardcoded enum strings in UI

### Error Handling
- [ ] All `ApiErrorException` caught in hooks
- [ ] All errors show toast notification
- [ ] Components handle `error` state from hooks
- [ ] Loading states show spinner

### Caching & Performance
- [ ] React Query queries have appropriate `staleTime`
- [ ] Query invalidation on mutation success
- [ ] `enabled` condition on conditional queries
- [ ] No infinite loops or duplicate requests

---

## 📋 SPECIAL CASES

### Case 1: Wallet Balance (Real-time)

**Backend:** Calculated on each request from ledger entries  
**Frontend Strategy:**
```typescript
// In hook, set short stale time
staleTime: 30 * 1000,  // 30 seconds

// In component, refresh on demand
const { data, refetch } = useWalletBalance(walletId)

// User clicks "Refresh Balance" button
<button onClick={() => refetch()}>Refresh</button>
```

### Case 2: Transfer with Idempotency

**Backend:** Idempotency key prevents duplicate charges  
**Frontend Responsibility:**
```typescript
// In adapter's reverse function
export function reverseTransferRequest(ui: {...}) {
  return {
    idempotencyKey: generateUUID(),  // ← Frontend generates ONCE
    // ...
  }
}

// In mutation, if network fails, user retries with SAME key
// Backend will return cached response (no duplicate charge)
```

### Case 3: Fraud Scoring

**Backend:** Returns `fraudScore: 0-100` and `fraudFlags: string[]`  
**Frontend Strategy:**
```typescript
export function deriveRiskLevel(fraudScore: number): Transaction['riskLevel'] {
  if (fraudScore < 30) return 'Low'
  if (fraudScore < 60) return 'Medium'
  if (fraudScore < 80) return 'High'
  return 'Critical'
}

// In component
{transaction.isFlagged && (
  <Warning>Fraud score {transaction.fraudScore} - Transaction flagged</Warning>
)}
{transaction.isBlocked && (
  <Error>Fraud score {transaction.fraudScore} - Transaction blocked</Error>
)}
```

### Case 4: Ledger Entries (Read-Only)

**Backend:** Returns as part of transaction detail  
**Frontend:**
```typescript
// In Transaction Detail page
{transaction.ledgerEntries && (
  <Table>
    <thead>
      <tr>
        <th>Type</th>
        <th>Amount</th>
        <th>Account</th>
      </tr>
    </thead>
    <tbody>
      {transaction.ledgerEntries.map(entry => (
        <tr key={entry.id}>
          <td>{entry.entryType}</td>
          <td>{formatCurrency(entry.amountCents / 100)}</td>
          <td>{entry.glAccountCode}</td>
        </tr>
      ))}
    </tbody>
  </Table>
)}
```

---

## 📊 FILE TREE AFTER COMPLETION

```
src/
├── lib/api/
│   ├── client.ts                    ← Layer 2
│   ├── payment.types.ts             ← Layer 1
│   ├── user.types.ts                ← Layer 1
│   ├── adapters.ts                  ← Layer 3
│   ├── errors.ts                    ← ApiErrorException
│   └── index.ts                     ← Barrel export
│
├── hooks/api/
│   ├── useWallets.ts                ← Layer 4
│   ├── useTransfers.ts              ← Layer 4
│   ├── useTransactions.ts           ← Layer 4
│   ├── useCompliance.ts             ← Layer 4 (SARs, fraud)
│   └── index.ts                     ← Barrel export
│
├── app/(app)/
│   ├── transactions/page.tsx         ← Layer 5 (updated)
│   ├── transactions/[id]/page.tsx    ← Layer 5 (updated)
│   ├── wallets/page.tsx             ← Layer 5 (updated)
│   ├── wallets/[id]/page.tsx        ← Layer 5 (updated)
│   └── ... (other pages)
│
├── components/                      ← Unchanged
├── lib/mock-data.ts                 ← REMOVED (no longer needed)
└── ...
```

---

## ✅ SIGN-OFF CHECKLIST

Agent must provide evidence:

```markdown
# Frontend Integration Complete ✅

## Layer 1: API Types
- [x] src/lib/api/payment.types.ts created
- [x] All DTOs match backend JSON
- [x] npm run type-check: PASS

## Layer 2: API Client
- [x] src/lib/api/client.ts created
- [x] GET/POST methods working
- [x] Error handling implemented

## Layer 3: Adapters
- [x] src/lib/api/adapters.ts created
- [x] All adapters tested (amount, enums, dates)
- [x] Reverse adapters for mutations

## Layer 4: React Query Hooks
- [x] useWallets.ts created
- [x] useTransfers.ts created
- [x] useTransactions.ts created
- [x] All hooks tested

## Layer 5: Components
- [x] Wallets page: LIVE
- [x] Wallet detail: LIVE
- [x] Transaction detail: LIVE
- [x] Transfer form: LIVE

## Testing
- [x] npm run dev: No errors
- [x] Manual testing: All pages load
- [x] Real data from backend showing
- [x] Animations/layout unchanged

## Validation
- [x] All enums friendly-cased in UI
- [x] All amounts in VND (never cents)
- [x] All dates formatted
- [x] Loading states working
- [x] Error handling working
- [x] Fraud warnings showing
```

---

## 🎯 NEXT STEPS AFTER COMPLETION

Once all layers are working:

1. **Add more endpoints as backend provides:**
   - `GET /api/wallets?userId=...` (wallet listing)
   - `GET /api/payments/transactions?userId=...` (transaction history)
   - `GET /api/compliance/sars` (for SARs page)

2. **Wire User Service authentication:**
   - Add `useLogin()` hook
   - Store JWT in memory
   - Add to all Payment Service requests

3. **Add E2E tests:**
   - Playwright tests for full flow
   - Verify frontend ↔ backend alignment

4. **Performance optimization:**
   - Add React Query persistence
   - Implement optimistic updates
   - Add request deduplication

---

**This guide ensures the agent implements frontend-backend integration correctly at each layer.**
