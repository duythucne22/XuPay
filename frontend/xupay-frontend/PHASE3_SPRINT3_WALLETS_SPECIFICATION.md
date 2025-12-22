# Sprint 3: Wallets Pages - Specification & Implementation Plan

**Status**: 📋 Planning
**Date**: December 22, 2025
**Based On**: Sprint 2 (Transactions) Pattern + Existing Wallet Components

---

## 🎯 Overview

**Similarities to Transactions Pattern:**
- List page with filters, search, summary stats, and pagination
- Detail page with drawer showing full information
- Mock data + backend integration comments
- Same animation effects (stagger, hover, scroll-triggered)
- Identical dark mode and responsive design
- Copy-to-clipboard actions for wallet IDs

**Differences from Transactions:**
- BalanceCard component instead of transaction items
- Wallet management actions (rename, set default, freeze/unfreeze, delete)
- Balance history chart (30-day trend)
- Wallet settings panel
- Different summary metrics (total balance, count, active wallets)

---

## 📊 Page Structure

### **Wallets List Page** `/wallets`

```
┌─────────────────────────────────────────────────┐
│  Page Header                                     │
│  "Your Wallets" + Date                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Summary Stats (StaggerContainer - 4 cards)    │
│  ├─ Total Balance                              │
│  ├─ Active Wallets                             │
│  ├─ Wallets with Balance                       │
│  └─ Total Transactions                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Filters Section                                │
│  ├─ Wallet Type Filter (all, savings, checking)│
│  ├─ Status Filter (all, active, frozen)        │
│  └─ Search Bar (debounced 300ms)               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Wallets Grid (StaggerContainer)               │
│  ├─ Desktop: 3 columns                         │
│  ├─ Tablet: 2 columns                          │
│  └─ Mobile: 1 column                           │
│                                                 │
│  Each Wallet Card:                             │
│  ├─ BalanceCard (amount, currency)             │
│  ├─ Wallet name & type badge                   │
│  ├─ Last transaction info                      │
│  ├─ Status badge (Active/Frozen)               │
│  ├─ Hover: Scale 1.03 + action menu            │
│  └─ Click: Open detail drawer                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  "Add New Wallet" Button (Fixed or floating)   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Pagination Controls                            │
│  ├─ Page size selector (5, 10, 25, 50)         │
│  ├─ Page info (Page X of Y)                    │
│  └─ Prev/Next buttons                          │
└─────────────────────────────────────────────────┘
```

### **Wallet Detail Page** `/wallets/[id]`

```
┌─────────────────────────────────────────────────┐
│  Right-Side Drawer (Framer Motion slide)       │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Header with Close Button                │   │
│  ├─────────────────────────────────────────┤   │
│  │ Wallet Info Section                     │   │
│  │ ├─ Amount (large, colored)              │   │
│  │ ├─ Wallet Name                          │   │
│  │ ├─ Type Badge (Savings/Checking/etc)    │   │
│  │ └─ Status Badge (Active/Frozen)         │   │
│  ├─────────────────────────────────────────┤   │
│  │ Quick Stats (Grid 2x2)                  │   │
│  │ ├─ Total Transactions                   │   │
│  │ ├─ Last Transaction                     │   │
│  │ ├─ Monthly Average                      │   │
│  │ └─ Wallet Created Date                  │   │
│  ├─────────────────────────────────────────┤   │
│  │ Balance History Chart                   │   │
│  │ (30-day trend - Line chart)             │   │
│  │ ├─ Recharts LineChart                   │   │
│  │ ├─ Tooltip on hover                     │   │
│  │ └─ Scroll-triggered animation           │   │
│  ├─────────────────────────────────────────┤   │
│  │ Recent Transactions                     │   │
│  │ (Last 5 transactions)                   │   │
│  │ ├─ Transaction list (compact)           │   │
│  │ └─ "View All" link                      │   │
│  ├─────────────────────────────────────────┤   │
│  │ Wallet Settings Section                 │   │
│  │ ├─ Rename Wallet (text input + save)    │   │
│  │ ├─ Change Type (dropdown)               │   │
│  │ ├─ Set as Default (toggle)              │   │
│  │ └─ Freeze/Unfreeze (toggle)             │   │
│  ├─────────────────────────────────────────┤   │
│  │ Actions Section                         │   │
│  │ ├─ Copy Wallet ID button                │   │
│  │ ├─ Export Statements button (UI ready)  │   │
│  │ ├─ Freeze/Unfreeze button               │   │
│  │ └─ Delete Wallet button                 │   │
│  ├─────────────────────────────────────────┤   │
│  │ Backend Integration Notes (Yellow box)  │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## ✨ Animation Effects (Reusing from Phase 2/3A)

| Effect | Where Used | Configuration |
|--------|-----------|---|
| **Stagger Container** | Wallet grid on list page | `itemVariants`, delay 0.05s per item |
| **Hover Scale** | Each wallet card | `scale: 1.03`, duration 0.2s |
| **Entrance/Fade** | Page header, filters | `opacity: 0 → 1, y: 20 → 0`, duration 0.5s |
| **Scroll-Triggered** | Balance chart section | `useInView`, fade + slide up on scroll |
| **Tap Scale** | All buttons | `scale: 0.98`, duration 0.1s |
| **Drawer Slide** | Detail drawer | `x: 100% → 0`, duration 0.3s, tween timing |
| **Color Transition** | Status badges | Smooth transitions between states |
| **Number Animation** | Balance display | Counter effect from 0 to amount |

---

## 🎨 Color Scheme

```
Wallet Cards:
  Border: border-gray-200 dark:border-slate-700
  Background: bg-white dark:bg-slate-900
  Hover: hover:bg-gray-50 dark:hover:bg-slate-800

