/**
 * PR7 Phase 2: KYC Integration - Quick Reference Guide
 * Use this guide to understand the architecture and file organization
 */

# KYC Integration - Developer Quick Start

## Project Structure

```
src/
├── types/
│   └── kyc.ts (432 lines)
│       ├── KYCProfile (user verification status)
│       ├── KYCDocument (uploaded documents)
│       ├── KYCLimits (transaction limits by tier)
│       ├── VerificationEvent (audit trail)
│       └── 12+ supporting types/enums

├── mocks/
│   └── kyc.ts (400+ lines)
│       ├── MOCK_KYC_PROFILE_* (3 scenarios)
│       ├── MOCK_KYC_DOCUMENTS (5 realistic examples)
│       ├── MOCK_KYC_LIMITS (4 tier limits)
│       ├── MOCK_VERIFICATION_EVENTS (5 timeline events)
│       └── Helper functions (paginated data generation)

├── lib/
│   ├── api/
│   │   └── kycApi.ts (350+ lines)
│   │       ├── Profile & Summary (2 methods)
│   │       ├── Documents (3 methods)
│   │       ├── Limits (3 methods)
│   │       ├── Verification (5 methods)
│   │       └── Specialized (3 methods)
│   │
│   └── adapters/
│       └── kycAdapters.ts (280+ lines)
│           ├── Display formatters (10+ functions)
│           ├── Badge & status classes (6 functions)
│           ├── Validation & logic (6 functions)
│           └── DTO mappers (3 functions)

├── hooks/
│   └── api/
│       └── useKYC.ts (380+ lines)
│           ├── useKYCProfile() - 10min cache
│           ├── useKYCSummary() - 10min cache
│           ├── useKYCDocuments() - no cache
│           ├── useKYCLimits() - 30min cache
│           ├── useKYCAllLimits() - 30min cache
│           ├── useVerificationEvents() - no cache
│           ├── useDocumentUpload()
│           ├── useSelfieUpload()
│           ├── useVerificationSubmit()
│           └── useVerificationRenewal()

├── components/
│   └── kyc/
│       ├── VerificationProgressCard.tsx (120 lines)
│       │   └── Animated progress + step tracking
│       ├── DocumentUploadCard.tsx (180 lines)
│       │   └── Drag-drop upload with preview
│       ├── KYCLimitsCard.tsx (160 lines)
│       │   └── Transaction limits display
│       ├── VerificationMethodSelector.tsx (150 lines)
│       │   └── 5 verification method options
│       ├── DocumentList.tsx (170 lines)
│       │   └── Document list with status tracking
│       └── VerificationTimeline.tsx (190 lines)
│           └── Verification audit trail

└── app/
    └── (app)/
        ├── kyc-verification/
        │   └── page.tsx (70 lines)
        │       └── Main verification dashboard
        └── kyc/documents/
            └── page.tsx (90 lines)
                └── Document management page
```

---

## Common Tasks

### Display User KYC Status

```typescript
'use client';
import { useKYCProfile } from '@/hooks/api/useKYC';
import { formatVerificationStatus } from '@/lib/adapters/kycAdapters';

export function UserKYCStatus() {
  const { profile, loading } = useKYCProfile();
  
  return (
    <div>
      {loading ? 'Loading...' : formatVerificationStatus(profile?.status)}
    </div>
  );
}
```

### Upload and Display Documents

```typescript
'use client';
import { useDocumentUpload, useKYCDocuments } from '@/hooks/api/useKYC';
import { DocumentList } from '@/components/kyc/DocumentList';

export function DocumentManager() {
  const { upload, uploading } = useDocumentUpload();
  const { documents, refetch } = useKYCDocuments();
  
  const handleUpload = async (file: File, type: DocumentType) => {
    await upload(file, type);
    refetch(); // Refresh list
  };
  
  return (
    <>
      <DocumentUploadCard onUpload={handleUpload} isUploading={uploading} />
      <DocumentList documents={documents} onDelete={...} />
    </>
  );
}
```

