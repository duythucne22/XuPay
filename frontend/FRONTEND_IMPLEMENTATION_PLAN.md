# 🚀 XuPay Frontend Implementation Plan

> **Created:** December 20, 2025  
> **Status:** PLANNING COMPLETE - READY FOR IMPLEMENTATION  
> **Purpose:** Comprehensive guide for implementing Next.js frontend aligned with existing Java backend  
> **Node Version:** v23.3.0 | **npm Version:** 11.6.3

---

## 📋 EXECUTIVE SUMMARY

### Analysis Findings

After careful review of all frontend design specifications (Phase 1-5, design.md, frontend-design-spec.md) and the existing Java backend services (User Service, Payment Service), I've identified the following:

#### ✅ What's Already Done (Backend - Ready to Integrate)
| Service | Status | Port | Key APIs |
|---------|--------|------|----------|
| User Service | ✅ Production Ready | 8081 (REST), 50053 (gRPC) | Auth, KYC, Limits |
| Payment Service | ✅ 81% Complete | 8082 (REST) | Wallets, Transfers, Fraud |
| PostgreSQL | ✅ Running | 5432 | user_db, payment_db |
| Redis | ✅ Running | 6379 | Idempotency cache |

#### 🎯 What Needs To Be Built (Frontend)
| Phase | Components | Est. Time | Dependencies |
|-------|------------|-----------|--------------|
| Phase 1 | Foundation, Design Tokens | 1-2 hours | Node.js, npm |
| Phase 2 | Atomic Components (shadcn) | 2-3 hours | Phase 1 |
| Phase 3 | Layout System (AppShell, Sidebar) | 2-3 hours | Phase 2 |
| Phase 4 | Feature Pages (Mock Data) | 3-4 hours | Phase 3 |
| Phase 5 | Backend Integration (Real Data) | 4-6 hours | Phase 4 + Backend |

**Total Estimated Time:** 12-18 hours (2-3 days)

---

## ⚠️ CRITICAL: NODE.JS & NPM COMPATIBILITY FIXES

Your versions: **Node v23.3.0** (latest) and **npm v11.6.3** (latest)

### Issue 1: `radix-ui` Package Name Error
The guide incorrectly uses `radix-ui` (which doesn't exist). Correct packages are scoped.

**Original (WRONG):**
```bash
npm install ... radix-ui
```

**Fixed (CORRECT):**
```bash
# Radix UI components are installed via shadcn/ui CLI, not directly
# Remove radix-ui from install command
npm install framer-motion@11 @tanstack/react-query@5 zustand@4 sonner@1 lucide-react@0.462 react-confetti-explosion@2 clsx tailwind-merge class-variance-authority
```

### Issue 2: `@react-number-flow/core` Package Deprecated
Package renamed. Use the new name:

**Original (DEPRECATED):**
```bash
npm install @react-number-flow/core@1
```

**Fixed (CORRECT):**
```bash
npm install @number-flow/react
```

### Issue 3: `shadcn-ui` CLI Package Name Changed
The CLI package is now just `shadcn`:

**Original (OLD):**
```bash
npm install -D shadcn-ui
npx shadcn-ui@latest init -d
npx shadcn-ui@latest add button
```

**Fixed (CURRENT):**
```bash
# No need to install as dev dependency - use npx directly
npx shadcn@latest init
npx shadcn@latest add button card input select badge label avatar dropdown-menu table skeleton dialog
```

### Issue 4: Lucide-React Version
Use latest stable version instead of specific old version:

**Original:**
```bash
npm install lucide-react@0.344
```

**Fixed:**
```bash
npm install lucide-react@0.462
# Or just 'lucide-react' for latest
```

### Issue 5: Framer Motion Type Issues on Node 23
Add explicit type resolution in tsconfig:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "types": ["node"]
  }
}
```

---

## 🔄 CORRECTED PHASE 1 COMMANDS

```bash
# Step 1: Create Next.js Project (15.x recommended for Node 23)
npx create-next-app@latest xupay-frontend --typescript --tailwind --eslint --app --src-dir --import-alias '@/*'

# Step 2: Navigate to project
cd xupay-frontend

# Step 3: Install corrected dependencies
npm install framer-motion@11 @tanstack/react-query@5 zustand@5 sonner@1 lucide-react clsx tailwind-merge class-variance-authority @number-flow/react react-confetti-explosion

# Step 4: Initialize shadcn
npx shadcn@latest init

# Step 5: Add shadcn components (batch install)
npx shadcn@latest add button card input select badge label avatar dropdown-menu table skeleton dialog separator

