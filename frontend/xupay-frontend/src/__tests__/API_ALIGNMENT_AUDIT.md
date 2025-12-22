# Sprint 3 Wallets - API Alignment Audit

**Date**: December 22, 2025
**Purpose**: Verify API contracts match component implementations before writing tests

---

## 🔍 API Type Analysis

### **From paymentServiceClient.ts**

#### WalletBalanceResponse (from backend)
```typescript
export interface WalletBalanceResponse {
  walletId: string;
  userId: string;
  balanceCents: number;        // ✅ Balance in cents (divide by 100 for display)
  balanceAmount?: number;       // ✅ Optional human-readable amount
  currency: string;             // ✅ Currency code (USD, VND, etc.)
  isActive: boolean;            // ✅ Active/inactive status
  isFrozen: boolean;            // ✅ Frozen status
}
```

**Returned By**:
- `client.getWalletByUserId(userId)` → `Promise<WalletBalanceResponse>`
- `client.getWalletBalance(walletId)` → `Promise<WalletBalanceResponse>`

---

### **Component Wallet Interface (from WalletGrid.tsx)**

```typescript
export interface Wallet {
  id: string;
  name: string;
  type: 'PERSONAL' | 'MERCHANT' | 'ESCROW';
  balance: number;              // ⚠️ NOT from API - mock only
  currency: string;             // ✅ From API
  status: 'active' | 'frozen' | 'inactive';  // ⚠️ Derived from API (isActive, isFrozen)
  createdAt: string;            // ⚠️ NOT from API - mock only
  lastTransaction?: {           // ⚠️ NOT from API - mock only
    date: string;
    amount: number;
    description: string;
  };
  transactionCount: number;     // ⚠️ NOT from API - mock only
  isDefault: boolean;           // ⚠️ NOT from API - mock only
}
```

---

## 📊 Alignment Issues Found

### **ISSUE 1: ID Field Mismatch**
```
Component expects: wallet.id (string)
API provides:      walletId (string)
Status: ⚠️ MISMATCH - Component uses `id`, API uses `walletId`
```

### **ISSUE 2: Balance Field Type**
```
Component expects: wallet.balance (number) - direct display value
API provides:      balanceCents (number) - in cents
Status: ⚠️ CONVERSION NEEDED - Must divide by 100 for display
```

### **ISSUE 3: Status Derived from Multiple Fields**
```
Component expects: wallet.status ('active' | 'frozen' | 'inactive')
API provides:      isActive (boolean), isFrozen (boolean)
Status: ⚠️ DERIVATION NEEDED - Must map:
  - isActive=true, isFrozen=false → 'active'
  - isActive=true, isFrozen=true  → 'frozen'
  - isActive=false               → 'inactive'
```

### **ISSUE 4: Missing Fields from API**
```
These fields exist in mock but NOT in API:
  ❌ name (wallet display name)
  ❌ type (PERSONAL, MERCHANT, ESCROW)
  ❌ createdAt (wallet creation date)
  ❌ lastTransaction (last transaction info)
  ❌ transactionCount (number of transactions)
  ❌ isDefault (default wallet flag)
```

---

## 🔗 Hook Return Types

### **useWalletBalance(walletId)**
```typescript
{
  data?: WalletBalanceResponse,    // ✅ Contains: walletId, userId, balanceCents, currency, isActive, isFrozen
  isLoading: boolean,
  isError: boolean,
  error?: Error,
}
```

### **useUserWallet(userId)**
```typescript
{
  data?: WalletBalanceResponse,    // ✅ Same as above
  isLoading: boolean,
  isError: boolean,
  error?: Error,
}
```

---

## 📝 Component to API Mapping

### **Current Mock Data (wallets/page.tsx)**
```typescript
MOCK_WALLETS: Wallet[] = [
  {
    id: 'wal_main_001',              // Mock: API will use walletId
    name: 'Main Wallet',             // Mock: NOT in API
    type: 'PERSONAL',                // Mock: NOT in API
    balance: 15423.50,               // Mock: API uses balanceCents (1542350)
    currency: 'USD',                 // ✅ API field
    status: 'active',                // Mock: API uses isActive + isFrozen
    isDefault: true,                 // Mock: NOT in API
    createdAt: '2024-01-15...',      // Mock: NOT in API
    lastTransaction: {...},          // Mock: NOT in API
    transactionCount: 45,            // Mock: NOT in API
  }
]
```

### **Real API Response Structure**
```typescript
{
  walletId: 'wal_main_001',
  userId: 'user-123',
  balanceCents: 1542350,             // ⚠️ Must convert: divide by 100 = 15423.50
  currency: 'USD',
  isActive: true,
  isFrozen: false,                   // ⚠️ Derive status: true/false = 'active'
  
  // Missing:
  // - name (need separate endpoint or data store)
  // - type (need separate endpoint or data store)
  // - createdAt
  // - lastTransaction
  // - transactionCount
  // - isDefault
}
```

