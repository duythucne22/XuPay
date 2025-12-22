# Sprint 3 Wallets Test Suite - Quick Start Guide

## 📋 What Was Created

### Utility Files (2 files)
1. **`src/utils/walletAdapter.ts`** - Converts API responses to component types
2. **`src/mocks/wallets.ts`** - Mock data factories and test utilities

### Test Files (5 files = 142+ tests)
1. **`WalletSummaryStats.test.tsx`** - 22 tests for 4-card stats
2. **`WalletGrid.test.tsx`** - 28 tests for wallet cards grid
3. **`BalanceHistoryChart.test.tsx`** - 34 tests for 30-day chart
4. **`WalletSettingsForm.test.tsx`** - 28 tests for settings form
5. **`WalletDetailDrawer.test.tsx`** - 30 tests for detail drawer

---

## 🚀 Quick Commands

### Run All Wallet Component Tests
```bash
npm test -- src/components/dashboard/__tests__/Wallet*.test.tsx
```

### Run Individual Component Tests
```bash
# WalletSummaryStats tests
npm test -- src/components/dashboard/__tests__/WalletSummaryStats.test.tsx

# WalletGrid tests
npm test -- src/components/dashboard/__tests__/WalletGrid.test.tsx

# BalanceHistoryChart tests
npm test -- src/components/dashboard/__tests__/BalanceHistoryChart.test.tsx

# WalletSettingsForm tests
npm test -- src/components/dashboard/__tests__/WalletSettingsForm.test.tsx

# WalletDetailDrawer tests
npm test -- src/components/dashboard/__tests__/WalletDetailDrawer.test.tsx
```

### Run with Coverage Report
```bash
npm test -- --coverage src/components/dashboard/__tests__/
```

### Run in Watch Mode (Development)
```bash
npm test -- --watch src/components/dashboard/__tests__/
```

### Run with UI Dashboard
```bash
npm test -- --ui src/components/dashboard/__tests__/
```

---

## 📊 Test Breakdown

| Component | Tests | What's Tested |
|-----------|-------|---------------|
| **WalletSummaryStats** | 22 | 4 stat cards, currency formatting, loading states, animations, responsive |
| **WalletGrid** | 28 | Wallet cards, type icons, status badges, quick actions, callbacks, disabled states |
| **BalanceHistoryChart** | 34 | LineChart, 30/7/90 day history, statistics (min/max/avg), currency, tooltips |
| **WalletSettingsForm** | 28 | Input fields, dropdowns, toggles, save/delete handlers, validation, loading |
| **WalletDetailDrawer** | 30 | Drawer visibility, wallet info display, chart, settings, delete, close handlers |
| **TOTAL** | **142+** | Complete component coverage |

---

## 🎯 Test Coverage Areas

✅ **Rendering & DOM**
- All components render correctly
- Proper element structure
- Data displays accurately

✅ **User Interactions**
- Button clicks
- Form input changes
- Toggle switches
- Dropdown selection
- Drawer open/close

✅ **Callbacks & Handlers**
- onWalletClick
- onSendClick
- onAddFundsClick
- onSave
- onDelete
- onClose

✅ **State Management**
- Props updates
- Loading states
- Empty states
- Error states

✅ **Data Formatting**
- Currency (USD, VND, EUR)
- Balance conversion (cents → dollars)
- Date formatting
- Number formatting

✅ **Responsiveness**
- Mobile (375px)
- Tablet (768px)
- Desktop (1920px)

✅ **Accessibility**
- ARIA labels
- Heading hierarchy
- Button labels
- Form structure

✅ **Dark Mode**
- Proper class application
- Color contrast

---

## 📚 Mock Data Available