Status Badges:
  Active: bg-green-500/10 text-green-500 border-green-500/20
  Frozen: bg-yellow-500/10 text-yellow-500 border-yellow-500/20
  Inactive: bg-gray-500/10 text-gray-500 border-gray-500/20

Type Badges:
  Savings: bg-blue-500/10 text-blue-500
  Checking: bg-purple-500/10 text-purple-500
  Credit: bg-red-500/10 text-red-500
  Investment: bg-indigo-500/10 text-indigo-500

Balance Display:
  Positive: text-green-600 dark:text-green-400
  Neutral: text-gray-900 dark:text-white

Chart:
  Line: stroke-indigo-500
  Fill: fill-indigo-500/10
```

---

## 📋 Component Reuse Matrix

```
WALLETS LIST PAGE:
├── BalanceCard (Phase 2)
│   └─ Displays wallet balance, currency, type
├── StaggerContainer (Phase 2)
│   └─ Stagger animation for wallet grid
├── PaginationControls (Sprint 2)
│   └─ Page size, page navigation
├── useDebounce (Sprint 2)
│   └─ Search query debouncing
└── NEW: WalletGrid component
    └─ Grid layout (3/2/1 columns)

WALLET DETAIL DRAWER:
├── StatusBadge (existing)
│   └─ Active/Frozen/Inactive status
├── Recharts LineChart (new)
│   └─ 30-day balance history
├── RecentTransactions (Phase 2, adapted)
│   └─ Show last 5 transactions
├── Button (existing)
│   └─ All action buttons
└── NEW: WalletSettingsForm component
    └─ Rename, type, default, freeze toggles
```

---

## 📊 Mock Data Structure

```typescript
interface Wallet {
  id: string
  name: string
  type: 'savings' | 'checking' | 'credit' | 'investment'
  balance: number
  currency: string
  status: 'active' | 'frozen' | 'inactive'
  createdAt: string
  lastTransaction?: {
    date: string
    amount: number
    description: string
  }
  transactionCount: number
  isDefault: boolean
  balanceHistory: Array<{
    date: string
    balance: number
  }>
  recentTransactions: Array<TransactionDTO>
}

// 8 mock wallets:
const MOCK_WALLETS = [
  {
    id: 'wal_main_001',
    name: 'Main Wallet',
    type: 'checking',
    balance: 15423.50,
    currency: 'USD',
    status: 'active',
    isDefault: true,
    // ...
  },
  // ... 7 more wallets
]
```

---

## 🔍 Wallets List Page Features

### **Summary Stats Cards**
```
1. Total Balance: $45,789.50 (all wallets combined)
2. Active Wallets: 6 (count of active)
3. Wallets with Balance: 7 (count > 0)
4. Total Transactions: 124 (sum across all)
```

### **Filters**
```
Wallet Type:
  ├─ All
  ├─ Savings
  ├─ Checking
  ├─ Credit
  └─ Investment

