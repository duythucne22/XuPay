# PR7 Fraud Detection - Component Structure & Usage Guide

## Component Hierarchy

```
App Layout
├── Fraud Dashboard Page (/fraud-dashboard)
│   ├── Page Header
│   ├── FraudMetricsContainer
│   │   ├── FraudMetricsCard (Flagged Txns)
│   │   ├── FraudMetricsCard (Flagged Amount)
│   │   ├── FraudMetricsCard (Flagged Rate)
│   │   └── FraudMetricsCard (Critical Risk)
│   └── Flagged Transactions
│       ├── FlaggedTransactionsTable (desktop)
│       └── FlaggedTransactionsMobile (mobile)
│
└── Fraud Rules Page (/fraud/rules)
    ├── Page Header
    └── FraudRulesContainer
        ├── Create Rule Form
        └── FraudRuleCard (repeating)
```

---

## Component Imports & Usage

### 1. FraudMetricsCard
**File:** `src/components/fraud/FraudMetricsCard.tsx`

**Props:**
```typescript
interface FraudMetricsCardProps {
  label: string;              // "Flagged Transactions"
  value: number | string;     // 47 or "2.30%"
  change?: number;            // 5.2 or -3.1
  trend?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;      // <AlertTriangle />
  color: 'blue' | 'red' | 'yellow' | 'green' | 'purple';
  loading?: boolean;
}
```

**Usage:**
```typescript
<FraudMetricsCard
  label="Flagged Transactions"
  value={47}
  change={5.2}
  trend="up"
  icon={<AlertTriangle className="w-5 h-5" />}
  color="red"
/>
```

**Features:**
- Motion animations
- Loading skeleton
- Trend indicators
- 5 color variants
- Dark mode support

---

### 2. FraudMetricsContainer
**File:** `src/components/fraud/FraudMetricsContainer.tsx`

**Props:** None (uses `useFraudMetrics` hook internally)

**Usage:**
```typescript
<FraudMetricsContainer />
```

**What it displays:**
- 4 KPI cards in responsive grid
- Grid: 1 col (mobile) → 2 cols (tablet) → 4 cols (desktop)
- Auto-fetches fraud metrics
- Error boundary included

---

### 3. FlaggedTransactionsTable
**File:** `src/components/fraud/FlaggedTransactionsTable.tsx`

**Props:** None (uses hooks internally)

**Usage:**
```typescript
<FlaggedTransactionsTable />
```

**Features:**
- Desktop-only table (hidden on mobile: `hidden lg:block`)
- Columns: ID, Type, Amount, User, Risk Level, Status, Date
- Filtering by risk level, status
- Search by user/transaction
- Loading state
- Empty state

**Grid Breakpoint:**
- Hidden on: mobile and tablet
- Visible on: desktop (lg+)

---

### 4. FlaggedTransactionsMobile
**File:** `src/components/fraud/FlaggedTransactionCardsMobile.tsx`

**Props:** None (uses hooks internally)

**Usage:**
```typescript
<FlaggedTransactionsMobile />
```

**Features:**
- Mobile-only card view (hidden on desktop: `lg:hidden`)
- Card layout with transaction details
- Risk/status badges
- Transaction type icon
- Responsive spacing

**Grid Breakpoint:**
- Visible on: mobile and tablet
- Hidden on: desktop (lg+)

---

### 5. RiskBreakdownCard
**File:** `src/components/fraud/RiskBreakdownCard.tsx`

**Props:**
```typescript
interface RiskBreakdownCardProps {
  riskBreakdown: RiskBreakdown;
}
```

**Usage:**
```typescript
<RiskBreakdownCard riskBreakdown={transactionRiskData} />
```

**Displays:**
- ML prediction (probability, confidence)
- Triggered rules list
- Rule scores
- Clean card layout

---

### 6. RiskActionButtons
**File:** `src/components/fraud/RiskActionButtons.tsx`

**Props:**
```typescript
interface RiskActionButtonsProps {
  transactionId: string;
}
```

**Usage:**
```typescript
<RiskActionButtons transactionId="txn_123" />
```

**Features:**
- Three action buttons (approve/block/review)
- Reason text input (required)
- Loading states
- Confirmation flow
- Error handling