### Pre-configured Wallets
```javascript
import { MOCK_WALLET_PRESETS } from '@/mocks/wallets'

// 8 preset wallets ready to use:
- MOCK_WALLET_PRESETS.activePersonal      // $1,500 USD, active
- MOCK_WALLET_PRESETS.activeBusiness      // $5,000 USD, active
- MOCK_WALLET_PRESETS.frozenWallet        // $2,000 USD, frozen
- MOCK_WALLET_PRESETS.inactiveWallet      // $0 USD, inactive
- MOCK_WALLET_PRESETS.escrowWallet        // $10,000 USD, active
- MOCK_WALLET_PRESETS.highBalanceWallet   // $500,000 USD, active
- MOCK_WALLET_PRESETS.lowBalanceWallet    // $50 USD, active
- MOCK_WALLET_PRESETS.multiCurrencyWallet // 25,000 VND, active
```

### Factory Functions
```javascript
import { 
  createMockWallet,
  createMockWallets,
  createMockBalanceHistory,
  calculateWalletStats,
  getMockActiveWallets,
  getMockWalletsByStatus,
  getMockWalletsByType,
} from '@/mocks/wallets'

// Create single wallet
const wallet = createMockWallet({ 
  name: 'Custom Wallet', 
  balance: 5000 
})

// Create multiple wallets
const wallets = createMockWallets(5) // 5 wallets with variations

// Create 30-day history
const history = createMockBalanceHistory(30)

// Calculate stats
const stats = calculateWalletStats(wallets)
// { totalBalance: X, activeWallets: X, walletsWithBalance: X, totalTransactions: X }

// Get filtered wallets
const activeOnly = getMockActiveWallets()
const byStatus = getMockWalletsByStatus('active')
const byType = getMockWalletsByType('PERSONAL')
```

---

## 🔧 Utility Functions Available

### Adapter Functions
```javascript
import { 
  adaptWalletFromBalance,
  deriveWalletStatus,
  convertBalanceFromCents,
  convertBalanceToCents,
  formatBalance,
  canUseWallet,
  getWalletTypeLabel,
  getWalletStatusDisplay,
} from '@/utils/walletAdapter'

// Convert API response to component type
const balance = { walletId: '123', balanceCents: 150000, ... }
const wallet = adaptWalletFromBalance(balance, {
  name: 'My Wallet',
  type: 'PERSONAL',
})

// Derive wallet status
const status = deriveWalletStatus(true, false) // Returns 'active'

// Convert balance
const cents = 150000
const dollars = convertBalanceFromCents(cents) // 1500.00

// Format for display
const formatted = formatBalance(150000, 'USD') // "$1,500.00"

// Check if wallet is usable
const canUse = canUseWallet('active') // true
const cannotUse = canUseWallet('frozen') // false

// Get labels
const label = getWalletTypeLabel('PERSONAL') // 'Personal'
const display = getWalletStatusDisplay('active')
// { label: 'Active', colorClass: 'text-green-600', bgClass: 'bg-green-50' }
```

---

## ✅ Build Status

```
✓ Compiled successfully
✓ TypeScript: 0 errors
✓ Next.js: 16.1.0
✓ All 11 routes generated
✓ Ready for testing
```

---

## 🧪 Test Examples

### Example 1: Testing Component Rendering
```typescript
it('should render wallet grid', () => {
  render(
    <WalletGrid
      wallets={[MOCK_WALLET_PRESETS.activePersonal]}
      onWalletClick={vi.fn()}
      onSendClick={vi.fn()}
      onAddFundsClick={vi.fn()}
      isLoading={false}
    />
  )
  expect(screen.getByText('Personal Wallet')).toBeInTheDocument()
})
```

### Example 2: Testing User Interaction
```typescript
it('should call onSendClick when Send button clicked', async () => {
  const mockSend = vi.fn()
  const user = userEvent.setup()
  
  render(
    <WalletGrid
      wallets={[MOCK_WALLET_PRESETS.activePersonal]}
      onWalletClick={vi.fn()}
      onSendClick={mockSend}
      onAddFundsClick={vi.fn()}
      isLoading={false}
    />
  )
  
  await user.click(screen.getByRole('button', { name: /send/i }))
  expect(mockSend).toHaveBeenCalled()
})
```