Status:
  ├─ All
  ├─ Active
  ├─ Frozen
  └─ Inactive

Search (Debounced 300ms):
  ├─ Wallet name
  ├─ Wallet ID
  └─ Type
```

### **Wallet Card Display**
```
Desktop (3 columns):
┌──────────────┐
│  BalanceCard │  Amount (large, colored)
│              │
│ Main Wallet  │  Name + type badge
│ Checking     │
│              │
│ Active       │  Status badge
│ •4 transactions
│              │
│ Last: $500   │  Last transaction
│              │
│ [Actions ▼]  │  Action menu on hover
└──────────────┘

Mobile (1 column): Full width cards with right-aligned amount
```

### **Pagination**
- Default page size: 10
- Options: 5, 10, 25, 50
- Shows "Page X of Y"
- Prev/Next buttons

---

## 🎯 Wallet Detail Drawer Features

### **What's Shown**
1. **Wallet Info Header**
   - Large balance display
   - Wallet name
   - Type and status badges

2. **Quick Stats** (2x2 grid)
   - Total Transactions
   - Last Transaction (date + amount)
   - Monthly Average (calculated)
   - Created Date

3. **Balance History Chart**
   - 30-day line chart
   - Hover tooltips showing exact amounts
   - Scroll-triggered reveal animation
   - Responsive to container width

4. **Recent Transactions**
   - Last 5 transactions
   - Compact list view
   - "View All" link → /transactions?wallet=id

5. **Settings Form**
   - Rename Wallet (text input + save button)
   - Change Type (dropdown)
   - Set as Default (toggle)
   - Freeze/Unfreeze (toggle)

6. **Action Buttons**
   - Copy Wallet ID
   - Export Statements (UI ready, backend pending)
   - Freeze/Unfreeze Wallet
   - Delete Wallet

7. **Backend Integration Notes**
   - Yellow info box listing pending integrations

---

## 🔧 New Components to Create

### **1. WalletGrid.tsx**
```typescript
interface WalletGridProps {
  wallets: Wallet[]
  onWalletClick: (wallet: Wallet) => void
  isLoading?: boolean
}

// Features:
// - Responsive grid (3/2/1 columns)
// - StaggerContainer with hover effects
// - Shows BalanceCard for each wallet
// - Displays wallet info (name, type, status)
// - Shows last transaction
// - Action menu on hover
```

### **2. WalletSettingsForm.tsx**
```typescript
interface WalletSettingsFormProps {
  wallet: Wallet
  onSave: (changes: Partial<Wallet>) => void
  onDelete: () => void
  isLoading?: boolean
}

// Features:
// - Rename field with save button
// - Type selector dropdown
// - Default wallet toggle
// - Freeze/Unfreeze toggle
// - Delete button with confirmation
```

### **3. BalanceHistoryChart.tsx**
```typescript
interface BalanceHistoryChartProps {
  data: Array<{ date: string; balance: number }>
  walletName?: string
  currency?: string
}

// Features:
// - Line chart (Recharts)
// - Tooltip with formatted amounts
// - Scroll-triggered animation
// - Responsive to container
// - Dark mode support
```

### **4. WalletDetailDrawer.tsx**
```typescript
// Combined drawer component that includes:
// - Header with close button
// - Wallet info section
// - Quick stats grid
// - Balance history chart
// - Recent transactions list
// - Settings form
// - Action buttons
// - Backend integration notes
```

### **5. WalletSummaryStats.tsx** (Similar to TransactionSummary)
```typescript
interface WalletSummaryStatsProps {
  totalBalance: number
  activeWallets: number
  walletsWithBalance: number
  totalTransactions: number
  currency?: string
}