**Actions Available:**
- ✅ Approve - Flag as legitimate
- 🚫 Block - Block transaction
- 👁️ Review - Mark for manual review

---

### 7. RiskTimeline
**File:** `src/components/fraud/RiskTimeline.tsx`

**Props:**
```typescript
interface RiskTimelineProps {
  events: RiskHistoryEvent[];
}
```

**Usage:**
```typescript
<RiskTimeline events={riskHistoryEvents} />
```

**Features:**
- Chronological sorting (newest first)
- Risk-level-based coloring
- Icon indicators
- Timestamp display
- Resolved/active status
- Score breakdown

**Color Coding:**
- 🔴 CRITICAL/HIGH - Red
- 🟡 MEDIUM - Yellow
- 🟢 LOW - Green

---

### 8. FraudRulesContainer
**File:** `src/components/fraud/FraudRulesContainer.tsx`

**Props:** None (uses `useFraudRules` hook internally)

**Usage:**
```typescript
<FraudRulesContainer />
```

**Features:**
- Rule listing
- Create new rule form
- Enable/disable toggle
- Accuracy metrics
- False positive rate
- Status display

---

## Hook Usage

### useFraudMetrics
```typescript
const { data, loading, error, refetch } = useFraudMetrics();

// data: FraudMetrics | null
// loading: boolean
// error: string | null
// refetch: () => Promise<void>
// Cache: 5 minutes
```

### useFlaggedTransactions
```typescript
const { data, total, loading, error, hasMore, refetch } = useFlaggedTransactions(filters);

// data: FlaggedTransaction[] | null
// total: number
// hasMore: boolean (pagination)
// Cache: None (always fresh)
```

### useFraudRules
```typescript
const { data, loading, error, refetch } = useFraudRules();

// data: FraudRule[] | null
// Cache: 30 minutes
```

### useFraudTransactionAction
```typescript
const { execute, loading, error } = useFraudTransactionAction();

// execute(id, action, reason): Promise<boolean>
// Returns: true if successful
```

---

## Responsive Design Patterns

### Grid Layouts
```typescript
// 1-2-4 pattern (proven from PR6)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 1 col on mobile */}
  {/* 2 cols on tablet (md) */}
  {/* 4 cols on desktop (lg) */}
</div>
```

### Desktop/Mobile Split
```typescript
// Table desktop-only
<FlaggedTransactionsTable />  {/* hidden lg:block */}

// Cards mobile-only
<FlaggedTransactionsMobile /> {/* lg:hidden */}
```

### Spacing
```typescript
// Scales with viewport
className="p-4 md:p-6 lg:p-8"
```

---

## Color System

### Risk Levels
| Level | Color | Class |
|-------|-------|-------|
| CRITICAL | 🔴 Red | `bg-red-*` |
| HIGH | 🟠 Orange | `bg-orange-*` |
| MEDIUM | 🟡 Yellow | `bg-yellow-*` |
| LOW | 🟢 Green | `bg-green-*` |

### Status
| Status | Color | Class |
|--------|-------|-------|
| Blocked | Red | `bg-red-*` |
| Reviewed | Blue | `bg-blue-*` |
| Approved | Green | `bg-green-*` |
| Pending | Gray | `bg-gray-*` |

### Card Colors
| Purpose | Color | Class |
|---------|-------|-------|
| KPI Card 1 | Blue | `color: blue` |
| KPI Card 2 | Red | `color: red` |
| KPI Card 3 | Yellow | `color: yellow` |
| KPI Card 4 | Purple | `color: purple` |

---

## Data Flow

```
Component (Page)
    ↓
Renders Container/Card
    ↓
Container calls Hook
    ↓
Hook calls API Client
    ↓
API Client (returns mock data)
    ↓
Adapter formats data
    ↓
Component displays with formatting
```

### Example: FraudMetricsContainer
```
FraudMetricsContainer
├── useFraudMetrics() hook
│   └── fraudApi.getMetrics()
│       └── Returns MOCK_FRAUD_METRICS
├── Maps data to 4 cards
│   └── formatFraudMetricsDTO(data)
└── Renders 4x FraudMetricsCard components
```

---

## Type Safety Example

