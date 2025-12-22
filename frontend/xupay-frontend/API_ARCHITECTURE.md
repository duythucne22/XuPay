# Frontend API Architecture - Quick Reference

## Overview ✅
The frontend now has **two API integration approaches**:

1. **New approach (recommended)**: `paymentServiceClient.ts` + `userServiceClient.ts` with mock support
2. **Old approach (legacy)**: `lib/api/*` and `hooks/api/*` - will be deprecated

---

## File Structure (New)

```
src/
├── lib/
│   ├── paymentServiceClient.ts      ← Payment Service client (real)
│   ├── userServiceClient.ts         ← User Service client (real)
│   ├── mockPaymentClient.ts         ← Payment Service mock
│   ├── mockUserClient.ts            ← User Service mock
│   └── mock-data.ts                 ← Shared mock data
├── mocks/
│   ├── handlers.ts                  ← MSW HTTP handlers
│   ├── browser.ts                   ← MSW browser worker
│   └── index.ts                     ← Exports
├── hooks/api/ (optional)            ← React Query hooks (to be migrated)
└── providers/
    └── ReactQueryProvider.tsx       ← Starts MSW if NEXT_PUBLIC_USE_MOCKS=true
```

---

## How to Use Mock Mode

### 1. Enable mocks
Create `.env.local`:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_USE_MOCKS=true
```

### 2. Start dev server
```bash
npm run dev
```

MSW will automatically start and intercept HTTP requests.

### 3. Switch to real backend
```env
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:8081
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:8082
```

---

## Usage in Components

### Using the clients directly
```tsx
import { getPaymentServiceClient } from '@/lib/paymentServiceClient';

const client = getPaymentServiceClient();
const result = await client.transfer({
  fromUserId: '...',
  toUserId: '...',
  amountCents: 10000,
  idempotencyKey: uuid(),
});
```

### Using React Query hooks (recommended)
```tsx
import { useQuery } from '@tanstack/react-query';
import { getPaymentServiceClient } from '@/lib/paymentServiceClient';

export function useWallet(userId: string) {
  const client = getPaymentServiceClient();
  return useQuery({
    queryKey: ['wallet', userId],
    queryFn: () => client.getWalletByUserId(userId),
  });
}
```

---

## Migration Plan (Old → New)

### Files to deprecate (old approach):
- `src/lib/api/client.ts` - replaced by `*ServiceClient.ts`
- `src/lib/api/transactions.ts` - migrate to hooks using `paymentServiceClient.ts`
- `src/lib/api/wallets.ts` - migrate to hooks using `paymentServiceClient.ts`
- `src/lib/api/users.ts` - migrate to hooks using `userServiceClient.ts`
- `src/lib/api/auth.ts` - migrate to hooks using `userServiceClient.ts`
- `src/lib/adapters/*` - may be unnecessary with proper types

### Migration steps:
1. Update hooks in `src/hooks/api/` to use `get*ServiceClient()` instead of `src/lib/api/*`
2. Remove `src/lib/api/*` files once all hooks are migrated
3. Update components to use new hooks

---

## Testing

### Unit tests
```tsx
import { setDefaultPaymentServiceClient } from '@/lib/paymentServiceClient';
import { MockPaymentServiceClient } from '@/lib/mockPaymentClient';

beforeEach(() => {
  setDefaultPaymentServiceClient(new MockPaymentServiceClient());
});
```

### E2E tests (with MSW)
MSW is automatically enabled when `NEXT_PUBLIC_USE_MOCKS=true`.

---

## API Clients Comparison

| Feature | New (`*ServiceClient.ts`) | Old (`lib/api/*`) |
|---------|---------------------------|-------------------|
| Mock support | ✅ Built-in | ❌ No |
| Type safety | ✅ Full | ⚠️ Partial |
| Backend-aligned | ✅ Yes | ❌ Outdated |
| Idempotency | ✅ Yes | ❌ No |
| Token handling | ✅ Yes | ✅ Yes |
| Singleton pattern | ✅ Swappable | ❌ Fixed |

---

## Next Steps

1. ✅ Mock clients created
2. ✅ MSW handlers created
3. ✅ Client swapping implemented
4. ✅ Environment config added
5. 🔄 Migrate hooks to use new clients
6. 🔄 Update demo pages to test flows
7. 🔄 Remove old `lib/api/*` files
8. 🔄 Add unit tests

---

## Questions?

Check:
- `paymentServiceClient.ts` - inline comments
- `userServiceClient.ts` - inline comments
- `mocks/handlers.ts` - see example handlers
- Backend docs: `USER_SERVICE_API_DOCUMENTATION.md`, `PAYMENT_SERVICE_API_DOCUMENTATION.md`