// Similar to TransactionSummary but for wallet metrics
```

---

## 📅 Implementation Timeline

| Component | Est. Time | Notes |
|-----------|-----------|-------|
| WalletGrid | 1h | Grid layout + BalanceCard integration |
| WalletSettingsForm | 1h | Form with toggles + delete confirmation |
| BalanceHistoryChart | 1.5h | Recharts integration + animations |
| WalletDetailDrawer | 1.5h | Combine all components + actions |
| WalletSummaryStats | 0.5h | Similar to TransactionSummary |
| Wallets List Page | 2h | Filters + search + pagination |
| Wallet Detail Page | 1h | Drawer integration |
| Tests | 2h | Unit + integration tests |
| **Total** | **9-10h** | |

---

## ✅ Success Criteria

### **Wallets List Page**
- [ ] Displays all wallets in responsive grid (3/2/1)
- [ ] Summary stats show correct calculations
- [ ] Filters work (type, status, search)
- [ ] Search debounced (300ms)
- [ ] Pagination works (page size, navigation)
- [ ] Stagger animations on load
- [ ] Hover scale effect on cards
- [ ] Click opens detail drawer
- [ ] Dark mode fully supported
- [ ] Mobile responsive

### **Wallet Detail Drawer**
- [ ] Drawer slides in from right
- [ ] Shows all wallet information
- [ ] Balance chart renders correctly
- [ ] Recent transactions list shows
- [ ] Settings form functional (UI only)
- [ ] Action buttons present (UI ready)
- [ ] Copy wallet ID works
- [ ] Delete confirmation dialog shows
- [ ] Backend notes visible
- [ ] Dark mode supported

### **Testing**
- [ ] 150+ tests passing (adding ~20 new tests)
- [ ] No regressions in existing tests
- [ ] All components unit tested
- [ ] Responsive design tested at breakpoints
- [ ] Dark mode tested throughout

---

## 🎬 Animation Details

### **List Page Entrance**
```
Header: opacity 0→1, y 20→0, 0.5s
Summary: staggered with 0.1s delays
Filters: opacity 0→1, 0.5s, delay 0.1s
Grid: StaggerContainer with itemVariants
```

### **Card Hover**
```
whileHover={{ scale: 1.03 }}
transition={{ duration: 0.2 }}
Shadow increase on dark mode
```

### **Drawer Animation**
```
Backdrop: opacity 0→1
Drawer: x 100%→0, tween, 0.3s
Content: staggered fade on entry
```

### **Chart Scroll**
```
useInView({ once: true, margin: "-100px" })
On visible: opacity 0→1, y 20→0, 0.5s
```

---

## 🔗 Backend Integration Hooks

All backend calls commented with TODOs:

```typescript
// TODO: Backend Integration
// When backend ready, use:
// - useWallets() - list all wallets
// - useWallet(id) - get single wallet details
// - useUpdateWallet(id) - rename, type changes
// - useDeleteWallet(id) - delete wallet
// - useWalletBalance(id) - real-time balance
// - useWalletHistory(id, days) - balance history
// - useWalletTransactions(id) - recent transactions

// Endpoints needed:
// GET /api/wallets - list
// GET /api/wallets/{id} - detail
// PATCH /api/wallets/{id} - update (rename, type)
// POST /api/wallets/{id}/freeze - freeze wallet
// DELETE /api/wallets/{id} - delete
// GET /api/wallets/{id}/history - balance history
// GET /api/wallets/{id}/transactions - recent txns
// POST /api/wallets/{id}/statements/export - export (UI ready)
```

---

## 📝 Mock Data Features

- ✅ 8 sample wallets with varied data
- ✅ Different types (Savings, Checking, Credit, Investment)
- ✅ Various statuses (Active, Frozen, Inactive)
- ✅ Balance history (30-day trend data)
- ✅ Recent transactions per wallet
- ✅ Last transaction info
- ✅ Realistic names and amounts
- ✅ Default wallet indicator

---

## 🚀 Ready to Build?

When you're ready, we'll implement in this order:
1. Create WalletGrid & WalletSummaryStats
2. Build Wallets list page (filters, search, pagination)
3. Create BalanceHistoryChart
4. Create WalletSettingsForm
5. Build WalletDetailDrawer
6. Implement Wallet detail page
7. Add tests (150+ total expected)
8. Final QA & dark mode verification

**All features will include backend integration comments for later connection to real APIs.**

---

Let me know when you're ready to start! 🎯