```typescript
// All data is typed
const transaction: FlaggedTransaction = {
  id: 'txn_123',
  amount: 5000,
  type: 'TRANSFER',        // TypeScript error if not in union
  riskLevel: 'HIGH',       // TypeScript error if not 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'
  status: 'pending',       // TypeScript error if not in union
  createdAt: new Date(),
  fraudScore: 78.5,
  // ... required fields
};

// Component receives types
<RiskBreakdownCard riskBreakdown={breakdown} />
// TypeScript validates riskBreakdown shape
```

---

## Common Patterns

### Error Handling
```typescript
if (error) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <p className="text-sm text-red-700 dark:text-red-300">
        Failed to load data. Please try again.
      </p>
    </div>
  );
}
```

### Loading State
```typescript
{loading ? (
  <div className="text-center py-8 text-gray-500">Loading...</div>
) : data?.length === 0 ? (
  <div className="text-center py-8 text-gray-500">No data found</div>
) : (
  // Render data
)}
```

### Dark Mode
```typescript
// All components use dark: prefix
className="text-gray-900 dark:text-white"
className="bg-gray-50 dark:bg-gray-800"
className="border-gray-200 dark:border-gray-700"
```

---

## Extending Components

### Add a new metric card
```typescript
// In FraudMetricsContainer, add:
<FraudMetricsCard
  label="New Metric"
  value={data?.newField || 0}
  change={2.5}
  trend="up"
  icon={<NewIcon className="w-5 h-5" />}
  color="green"
  loading={loading}
/>
```

### Add a new component
```typescript
// Create: src/components/fraud/NewComponent.tsx
'use client';

import { useHook } from '@/hooks/api/useHook';

export function NewComponent() {
  const { data, loading, error } = useHook();
  
  if (error) return <ErrorState />;
  if (loading) return <LoadingState />;
  
  return <div>{/* render */}</div>;
}
```

---

## Testing Strategy

### Component Testing
```typescript
// Use mock data from src/mocks/fraud.ts
import { MOCK_FRAUD_METRICS } from '@/mocks/fraud';

test('FraudMetricsCard renders KPI', () => {
  const { getByText } = render(
    <FraudMetricsCard
      label="Test"
      value={MOCK_FRAUD_METRICS.totalFlagged}
      icon={<Icon />}
      color="red"
    />
  );
  expect(getByText('Test')).toBeInTheDocument();
});
```

---

## Performance Optimization

### Memoization
```typescript
// Components are memoized where appropriate
const FraudMetricsCard = memo(function FraudMetricsCard(props) {
  // Component code
});
```

### Callback Optimization
```typescript
// Use useCallback to prevent unnecessary re-renders
const handleAction = useCallback(async (action) => {
  await execute(transactionId, action, reason);
}, [transactionId, reason]);
```

### Caching Strategy
```typescript
// Different TTLs for different data
- Metrics: 5 min (changes frequently)
- Rules: 30 min (stable)
- Trends: 10 min (analytical)
- Transactions: 0 min (always fresh)
```

---

## Accessibility Features

- ✅ Semantic HTML (`<button>`, `<nav>`, `<section>`)
- ✅ ARIA labels for icons
- ✅ Focus indicators
- ✅ Keyboard navigation
- ✅ Color not only differentiator (icons + text)
- ✅ Dark mode support

---

## Component Size Reference

| Component | Lines | Complexity |
|-----------|-------|------------|
| FraudMetricsCard | 80 | Low |
| FraudMetricsContainer | 50 | Low |
| FlaggedTransactionsTable | 140 | Medium |
| FlaggedTransactionCardsMobile | 80 | Low |
| RiskBreakdownCard | 100 | Medium |
| RiskActionButtons | 90 | Medium |
| RiskTimeline | 100 | Medium |
| FraudRulesContainer | 120 | Medium |

**Average: ~100 lines per component**

---

## Quick Checklist for New Components

- [ ] Use `'use client'` directive
- [ ] Import hooks from `@/hooks/api/`
- [ ] Import types from `@/types/`
- [ ] Include error handling
- [ ] Include loading state
- [ ] Use responsive grid (1-2-4)
- [ ] Dark mode support (`dark:` classes)
- [ ] Memoize callbacks
- [ ] Export named function
- [ ] Add JSDoc comments

---

**Component library ready for extension!**

See `SESSION_SUMMARY.md` for overall session report.