### Show User Limits Based on Tier

```typescript
'use client';
import { useKYCLimits } from '@/hooks/api/useKYC';
import { KYCLimitsCard } from '@/components/kyc/KYCLimitsCard';

export function ShowLimits() {
  const { limits, loading } = useKYCLimits();
  return <KYCLimitsCard limits={limits} isLoading={loading} />;
}
```

### Display Verification Progress

```typescript
'use client';
import { useKYCSummary } from '@/hooks/api/useKYC';
import { VerificationProgressCard } from '@/components/kyc/VerificationProgressCard';

export function ProgressTracker() {
  const { summary } = useKYCSummary();
  return summary ? (
    <VerificationProgressCard
      status={summary.profile.status}
      tier={summary.profile.verificationTier}
      progress={summary.verificationProgress}
      completedSteps={summary.completedSteps}
      remainingSteps={summary.remainingSteps}
    />
  ) : null;
}
```

### Show Verification Timeline

```typescript
'use client';
import { useVerificationEvents } from '@/hooks/api/useKYC';
import { VerificationTimeline } from '@/components/kyc/VerificationTimeline';

export function Timeline() {
  const { events, loading } = useVerificationEvents();
  return <VerificationTimeline events={events} isLoading={loading} />;
}
```

---

## API Integration (When Backend Ready)

### Step 1: Update Endpoints in kycApi.ts

```typescript
// Replace in src/lib/api/kycApi.ts

async getProfile(userId?: string): Promise<KYCProfile> {
  // ❌ OLD:
  // return MOCK_KYC_PROFILE_VERIFIED;
  
  // ✅ NEW:
  const response = await fetch(`/api/v1/kyc/profile${userId ? `?userId=${userId}` : ''}`);
  return response.json();
}
```

### Step 2: Search for all TODO comments

```bash
grep -r "TODO:" src/lib/api/kycApi.ts
```

Each method is marked with:
```typescript
/**
 * Get user KYC profile
 * TODO: GET /api/v1/kyc/profile
 */
```

### Step 3: Test with Backend

```typescript
// All mock data still available for comparison:
import { MOCK_KYC_PROFILE_VERIFIED } from '@/mocks/kyc';

// Compare real response with mock:
const real = await kycApi.getProfile();
console.log('Real:', real);
console.log('Mock:', MOCK_KYC_PROFILE_VERIFIED);
```

---

## Type System Reference

### VerificationStatus
```typescript
type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'expired';
```

### DocumentType
```typescript
type DocumentType = 'passport' | 'national_id' | 'driver_license' | 'utility_bill' | 'bank_statement';
```

### VerificationMethod
```typescript
type VerificationMethod = 'government_id' | 'selfie' | 'address_proof' | 'video_call' | 'third_party';
```

### KYCLimitTier
```typescript
type KYCLimitTier = 'basic' | 'intermediate' | 'advanced' | 'unlimited';
```

---

## Hook Caching Strategy

### Cached Hooks (5-30 minute TTL)
- `useKYCProfile()` → 10 minutes
- `useKYCSummary()` → 10 minutes
- `useKYCLimits()` → 30 minutes
- `useKYCAllLimits()` → 30 minutes

**When to use:** When showing static data that doesn't change often

### Non-Cached Hooks (Fresh on every request)
- `useKYCDocuments()` → Paginated, can change
- `useVerificationEvents()` → Audit trail, can change

**When to use:** When showing data that users add/modify frequently

### Action Hooks (Manual execution)
- `useDocumentUpload()` → Returns upload promise
- `useSelfieUpload()` → Returns upload promise
- `useVerificationSubmit()` → Returns submit promise
- `useVerificationRenewal()` → Returns renew promise

**When to use:** When user explicitly triggers an action

---