---

## ✅ Test Mock Strategy

### **Option 1: Mock at Hook Level** (RECOMMENDED)
```typescript
// In test setup:
const mockUseWalletBalance = vi.fn(() => ({
  data: {
    walletId: 'wallet-1',           // Use API field name
    userId: 'user-1',
    balanceCents: 500000,           // 5000.00 in cents
    currency: 'USD',
    isActive: true,
    isFrozen: false,
  },
  isLoading: false,
  isError: false,
}))

// Components transform this:
const displayBalance = (balance?.balanceCents || 0) / 100  // = 5000.00
const status = balance?.isFrozen ? 'frozen' : (balance?.isActive ? 'active' : 'inactive')
```

### **Option 2: Create Adapter Function**
```typescript
// In src/utils/walletAdapter.ts
export function createWalletFromBalance(
  balance: WalletBalanceResponse,
  metadata?: { name?, type?, isDefault? }
): Wallet {
  return {
    id: balance.walletId,                           // Map walletId → id
    name: metadata?.name || 'Wallet',
    type: metadata?.type || 'PERSONAL',
    balance: balance.balanceCents / 100,            // Convert cents to dollars
    currency: balance.currency,
    status: balance.isFrozen ? 'frozen' : 
            balance.isActive ? 'active' : 'inactive',  // Derive status
    isDefault: metadata?.isDefault || false,
    createdAt: metadata?.createdAt || new Date().toISOString(),
  }
}
```

---

## 🧪 Test Mocking Rules

### **For WalletBalanceResponse Mocks**
```typescript
✅ DO use API field names: walletId, balanceCents, isActive, isFrozen
✅ DO test conversion logic: balanceCents / 100
✅ DO test status derivation: isActive + isFrozen → status
❌ DON'T include mock-only fields in API mocks

export function createMockWalletBalance(overrides?: Partial<WalletBalanceResponse>): WalletBalanceResponse {
  return {
    walletId: 'wallet-' + Math.random().toString(36).slice(2, 9),
    userId: 'user-' + Math.random().toString(36).slice(2, 9),
    balanceCents: 500000,  // 5000.00 USD
    currency: 'USD',
    isActive: true,
    isFrozen: false,
    ...overrides,
  }
}
```

### **For Component Wallet Mocks** (when needed for snapshots)
```typescript
✅ DO use Component Wallet interface with all fields
✅ DO indicate which fields are mock vs real
✅ DO test with both API-derived and mock fields

export function createMockWallet(overrides?: Partial<Wallet>): Wallet {
  const balance = createMockWalletBalance()
  return {
    // API-derived:
    id: balance.walletId,
    currency: balance.currency,
    balance: balance.balanceCents / 100,
    
    // Mock-only (pending backend):
    name: 'Test Wallet',
    type: 'PERSONAL',
    status: balance.isFrozen ? 'frozen' : 'active',
    isDefault: false,
    createdAt: new Date().toISOString(),
    transactionCount: 0,
    
    ...overrides,
  }
}
```

---

## 📋 Implementation Checklist

- [ ] **WalletSummaryStats tests**: Use mock Wallet[] (all fields)
- [ ] **WalletGrid tests**: Use mock Wallet[] (all fields)
- [ ] **BalanceHistoryChart tests**: Use mock balance history data array
- [ ] **WalletSettingsForm tests**: Use mock Wallet (all fields)
- [ ] **WalletDetailDrawer tests**: Use mock Wallet + balanceHistory
- [ ] **/wallets page tests**: Use mock Wallet[] + handlers for API calls
- [ ] **/wallets/[id] page tests**: Use mock Wallet + handlers for API calls
- [ ] **Add adapter function**: Create utility to convert WalletBalanceResponse → Wallet
- [ ] **MSW handlers**: Create handlers for all wallet endpoints
- [ ] **Integration tests**: Test API call → conversion → component rendering

---

## 🎯 Conclusion

**Status**: ⚠️ **MISALIGNMENT DETECTED**

**Key Findings**:
1. ✅ Currency and balance display logic properly handles API format
2. ✅ Status derivation logic (isActive + isFrozen) is sound
3. ❌ Component Wallet interface has 7 fields NOT in API
4. ⚠️ Mock data structure doesn't match real API responses

**Recommendation**:
- **Create adapter function** to transform `WalletBalanceResponse` → `Wallet`
- **Mock at hook level** using `WalletBalanceResponse` structure
- **Test converters** to ensure balanceCents and status derivation work
- **Mark mock-only fields** with TODO comments for backend integration

---