### Example 3: Testing State Changes
```typescript
it('should update when props change', () => {
  const { rerender } = render(
    <WalletGrid
      wallets={[MOCK_WALLET_PRESETS.activePersonal]}
      onWalletClick={vi.fn()}
      onSendClick={vi.fn()}
      onAddFundsClick={vi.fn()}
      isLoading={false}
    />
  )
  
  expect(screen.getByText('Personal Wallet')).toBeInTheDocument()
  
  rerender(
    <WalletGrid
      wallets={[MOCK_WALLET_PRESETS.activeBusiness]}
      onWalletClick={vi.fn()}
      onSendClick={vi.fn()}
      onAddFundsClick={vi.fn()}
      isLoading={false}
    />
  )
  
  expect(screen.getByText('Business Account')).toBeInTheDocument()
})
```

---

## 📝 Test File Structure

Each test file follows this structure:

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup before each test
  })

  describe('Rendering Tests', () => {
    it('should render...', () => {})
  })

  describe('Interaction Tests', () => {
    it('should handle user click...', () => {})
  })

  describe('State Tests', () => {
    it('should update when props change...', () => {})
  })

  describe('Edge Cases', () => {
    it('should handle empty data...', () => {})
  })
})
```

---

## 🎓 Key Concepts

### Mock Data Alignment with API
- **API Response**: `WalletBalanceResponse` (from payment service)
  - `walletId`, `userId`, `balanceCents`, `currency`, `isActive`, `isFrozen`
  
- **Component Type**: `Wallet` (used in UI)
  - `id`, `name`, `type`, `balance`, `currency`, `status`, `createdAt`, etc.

- **Adapter**: `adaptWalletFromBalance()`
  - Converts API response → Component type
  - Handles field mapping, conversion, derivation

### Test Strategy
1. **Mock at Hook Level** - Return real API types
2. **Transform via Adapter** - Use in components
3. **Test with Factories** - Consistent test data
4. **Verify Behavior** - Correct rendering & interactions

---

## 🔍 Debugging Tips

### If Tests Fail:
1. Check console output for errors
2. Verify mock data structure matches component expectations
3. Use `screen.debug()` to inspect DOM
4. Check adapter functions for conversion issues

### If Build Fails:
1. Verify all imports are correct
2. Check TypeScript errors
3. Ensure mock files are in `src/mocks/`
4. Run `npm run build` to catch compile errors

### Running Specific Tests:
```bash
# By description
npm test -- -t "should render"

# By file path
npm test -- src/components/dashboard/__tests__/WalletGrid.test.tsx

# By pattern
npm test -- --testNamePattern="wallet grid"
```

---

## 📞 Next Steps

### To Add More Tests:
1. Create new `.test.tsx` file in `__tests__` folder
2. Follow existing test patterns
3. Use mock factories and adapters
4. Run and verify passing

### To Run Full Suite:
```bash
npm test -- src/components/dashboard/__tests__/
```

### Expected Results:
- ✅ 140+ tests passing
- ✅ 0 errors
- ✅ Full component coverage
- ✅ All animations tested
- ✅ Responsive design verified
- ✅ Accessibility validated

---

## 📦 Files Summary

```
src/
├── utils/
│   └── walletAdapter.ts                    # API conversion utilities
├── mocks/
│   └── wallets.ts                          # Mock data factories
├── components/dashboard/__tests__/
│   ├── WalletSummaryStats.test.tsx         # 22 tests
│   ├── WalletGrid.test.tsx                 # 28 tests
│   ├── BalanceHistoryChart.test.tsx        # 34 tests
│   ├── WalletSettingsForm.test.tsx         # 28 tests
│   └── WalletDetailDrawer.test.tsx         # 30 tests
└── __tests__/
    ├── API_ALIGNMENT_AUDIT.md              # API contract analysis
    └── TESTING_IMPLEMENTATION_SUMMARY.md   # Detailed testing summary
```

---

**Status**: ✅ Ready to execute tests!