## Adapter Functions Quick Reference

### Status Display
```typescript
formatVerificationStatus('verified') // → "Verified"
formatDocumentStatus('approved') // → "Approved"
formatDocumentType('passport') // → "Passport"
formatVerificationTier('advanced') // → "Advanced Tier"
```

### Badge Classes (Tailwind)
```typescript
getVerificationStatusBadgeClass('verified')
// → "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
```

### Dates
```typescript
formatKYCDate(new Date()) // → "January 18, 2024"
formatKYCTime(new Date()) // → "2:30 PM"
formatVerificationTimestamp(new Date(Date.now() - 3600000)) // → "1h ago"
```

### Validation
```typescript
getDaysUntilExpiry(document.expiresAt) // → 15
isDocumentExpired(document.expiresAt) // → false
isDocumentExpiringSoon(document.expiresAt) // → true
```

---

## Component Props Summary

| Component | Key Props | Use Case |
|-----------|-----------|----------|
| **VerificationProgressCard** | status, progress, steps | Show KYC progress |
| **DocumentUploadCard** | documentType, onUpload | Upload single doc |
| **KYCLimitsCard** | limits, isLoading | Show transaction limits |
| **VerificationMethodSelector** | selectedMethod, onSelect | Choose verification type |
| **DocumentList** | documents, onDelete | Show all documents |
| **VerificationTimeline** | events, isLoading | Show audit trail |

---

## Testing Tips

### Test with Different Mock Profiles

```typescript
// Import any of these:
import {
  MOCK_KYC_PROFILE_UNVERIFIED,
  MOCK_KYC_PROFILE_PENDING,
  MOCK_KYC_PROFILE_VERIFIED,
  MOCK_KYC_PROFILE_REJECTED,
} from '@/mocks/kyc';

// Use in component:
<VerificationProgressCard
  status={MOCK_KYC_PROFILE_PENDING.status}
  tier={MOCK_KYC_PROFILE_PENDING.verificationTier}
  // ...
/>
```

### Test Pagination

```typescript
const { documents, hasMore, refetch } = useKYCDocuments({
  offset: 0,
  limit: 10,
});

// Load more:
const { documents: more } = useKYCDocuments({
  offset: 10,
  limit: 10,
});
```

### Test Caching

```typescript
const { profile: profile1, refetch } = useKYCProfile();
// profile1 comes from mock data

const { profile: profile2 } = useKYCProfile();
// profile2 comes from cache (same instance)

await refetch();
// Forces fresh fetch and clears cache
```

---

## Performance Notes

- ✅ All hooks use `useCallback` for memoization
- ✅ Cache prevents unnecessary API calls
- ✅ Paginated requests don't use cache (always fresh)
- ✅ Components use `motion.div` for animations (lightweight)
- ✅ Images are optimized (no large preview files)
- ✅ Dark mode doesn't require re-renders

---

## Common Patterns

### Show loading skeleton while fetching
```typescript
import { useKYCLimits } from '@/hooks/api/useKYC';
import { KYCLimitsCard } from '@/components/kyc/KYCLimitsCard';

export function Limits() {
  const { limits, loading } = useKYCLimits();
  return <KYCLimitsCard limits={limits} isLoading={loading} />;
}
```

### Handle errors gracefully
```typescript
const { profile, error, refetch } = useKYCProfile();

if (error) {
  return (
    <div>
      <p>Failed to load profile</p>
      <button onClick={refetch}>Retry</button>
    </div>
  );
}
```

### Combine multiple hooks
```typescript
const { profile } = useKYCProfile();
const { limits } = useKYCLimits();
const { documents } = useKYCDocuments();

// All data available together
if (profile && limits && documents) {
  // Render complete view
}
```

---

**📚 This guide covers all 13 Phase 2 foundation files**

**For detailed implementation, see PR7_PHASE2_FOUNDATION_COMPLETE.md**