# Step 6: Create folder structure
mkdir -p src/components/{common,layout,forms,tables,animations,providers}
mkdir -p src/hooks/api
mkdir -p src/lib/api
mkdir -p src/types
mkdir -p src/config
mkdir -p public/images
```

---

## 🎯 BACKEND API ALIGNMENT ANALYSIS

### User Service APIs (Port 8081)
| Endpoint | Method | Frontend Page | Hook Name |
|----------|--------|---------------|-----------|
| `/api/auth/register` | POST | `/signup` | `useRegister()` |
| `/api/auth/login` | POST | `/login` | `useLogin()` |
| `/api/auth/me` | GET | `AppShell` | `useCurrentUser()` |
| `/api/users/{id}` | GET | `Settings/Profile` | `useUser()` |
| `/api/kyc/documents` | POST | `KYC Upload` | `useUploadKyc()` |
| `/api/kyc/status/{userId}` | GET | `Dashboard` | `useKycStatus()` |

### Payment Service APIs (Port 8082)
| Endpoint | Method | Frontend Page | Hook Name |
|----------|--------|---------------|-----------|
| `/api/wallets` | POST | `Wallets/New` | `useCreateWallet()` |
| `/api/wallets/{id}/balance` | GET | `Wallets/[id]` | `useWalletBalance()` |
| `/api/payments/transfer` | POST | `Transfers/New` | `useTransfer()` |
| `/api/payments/transactions/{id}` | GET | `Transactions/[id]` | `useTransaction()` |

### Backend Response Format Alignment
```typescript
// Backend uses UPPERCASE enums
type BackendWalletType = 'PERSONAL' | 'BUSINESS' | 'MERCHANT'
type BackendStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

// Frontend displays as Title Case
type FrontendWalletType = 'Personal' | 'Business' | 'Merchant'
type FrontendStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed'

// Amounts: Backend = cents (number), Frontend = VND (formatted string)
// Backend: { amountCents: 25000000 }
// Frontend: { amountVnd: 250000, amountFormatted: "250,000 VND" }
```

---

## 📂 FILE STRUCTURE MAPPING

```
xupay-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout (Providers)
│   │   ├── page.tsx                      # Redirect → /app/dashboard
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx            # → User Service /api/auth/login
│   │   │   ├── signup/page.tsx           # → User Service /api/auth/register
│   │   │   └── reset-password/page.tsx
│   │   └── (app)/
│   │       ├── layout.tsx                # AppShell (Sidebar + Topbar)
│   │       ├── dashboard/page.tsx        # KPIs, Charts, Recent Activity
│   │       ├── wallets/
│   │       │   ├── page.tsx              # → Payment Service /api/wallets
│   │       │   └── [id]/page.tsx         # → Payment Service /api/wallets/{id}/balance
│   │       ├── transactions/
│   │       │   ├── page.tsx              # List view
│   │       │   └── [id]/page.tsx         # → Payment Service /api/payments/transactions/{id}
│   │       ├── transfers/
│   │       │   └── new/page.tsx          # → Payment Service /api/payments/transfer
│   │       ├── compliance/
│   │       │   ├── sars/page.tsx
│   │       │   └── fraud-alerts/page.tsx
│   │       └── settings/
│   │           ├── profile/page.tsx      # → User Service /api/users/{id}
│   │           └── security/page.tsx
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts                 # HTTP client (fetch wrapper)
│   │   │   ├── payment.types.ts          # Payment Service DTOs
│   │   │   ├── user.types.ts             # User Service DTOs
│   │   │   └── adapters.ts               # DTO → UI type conversion
│   │   ├── utils.ts                      # clsx + tailwind-merge
│   │   └── cn.ts                         # Classname utility
│   │
│   ├── hooks/
│   │   └── api/
│   │       ├── useWallets.ts             # Wallet queries/mutations
│   │       ├── useTransfers.ts           # Transfer mutation
│   │       ├── useTransactions.ts        # Transaction queries
│   │       └── useAuth.ts                # Auth queries/mutations
│   │
│   ├── components/
│   │   ├── ui/                           # shadcn components (auto-generated)
│   │   ├── common/                       # Custom shared components
│   │   ├── layout/                       # AppShell, Sidebar, Topbar
│   │   └── providers/                    # React Query, Theme, Toast
│   │
│   └── config/
│       └── navigation.ts                 # Sidebar nav structure
│
├── .env.local                            # API URLs (gitignored)
├── tailwind.config.ts                    # Extended with design tokens
└── tsconfig.json                         # TypeScript config
```

---

## 🗓️ IMPLEMENTATION TIMELINE

### Day 1: Foundation (Phase 1 + Phase 2)
| Time | Task | Output |
|------|------|--------|
| 0:00-0:30 | Create Next.js project | Project scaffold |
| 0:30-1:00 | Install dependencies (corrected) | package.json complete |
| 1:00-2:00 | Create globals.css with design tokens | Design system active |
| 2:00-3:00 | Initialize shadcn, add components | UI primitives ready |
| 3:00-4:00 | Create custom components (KPICard, StatusBadge, etc.) | Common components |

**Checkpoint:** `npm run dev` shows styled empty app

### Day 2: Layout + Mock Pages (Phase 3 + Phase 4)
| Time | Task | Output |
|------|------|--------|
| 0:00-1:30 | Create Providers (Theme, Query, Toast) | App providers |
| 1:30-3:00 | Create Layout components (Sidebar, Topbar, AppShell) | Navigation working |
| 3:00-4:00 | Create mock data file | Sample data for testing |
| 4:00-6:00 | Create feature pages (Dashboard, Wallets, Transactions) | All pages with mock |

**Checkpoint:** All pages render with mock data, navigation works

### Day 3: Backend Integration (Phase 5)
| Time | Task | Output |
|------|------|--------|
| 0:00-1:00 | Create API types (Layer 1) | TypeScript interfaces |
| 1:00-2:00 | Create API client (Layer 2) | HTTP wrapper |
| 2:00-3:00 | Create adapters (Layer 3) | DTO → UI conversion |
| 3:00-4:30 | Create React Query hooks (Layer 4) | Data fetching |
| 4:30-6:00 | Wire pages to real data (Layer 5) | Live data |

**Checkpoint:** Real data from backend showing in UI

---

## 🔧 ENVIRONMENT CONFIGURATION

### `.env.local` (Create this file)
```bash
# API Base URLs
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:8081
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:8082

# Feature Flags
NEXT_PUBLIC_ENABLE_MOCK_DATA=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### `.env.example` (For documentation)
```bash
# API Configuration
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:8081
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:8082

# Optional: Production URLs
# NEXT_PUBLIC_USER_SERVICE_URL=https://api.xupay.com/user
# NEXT_PUBLIC_PAYMENT_SERVICE_URL=https://api.xupay.com/payment
```

---

## ⚠️ CRITICAL IMPLEMENTATION RULES

### Rule 1: Backend Enum Casing
```typescript
// ALWAYS convert backend UPPERCASE to frontend Title Case
const statusMap = {
  'COMPLETED': 'Completed',
  'PENDING': 'Pending',
  'FAILED': 'Failed',
}
```

### Rule 2: Amount Handling
```typescript
// Backend: cents (integer)
// Frontend: VND (decimal) + formatted string
const amountVnd = backend.amountCents / 100
const formatted = new Intl.NumberFormat('vi-VN', { 
  style: 'currency', 
  currency: 'VND' 
}).format(amountVnd)
```

### Rule 3: Date Handling
```typescript
// Backend: ISO string "2025-12-20T10:30:00Z"
// Frontend: Date object for operations, string for display
const date = new Date(backend.createdAt)
const display = date.toLocaleDateString('vi-VN', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})
```

### Rule 4: Idempotency Keys
```typescript
// Frontend MUST generate idempotency key for transfers
const idempotencyKey = crypto.randomUUID() // Built-in in Node 23+
```

### Rule 5: Error Handling
```typescript
// Backend returns standard Spring error format
interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}
```

---

## 🚀 QUICK START COMMANDS

```bash
# 1. Navigate to frontend directory
cd c:\Users\duyth\FinTech\frontend

# 2. Create Next.js project
npx create-next-app@latest xupay-frontend --typescript --tailwind --eslint --app --src-dir --import-alias '@/*'

# 3. Enter project
cd xupay-frontend

# 4. Install dependencies (CORRECTED for Node 23)
npm install framer-motion@11 @tanstack/react-query@5 zustand@5 sonner lucide-react clsx tailwind-merge class-variance-authority @number-flow/react react-confetti-explosion

# 5. Initialize shadcn
npx shadcn@latest init

# 6. Add all shadcn components needed
npx shadcn@latest add button card input select badge label avatar dropdown-menu table skeleton dialog separator sheet

# 7. Verify installation
npm run dev
# Open http://localhost:3000
```

---

## ✅ SUCCESS CRITERIA

### Phase 1-2 Complete When:
- [ ] `npm run dev` starts without errors
- [ ] globals.css has all design tokens
- [ ] shadcn components installed (10+)
- [ ] Custom components created (6+)
- [ ] Type-check passes: `npm run type-check`

### Phase 3-4 Complete When:
- [ ] Sidebar collapses/expands
- [ ] Theme toggle works (light/dark)
- [ ] All 8 pages render
- [ ] Mock data displays correctly
- [ ] Animations smooth (Framer Motion)

### Phase 5 Complete When:
- [ ] Real data from Payment Service shows
- [ ] Transfer flow works end-to-end
- [ ] Error states show correctly
- [ ] Loading spinners display
- [ ] Toast notifications work

---

## 📚 REFERENCE FILES

| File | Location | Purpose |
|------|----------|---------|
| Frontend Design Spec | `frontend/frontend-design-spec.md` | Design tokens, components |
| Phase 1 Guide | `frontend/phase-1-foundation.md` | Foundation setup |
| Phase 2 Guide | `frontend/phase-2-atomic-components.md` | Component code |
| Phase 3 Guide | `frontend/phase-3-layout-system.md` | Layout components |
| Phase 4 Guide | `frontend/phase-4-feature-pages.md` | Page templates |
| Phase 5 Guide | `frontend/phase-5-integration-guide.md` | Backend integration |
| Backend API Guide | `payment-service/FRONTEND_INTEGRATION_GUIDE.md` | API contract |
| Memory Bank | `memory-bank/memory.md` | Progress tracking |

---
