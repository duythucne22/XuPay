# **XUPAY LAYOUT & PAGE ARCHITECTURE SPECIFICATION**
## **Complete Grid System, Component Hierarchy, and Data Flow Blueprint**

***

## **PART 1: PROJECT STRUCTURE & OVERVIEW**

### **1.1 Route Structure (Current)**

```
src/app/
│
├── (public)                          /* Public / Marketing routes */
│   ├── page.tsx                      /* Home page */
│   └── layout.tsx                    /* Public layout (header + footer) */
│
├── (auth)                            /* Authentication routes (separate layout) */
│   ├── login/page.tsx                /* Login form (split-screen layout) */
│   ├── register/page.tsx             /* Register form (split-screen layout) */
│   └── layout.tsx                    /* Auth layout (centered form + hero) */
│
└── (app)                             /* Protected app routes (DashboardLayout) */
    ├── layout.tsx                    /* Main app layout (sidebar + topbar + content) */
    │
    ├── dashboard/page.tsx            /* Dashboard home (grid: KPI + charts) */
    ├── wallets/page.tsx              /* Wallets list (grid: 3-col card layout) */
    ├── wallets/[id]/page.tsx         /* Wallet detail (split: info + transactions) */
    ├── transactions/page.tsx         /* Transactions list (table/cards + filters) */
    ├── transactions/[id]/page.tsx    /* Transaction detail (modal/panel) */
    ├── profile/page.tsx              /* User profile (form layout) */
    ├── settings/page.tsx             /* Settings (sidebar nav + form content) */
    └── sars/page.tsx                 /* Compliance - SAR Reports (table layout) */
```

### **1.2 Missing Pages (To Implement)**

```
HIGH PRIORITY (Core features):
├── (app)/analytics/page.tsx          /* Analytics dashboard (charts + filters) */
├── (app)/users/page.tsx              /* User management (admin table) */
├── (app)/users/[id]/page.tsx         /* User detail (admin view) */
├── (app)/audit/page.tsx              /* Audit log (table with filters) */
└── (app)/reports/transactions/page.tsx /* Transaction reports & exports */

MEDIUM PRIORITY (Admin/compliance):
├── (app)/users/invite/page.tsx       /* Invite/onboarding */
├── (app)/security/page.tsx           /* Security settings + 2FA */
├── (app)/compliance/page.tsx         /* Compliance workflows (AML, case mgmt) */
├── (app)/integrations/page.tsx       /* API keys, webhooks */
└── (app)/billing/page.tsx            /* Subscription management */

LOW PRIORITY (Secondary):
├── (app)/notifications/page.tsx      /* Notification center */
├── (app)/support/page.tsx            /* Help + support tickets */
└── (app)/settings/*                  /* Settings subpages */
```

***

## **PART 2: GLOBAL LAYOUT ARCHITECTURE**

### **2.1 Root Layout Structure (src/app/layout.tsx)**

**Definition: Three-tier viewport structure**

```
┌────────────────────────────────────────────┐
│              VIEWPORT (100vw × 100vh)      │
│                                            │
├────────────────────────────────────────────┤
│  GLOBAL HEADER (Fixed top, z-50)           │
│  - Logo + Brand                            │
│  - Global navigation                       │
│  - User menu / Notifications               │
│  Height: 3.5rem (56px)                     │
├────────────────────────────────────────────┤
│  MAIN CONTENT AREA (100vh - header height) │
│  │                                         │
│  └─ Route-specific layouts rendered here   │
│                                            │
└────────────────────────────────────────────┘
```

**Key CSS Variables (layout tokens now defined in `src/styles/variables.css` and theme tokens in `src/styles/global.css`):**

```css
--header-height: 3.5rem;              /* 56px */
--sidebar-width: 16rem;               /* 256px (w-64) */
--container-max-width: 1280px;        /* 80rem (max-w-7xl) */
--container-padding-x: 1.5rem;        /* 24px (px-6) */
--container-padding-y: 2rem;          /* 32px (py-8) */
--transition-duration: 250ms;         /* Standard animation */

Note: `Container` and `AppShell` have been normalized to consume `--container-max-width` and the container padding tokens for consistent layout spacing.
```

***

### **2.2 Layout Variants**

**Three layout types based on route group:**

#### **A. Public Layout (Marketing Pages)**

**File:** `src/app/(public)/layout.tsx`

```
Structure:
┌─────────────────────────────────────┐
│  Header (Logo + Nav + CTA buttons)  │  Fixed
├─────────────────────────────────────┤
│                                     │
│  Main Content (Full width)          │  Scrollable
│  - Hero section                     │
│  - Feature blocks                   │
│  - Testimonials                     │
│  - Pricing                          │
│                                     │
├─────────────────────────────────────┤
│  Footer (Full width)                │
└─────────────────────────────────────┘

Grid Rules:
- Hero: 100% width, no max-width constraint
- Content blocks: max-w-7xl, mx-auto, px-6
- Cards in sections: grid 1/2/3 columns (responsive)
- Footer: full width, separate container
```

**Responsive Behavior:**
- Mobile (<640px): Single column, stacked sections
- Tablet (640–1024px): 2-column grids, narrower padding
- Desktop (≥1024px): 3-column grids, max-width 1280px

***

#### **B. Auth Layout (Login / Register)**

**File:** `src/app/(auth)/layout.tsx`

```
Structure:
┌──────────────────┬──────────────────┐
│  Form Container  │  Hero / Image    │
│  (50% desktop)   │  (50% desktop)   │
│  (100% mobile)   │  (hidden mobile) │
└──────────────────┴──────────────────┘

LEFT SIDE (Form):
- Max-width: 448px (max-w-md)
- Center vertically & horizontally
- White background
- Padding: px-6 py-8

RIGHT SIDE (Hero):
- Gradient background (blue)
- 3D illustration (safe, lock, etc.)
- Responsive: hidden on mobile, visible on desktop
- Padding: flex items-center justify-center

Grid Rules:
- Main flex container: flex flex-col md:flex-row
- Left: w-full md:w-1/2, flex items-center justify-center
- Right: hidden md:flex md:w-1/2
- Form wrapper: w-full max-w-md
```

**Responsive Behavior:**
- Mobile (<768px): Single column, form full width, hero below/hidden
- Tablet (768px+): Side-by-side 50/50 split
- Desktop: Smooth transition, form stays centered

***

#### **C. Dashboard Layout (App Pages)**

**File:** `src/app/(app)/layout.tsx` → renders `DashboardLayout`

```
Structure:
┌─────────────────────────────────────────────────┐
│        TOPBAR (Fixed, z-50)                     │
│  Logo | Breadcrumbs | Search | Notifications... │
│  Height: 3.5rem (56px)                          │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────────────────────────┐   │
│  │ SIDEBAR (w-64)                           │   │
│  │ - Logo                                   │   │
│  │ - Primary nav (Dashboard, Wallets, etc.) │   │
│  │ - User profile block at bottom           │   │
│  │ - Theme toggle                           │   │
│  │                                          │   │
│  │ Fixed width, scrollable                  │   │
│  │ Hidden on mobile (hamburger menu)        │   │
│  └──────────────────────────────────────────┘   │
│  │                                              │
│  │  ┌────────────────────────────────────────┐  │
│  │  │ MAIN CONTENT AREA                      │  │
│  │  │ (Scrollable, flex-1 width)             │  │
│  │  │                                        │  │
│  │  │ - Page title section                   │  │
│  │  │ - Filters / Controls                   │  │
│  │  │ - Main content grid                    │  │
│  │  │ - Footer (if needed)                   │  │
│  │  │                                        │  │
│  │  └────────────────────────────────────────┘  │
│  │                                              │
└─────────────────────────────────────────────────┘

Grid Rules (Sidebar + Main):
- Flex container: flex h-[calc(100vh-3.5rem)]
- Sidebar: w-64 flex-shrink-0 (doesn't compress)
- Main: flex-1 overflow-y-auto (takes remaining space)

Main Content Rules:
- Wrapper: mx-auto max-w-7xl px-6 py-8
- Sections separated by mb-6 or mb-8
- Grids: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Cards: gap-4 or gap-6 (depending on section)
```

**Responsive Behavior:**
- Mobile (<768px):
  - Sidebar hidden (replaced by hamburger menu, shown as overlay)
  - Main content: full width, px-4 (16px padding)
  - Topbar: compact version, hamburger visible
  - Grids: single column (grid-cols-1)
  
- Tablet (768px–1024px):
  - Sidebar: visible, w-64
  - Main: flex-1
  - Grids: 2 columns (md:grid-cols-2)
  
- Desktop (≥1024px):
  - Sidebar: visible, w-64
  - Main: flex-1
  - Grids: 3 columns (lg:grid-cols-3)

***

## **PART 3: PAGE-LEVEL GRID DEFINITIONS**

### **3.1 Dashboard Page (KPI + Charts)**

**File:** `src/app/(app)/dashboard/page.tsx`

**Grid Structure:**

```
DASHBOARD PAGE GRID:

┌──────────────────────────────────────────────────────────┐
│ Page title section (full width)                          │
│ "Dashboard" heading + subtitle                           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Filters & controls (flex row on desktop, wrap mobile)    │
│ - Date range dropdown                                    │
│ - Wallet selector                                        │
│ - View toggle buttons                                    │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ KPI Cards Grid (4 columns desktop, 2 tablet, 1 mobile)   │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│ │ Balance  │ │ Income   │ │ Expenses │ │ Savings  │      │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│ Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4          │
│ Gap: gap-4                                               │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Main Content Grid (3 columns desktop, 1 mobile)          │
│                                                          │
│ ┌─────────────────────────────────┐ ┌────────────────┐   │
│ │ Charts section (2 cols wide)    │ │ Sidebar        │   │
│ │ - Recent transactions chart     │ │ (1 col wide)   │   │
│ │ - Analytics                     │ │ - Top items    │   │
│ │ - Stats                         │ │ - Quick actions│   │
│ └─────────────────────────────────┘ └────────────────┘   │
│                                                          │
│ Grid: grid-cols-1 lg:grid-cols-3                         │
│ Left: lg:col-span-2                                      │
│ Right: lg:col-span-1                                     │
│ Gap: gap-6                                               │
└──────────────────────────────────────────────────────────┘

CSS Classes Applied:
- Wrapper: mx-auto max-w-7xl px-6 py-8
- Sections: mb-6 / mb-8
- KPI grid: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
- Main grid: grid grid-cols-1 lg:grid-cols-3 gap-6
- Left content: lg:col-span-2
- Right sidebar: lg:col-span-1
```

**Data Dependencies:**
- Hook: `useTransactionStats()`, `useWallets()`, `useDashboardOverview()`
- API: `dashboardApi.getOverview()` (returns totals, counts, charts)
- Adapters: Transaction/wallet mappers

**Loading State:**
- Show skeleton cards (KPI placeholders) while fetching
- Show skeleton chart while loading analytics
- Progressive enhancement: load stats → load charts → load sidebar

***

### **3.2 Wallets Page (Card Grid)**

**File:** `src/app/(app)/wallets/page.tsx`

**Grid Structure:**

```
WALLETS PAGE GRID:

┌──────────────────────────────────────────────────────────┐
│ Page title section (full width)                          │
│ "My Wallets" heading + subtitle                          │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Action buttons (flex row on desktop)                     │
│ - "+ Add Wallet" (primary button)                        │
│ - "Import Wallet" (secondary button)                     │
│ Responsive: wrap on mobile, inline on desktop            │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Wallet Cards Grid (3 columns desktop, 2 tablet, 1 mob)   │
│                                                          │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                      │
│ │ Card 1  │ │ Card 2  │ │ Card 3  │                      │
│ │ (type)  │ │ (type)  │ │ (type)  │                      │
│ │ Balance │ │ Balance │ │ Balance │                      │
│ └─────────┘ └─────────┘ └─────────┘                      │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                      │
│ │ Card 4  │ │ Card 5  │ │ Card 6  │                      │
│ └─────────┘ └─────────┘ └─────────┘                      │
│                                                          │
│ Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3          │
│ Gap: gap-6                                               │
│ Card component: rounded-xl, border, p-6, hover shadow    │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Pagination / Load More (centered)                        │
│ "Load more wallets" button                               │
└──────────────────────────────────────────────────────────┘

CSS Classes Applied:
- Wrapper: mx-auto max-w-7xl px-6 py-8
- Title section: mb-8
- Action buttons: mb-6, flex flex-col sm:flex-row gap-3
- Card grid: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Load more: mt-6 text-center
```

**Data Dependencies:**
- Hook: `useWallets()`
- API: `walletsApi.getWallets()`
- Adapter: `mapWalletDTOToWallet()`

**Card Component Structure:**
- Top: Wallet type badge + balance
- Middle: Wallet name + account info
- Bottom: Last transaction + Actions menu

***

### **3.3 Transactions Page (Table + Filters)**

**File:** `src/app/(app)/transactions/page.tsx`

**Grid Structure:**

```
TRANSACTIONS PAGE GRID:

┌──────────────────────────────────────────────────────────┐
│ Page title + Filters (flex row on desktop)               │
│                                                          │
│ LEFT: "Transactions" heading + subtitle                  │
│ RIGHT: Date range dropdown | Wallet selector | Type btns │
│ Responsive: stacked mobile, inline desktop               │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Search bar (full width)                                  │
│ Placeholder: "Search by name, amount, reference..."      │
│ Icon: magnifying glass (right)                           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Summary Statistics Grid (3 columns desktop, 1 mobile)    │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│ │ Total sent   │ │ Total recv   │ │ Count        │       │
│ │ $2,450.00    │ │ $3,890.00    │ │ 24           │       │
│ └──────────────┘ └──────────────┘ └──────────────┘       │
│ Grid: grid-cols-1 md:grid-cols-3 gap-4                   │
└──────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Transaction List (conditional rendering)                │
│                                                         │
│ DESKTOP VIEW (≥768px, .desktop-only):                   │
│ ┌──────────────────────────────────────────────────┐    │
│ │ TABLE (sticky header, 12-column grid)            │    │
│ │ ┌─────────────────────────────────────────────┐  │    │
│ │ │ Date | Description | Wallet | Type | Amt... │  │    │
│ │ ├─────────────────────────────────────────────┤  │    │
│ │ │ Row 1 (col-span-12)                         │  │    │
│ │ │ Row 2 (col-span-12)                         │  │    │
│ │ │ Row 3 (col-span-12)                         │  │    │
│ │ │ ...                                         │  │    │
│ │ └─────────────────────────────────────────────┘  │    │
│ └──────────────────────────────────────────────────┘    │
│                                                         │
│ MOBILE VIEW (<768px, .md:hidden):                       │
│ ┌──────────────────────────────────────────────────┐    │
│ │ CARD STACK (space-y-4)                           │    │
│ │ ┌──────────────────────────────────────────────┐ │    │
│ │ │ Transaction Card 1 (flex layout)             │ │    │
│ │ │ Icon | Name | Amount + Status                │ │    │
│ │ │ Date | Specs | Wallet | Menu                 │ │    │
│ │ └──────────────────────────────────────────────┘ │    │
│ │ ┌──────────────────────────────────────────────┐ │    │
│ │ │ Transaction Card 2                           │ │    │
│ │ └──────────────────────────────────────────────┘ │    │
│ │ ...                                              │    │
│ └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Load More Button (centered, mt-6)                        │
│ "Load more transactions"                                 │
└──────────────────────────────────────────────────────────┘

CSS Classes Applied:
- Wrapper: mx-auto max-w-7xl px-6 py-8
- Title+filters: flex flex-col md:flex-row md:justify-between mb-6
- Search: mb-6
- Summary: grid grid-cols-1 md:grid-cols-3 gap-4 mb-8
- Table: .desktop-only (display: hidden on mobile)
- Cards: .md:hidden (hidden on desktop)
- Table grid: grid-cols-12 gap-4 (header + rows)
- Card stack: space-y-4
```

**Data Dependencies:**
- Hooks: `useTransactions()`, `useTransactionStats()`
- APIs: `transactionsApi.getList()`, `transactionsApi.getStats()`
- Adapters: `mapTransactionDTOToTransaction()`

**Filter Logic:**
- Date range: changes API query parameters
- Wallet: client-side or server-side filter
- Type (All/Sent/Received/Failed): client-side toggle
- Search: real-time client-side filter

***

### **3.4 Wallet Detail Page (Split Layout)**

**File:** `src/app/(app)/wallets/[id]/page.tsx`

**Grid Structure:**

```
WALLET DETAIL PAGE GRID:

┌──────────────────────────────────────────────────────────┐
│ Page title section (full width)                          │
│ "Wallet Name" heading + subtitle                         │
│ Breadcrumb: Wallets > [Wallet name]                      │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Main Content Grid (2 columns desktop, 1 mobile)          │
│                                                          │
│ ┌──────────────────────────────────┐ ┌────────────────┐ │
│ │ LEFT SIDE (2/3 width)            │ │ RIGHT SIDE     │ │
│ │                                  │ │ (1/3 width)    │ │
│ │ - Wallet details card            │ │ - Balance info │ │
│ │ - Recent transactions (table)    │ │ - Quick actions│ │
│ │ - Stats                          │ │ - Account info │ │
│ │                                  │ │                │ │
│ └──────────────────────────────────┘ └────────────────┘ │
│                                                          │
│ Grid: grid-cols-1 lg:grid-cols-3                        │
│ Left: lg:col-span-2                                      │
│ Right: lg:col-span-1                                     │
│ Gap: gap-6                                               │
└──────────────────────────────────────────────────────────┘

CSS Classes Applied:
- Wrapper: mx-auto max-w-7xl px-6 py-8
- Main grid: grid grid-cols-1 lg:grid-cols-3 gap-6
- Left: lg:col-span-2 (space for details + transactions)
- Right: lg:col-span-1 (sidebar for info + actions)
```

**Data Dependencies:**
- Hook: `useWallet(id)`
- API: `walletsApi.getWalletById(id)`
- Sub-hook: `useTransactions({ walletId: id })` for recent transactions

***

### **3.5 Profile Page (Form Layout)**

**File:** `src/app/(app)/profile/page.tsx`

**Grid Structure:**

```
PROFILE PAGE GRID:

┌──────────────────────────────────────────────────────────┐
│ Page title section (full width)                          │
│ "User Profile" heading + subtitle                        │
└──────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Profile Form Container (centered, narrow max-width)     │
│                                                         │
│ Max-width: 640px (max-w-2xl)                            │
│ Centered: mx-auto                                       │
│                                                         │
│ Sections (vertical stack):                              │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Avatar section                                     │  │
│ │ - Profile photo                                    │  │
│ │ - Upload / change button                           │  │
│ └────────────────────────────────────────────────────┘  │
│                                                         │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Personal info section                              │  │
│ │ - First name input                                 │  │
│ │ - Last name input                                  │  │
│ │ - Email input (read-only)                          │  │
│ │ - Phone input                                      │  │
│ │ - Date of birth input                              │  │
│ └────────────────────────────────────────────────────┘  │
│                                                         │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Address section                                    │  │
│ │ - Street address                                   │  │
│ │ - City, State, Zip                                 │  │
│ │ - Country                                          │  │
│ └────────────────────────────────────────────────────┘  │
│                                                         │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Actions (bottom)                                   │  │
│ │ - Save changes button                              │  │
│ │ - Cancel button                                    │  │
│ └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

CSS Classes Applied:
- Wrapper: mx-auto max-w-2xl px-6 py-8
- Form sections: space-y-6 (between sections)
- Form fields: space-y-4 (between inputs within section)
- Buttons: flex gap-3 (side-by-side)
```

**Data Dependencies:**
- Hook: `useCurrentUser()`, `useUpdateUser()`
- API: `usersApi.getMyProfile()`, `usersApi.updateMyProfile(data)`
- Adapter: `mapUserDTOToUser()`

***

### **3.6 Settings Page (Sidebar Nav + Form)**

**File:** `src/app/(app)/settings/page.tsx`

**Grid Structure:**

```
SETTINGS PAGE GRID:

┌──────────────────────────────────────────────────────────┐
│ Page title section (full width)                          │
│ "Settings" heading + subtitle                            │
└──────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Settings Layout (2 columns desktop, 1 mobile)           │
│                                                         │
│ ┌──────────────────┐ ┌─────────────────────────────────┐│
│ │ LEFT NAV (25%)   │ │ RIGHT CONTENT (75%)             ││
│ │ (w-64 or 1/4)    │ │                                 ││
│ │                  │ │ [Based on nav selection]        ││
│ │ - Account        │ │ - Profile settings              ││
│ │ - Security       │ │ - 2FA setup                     ││
│ │ - Notifications  │ │ - Privacy controls              ││
│ │ - Integrations   │ │ - API keys                      ││
│ │ - Billing        │ │ - Webhook settings              ││
│ │ - Appearance     │ │ - Theme toggle                  ││
│ │                  │ │                                 ││
│ └──────────────────┘ └─────────────────────────────────┘│
│                                                         │
│ Grid: grid-cols-1 lg:grid-cols-4 gap-6                  │
│ Left nav: lg:col-span-1                                 │
│ Right content: lg:col-span-3                            │
└─────────────────────────────────────────────────────────┘

CSS Classes Applied:
- Wrapper: mx-auto max-w-7xl px-6 py-8
- Main grid: grid grid-cols-1 lg:grid-cols-4 gap-6
- Left: lg:col-span-1 (sticky sidebar nav)
- Right: lg:col-span-3 (scrollable content area)
- Nav buttons: block w-full text-left px-4 py-2
- Active nav: bg-blue-50 text-blue-700
```

**Data Dependencies:**
- Hook: `useCurrentUser()`, `useSettings()`
- API: `usersApi.getSettings()`, `usersApi.updateSettings()`

***

### **3.7 Transactions List Page (Compliance/Admin)**

**File:** `src/app/(app)/sars/page.tsx`

**Similar to Transactions but with different columns:**

```
Grid Structure:
- Same wrapper: max-w-7xl
- Same filters + search pattern
- Same table/card dual-view
- Columns: Order ID | SAR Status | Risk Level | Reason | Created | Actions
- Summary: Total SARs | High-risk count | Pending review
```

***

## **PART 4: SHARED COMPONENT LAYOUT RULES**

### **4.1 Card Component**

```
CARD DEFINITION:
┌──────────────────────────────┐
│  [Padding: p-4 or p-6]       │
│                              │
│  Card content                │
│  (text, icons, forms, etc.)  │
│                              │
└──────────────────────────────┘

CSS Classes:
- Container: bg-white border border-gray-200 rounded-xl p-6
- Hover: hover:shadow-md transition-shadow duration-250
- Dark: dark:bg-gray-900 dark:border-gray-800

Used in:
- KPI cards (Dashboard, Transactions summary)
- Wallet cards (Wallets list)
- Transaction cards (Mobile view)
- Stats cards (Analytics)
```

### **4.2 Table Component (Desktop)**

```
TABLE DEFINITION:
┌────────────────────────────────────┐
│ [Sticky Header]                    │
│ Col1 | Col2 | Col3 | ... | Actions │
├────────────────────────────────────┤
│ Data Row 1 (hover effect)          │
│ Data Row 2 (hover effect)          │
│ Data Row 3 (hover effect)          │
│ ...                                │
└────────────────────────────────────┘

CSS Classes:
- Header: sticky top-0 bg-gray-50 px-6 py-3 border-b
- Header cell: font-medium text-gray-600 text-sm
- Row: px-6 py-4 border-b hover:bg-gray-50 transition
- Row cell: text-sm, align-middle
- Status badge: px-2 py-1 rounded-full text-xs font-medium
- Type icon: w-6 h-6 rounded-full flex items-center justify-center
```

### **4.3 Badge / Tag Component**

```
BADGE DEFINITION (Status):
┌─────────────────────┐
│ SUCCESS / PENDING / │
│ FAILED / PENDING    │
└─────────────────────┘

CSS Classes:
- Success: bg-green-100 text-green-800
- Pending: bg-yellow-100 text-yellow-800
- Failed: bg-red-100 text-red-800
- Info: bg-blue-100 text-blue-800
- Shape: rounded-full, px-2 py-1
- Font: text-xs font-medium uppercase
```

### **4.4 Button Component**

```
BUTTON DEFINITION:
Primary: bg-blue-600 hover:bg-blue-700 text-white
Secondary: bg-gray-100 hover:bg-gray-200 text-gray-900
Outline: border border-gray-300 hover:bg-gray-50 text-gray-900
Text: text-gray-600 hover:text-gray-900 no-background

Sizing:
- sm: px-3 py-1.5 text-sm
- md: px-4 py-2 text-base (default)
- lg: px-6 py-3 text-lg

Shape: rounded-lg for buttons, rounded-full for pills
```

***

## **PART 5: RESPONSIVE BEHAVIOR MATRIX**

```
BREAKPOINT BEHAVIOR TABLE:

┌──────────────┬──────────┬──────────┬──────────┬──────────┐
│ Component    │ Mobile   │ Tablet   │ Desktop  │ Ultra-   │
│              │ <640px   │ 640-1024 │ 1024-1536│ wide     │
│              │          │          │          │ >1536px  │
├──────────────┼──────────┼──────────┼──────────┼──────────┤
│ Sidebar      │ Hidden   │ Visible  │ Visible  │ Visible  │
│              │ (overlay)│ (static) │ (static) │ (static) │
├──────────────┼──────────┼──────────┼──────────┼──────────┤
│ Grid columns │ 1 col    │ 2 cols   │ 3 cols   │ 4 cols   │
│ (cards)      │ (100%)   │ (50%)    │ (33%)    │ (25%)    │
├──────────────┼──────────┼──────────┼──────────┼──────────┤
│ Padding      │ px-4     │ px-6     │ px-6     │ px-8     │
│              │ py-4     │ py-6     │ py-8     │ py-8     │
├──────────────┼──────────┼──────────┼──────────┼──────────┤
│ Max-width    │ 100%     │ 768px    │ 1024px   │ 1280px   │
│              │ (flex)   │ (flex)   │ (flex)   │ (fixed)  │
├──────────────┼──────────┼──────────┼──────────┼──────────┤
│ Font sizes   │ -1 size  │ base     │ base     │ +1 size  │
│              │          │          │          │          │
├──────────────┼──────────┼──────────┼──────────┼──────────┤
│ Table view   │ Hidden   │ Hidden   │ Visible  │ Visible  │
│ (desktop)    │ (cards)  │ (cards)  │ (table)  │ (table)  │
├──────────────┼──────────┼──────────┼──────────┼──────────┤
│ Filters      │ Stacked  │ Wrap     │ Inline   │ Inline   │
│              │          │          │          │          │
└──────────────┴──────────┴──────────┴──────────┴──────────┘
```

***

## **PART 6: CSS VARIABLES & TOKENS**

**File: `src/styles/global.css`**

```css
:root {
  /* Layout */
  --header-height: 3.5rem;
  --sidebar-width: 16rem;
  --container-max-width: 1280px;
  --container-padding-x: 1.5rem;
  --container-padding-y: 2rem;
  
  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  
  /* Border radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  
  /* Transitions */
  --transition-fast: 150ms;
  --transition-normal: 250ms;
  --transition-slow: 350ms;
  --easing: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Colors (semantic) */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-primary-active: #1d4ed8;
  
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #0ea5e9;
  
  /* Z-index stack */
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-fixed: 30;
  --z-modal-backdrop: 40;
  --z-modal: 50;
  --z-popover: 60;
  --z-tooltip: 70;
}
```

***

## **PART 7: DATA FLOW & HOOKS MAPPING**

### **7.1 Auth Flow**

```
LOGIN/REGISTER PAGES:
├─ useLogin() / useRegister()
│  └─ authApi.login() / register()
│     └─ Store token in localStorage/cookie
│     └─ Redirect to /app/dashboard

PROTECTED ROUTES:
├─ useAuth() middleware (in layout)
│  └─ Check token validity
│  └─ If invalid → redirect to /login
│  └─ If valid → render page

SIDEBAR/TOPBAR:
├─ useCurrentUser()
│  └─ Get logged-in user info
│  └─ Display in user menu
```

### **7.2 Dashboard Data Flow**

```
DASHBOARD PAGE:
├─ useDashboardOverview() [NEW HOOK - create if missing]
│  └─ dashboardApi.getOverview()
│     └─ Returns: { totals, stats, charts, recentTransactions }
│  └─ Render KPI cards (from totals)
│  └─ Render charts (from charts data)
│  └─ Render recent items (from recentTransactions)

ALTERNATIVE (Current approach):
├─ useTransactionStats()
│  └─ transactionsApi.getStats()
├─ useWallets()
│  └─ walletsApi.getWallets()
├─ Manually combine data in component
```

### **7.3 Wallets Data Flow**

```
WALLETS LIST PAGE:
├─ useWallets() [with pagination]
│  └─ walletsApi.getWallets({ limit, offset, filters })
│  └─ Returns: { data: Wallet[], total, limit, offset }
│  └─ Render WalletCard for each wallet
│  └─ Show load more button if offset < total

WALLET DETAIL PAGE:
├─ useWallet(id)
│  └─ walletsApi.getWalletById(id)
│  └─ Render wallet info card
├─ useTransactions({ walletId: id })
│  └─ transactionsApi.getList({ walletId, limit })
│  └─ Show recent transactions in detail page
```

### **7.4 Transactions Data Flow**

```
TRANSACTIONS LIST PAGE:
├─ useTransactionStats() [for summary cards]
│  └─ transactionsApi.getStats({ dateRange })
├─ useTransactions() [for list]
│  └─ transactionsApi.getList({
│     limit, offset, dateRange, walletId, type, search })
│  └─ On filter change → refetch with new params
│  └─ Render as table (desktop) or cards (mobile)
│  └─ Show load more if offset < total

TRANSACTION DETAIL PAGE:
├─ useTransaction(id)
│  └─ transactionsApi.getById(id)
│  └─ Show full details (amount, fee, fraud score, etc.)
```

***

## **PART 8: IMPLEMENTATION CHECKLIST FOR AI AGENT**

### **Phase 1: Global Layout Setup**

**Before building any pages, establish:**

- [ ] **Define CSS variables** in `src/styles/global.css`:
  - Container max-widths, sidebar width, header height
  - Spacing scale, border radius, transitions
  - Z-index stack, semantic colors

- [ ] **Update Tailwind config** in `tailwind.config.ts`:
  - Add 12-column grid (`gridTemplateColumns: { 12: ... }`)
  - Add max-width containers
  - Verify breakpoints (sm, md, lg, xl, 2xl)

- [ ] **Standardize DashboardLayout**:
  - Sidebar: always `w-64`, flex-shrink-0
  - Main: always `flex-1`, `overflow-y-auto`
  - Use CSS variables, not hardcoded values
  - Mobile: sidebar hidden, hamburger toggle

- [ ] **Create Container wrapper component**:
  - Props: `maxWidth` (sm/md/lg/xl), `variant`
  - Default: `max-w-7xl mx-auto px-6 py-8`
  - Export as reusable component

### **Phase 2: Page-Level Implementation (Order matters)**

**Implement pages in this order:**

1. **Dashboard** (`/app/dashboard`)
   - Depends on: `useDashboardOverview()` hook
   - Grid: KPI (4 cols) + Charts (2/1 cols)
   - Load data → render skeletons → show content

2. **Transactions** (`/app/transactions`)
   - Depends on: `useTransactions()`, `useTransactionStats()`
   - Grid: Summary (3 cols) + Table/Cards
   - Filters + Search working

3. **Wallets** (`/app/wallets`)
   - Depends on: `useWallets()`
   - Grid: 3-column card layout
   - Pagination / Load more

4. **Auth Pages** (`/auth/login`, `/auth/register`)
   - Layout: Split-screen (50/50 desktop, 100% mobile)
   - No sidebar, no topbar, centered form

5. **Profile** (`/app/profile`)
   - Depends on: `useCurrentUser()`, `useUpdateUser()`
   - Layout: Centered form, max-w-2xl

6. **Remaining pages** (Wallet detail, Transactions detail, Settings, etc.)

### **Phase 3: Missing Pages to Implement**

HIGH PRIORITY:
- [ ] `/app/analytics` (dashboard variant with more charts)
- [ ] `/app/users` (admin table, similar to Transactions)
- [ ] `/app/audit` (compliance log)

MEDIUM PRIORITY:
- [ ] `/app/reports/transactions` (exports, filters)
- [ ] `/app/security` (settings variant)

### **Phase 4: Data & Adapters**

- [ ] Create/verify hooks in `src/hooks/api/`:
  - `useDashboardOverview()` [NEW if missing]
  - `useTransactions()`, `useTransactionStats()`
  - `useWallets()`, `useWallet()`
  - `useCurrentUser()`, `useSettings()`

- [ ] Verify API adapters in `src/lib/adapters/`:
  - `mapTransactionDTOToTransaction()` with all fields
  - `mapWalletDTOToWallet()` with balance, status
  - `mapUserDTOToUser()` with profile fields

- [ ] Update mocks in `src/mocks/`:
  - Mock responses for all API calls
  - Pagination mock data
  - Filter/search mock logic

### **Phase 5: Testing & QA**

- [ ] Unit tests for each page component
- [ ] Responsive tests (mobile, tablet, desktop)
- [ ] Visual regression snapshots
- [ ] Accessibility audit (keyboard nav, contrast, ARIA)
- [ ] Performance (lazy load, skeleton states)

***

## **PART 9: PROMPT FOR AI AGENT**

```
**TASK: Rebuild XUPAY Frontend Layout & Pages (Next.js + TypeScript + shadcn/ui)**

**Context:**
You have a complete Next.js 14 project with routes, hooks, APIs, and adapters. 
The layout and grid system need formal definition and implementation.
Your job is to implement pages following the layout architecture spec (NOT write code yet, just understand).

**Architecture Overview:**

1. **Global Layouts (3 types):**
   - Public (Marketing): Hero sections, features, pricing
   - Auth (Login/Register): Split-screen (form 50% | hero 50%)
   - Dashboard (Protected): Sidebar (w-64) + Main content (flex-1)

2. **Container System:**
   - Max-width wrapper: max-w-7xl mx-auto px-6 py-8
   - All pages use this wrapper
   - CSS variables define dimensions (--container-max-width, --sidebar-width, etc.)

3. **Responsive Grid:**
   - Mobile (<640px): Single column, sidebar hidden, hamburger menu
   - Tablet (640–1024px): 2-column grids, sidebar visible
   - Desktop (≥1024px): 3-column grids, full sidebar, max-width fixed

4. **Page Layouts (Key Examples):**

   **Dashboard:**
   - KPI cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
   - Charts + sidebar: grid-cols-1 lg:grid-cols-3
   - Data: useDashboardOverview() [create if missing]

   **Transactions:**
   - Summary: grid-cols-1 md:grid-cols-3
   - Table: 12-column grid (desktop), hidden on mobile
   - Cards: space-y-4 stack (mobile), visible only on mobile
   - Data: useTransactions(), useTransactionStats()

   **Wallets:**
   - Card grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
   - Data: useWallets()

   **Auth:**
   - Split: flex flex-col md:flex-row
   - Left: w-full md:w-1/2 (form, centered, max-w-md)
   - Right: hidden md:flex md:w-1/2 (hero, gradient bg)

5. **Component Requirements:**
   - All cards: bg-white border border-gray-200 rounded-xl p-6
   - All tables: sticky header, 12-column grid, hover effects
   - All badges: rounded-full, uppercase, color-coded status
   - All buttons: primary (blue), secondary (gray), outline (border)

6. **Data Flow:**
   - Pages call hooks (useWallets, useTransactions, etc.)
   - Hooks call API clients (walletsApi, transactionsApi, etc.)
   - API returns DTOs, adapters map to UI models
   - Mocks provide data during development

**Your Task (3 Phases):**

PHASE 1: Understand & Acknowledge
- [ ] Read this spec completely
- [ ] Identify which files need updates:
  - src/styles/global.css (CSS variables)
  - src/components/layout/* (DashboardLayout, Sidebar, etc.)
  - tailwind.config.ts (grid, max-width)
- [ ] Ask clarifying questions if any architecture is unclear

PHASE 2: Map Pages to Layouts
- [ ] List current pages: dashboard, wallets, transactions, profile, settings, sars
- [ ] List missing pages: analytics, users, audit, reports, security
- [ ] For each page, specify:
  - Layout type (public/auth/dashboard)
  - Grid structure (column counts at each breakpoint)
  - Data dependencies (hooks + APIs)
  - Card/Table/Form component type
  - Responsive behavior (mobile to desktop)

PHASE 3: Identify Implementation Order
- [ ] Phase 1: Global setup (CSS vars, Container component, Tailwind config)
- [ ] Phase 2a: Auth pages (login, register)
- [ ] Phase 2b: Dashboard pages (dashboard, wallets, transactions)
- [ ] Phase 2c: Secondary pages (profile, settings)
- [ ] Phase 3: Missing pages (analytics, users, audit)
- [ ] Phase 4: Update mocks, tests, snapshots

**Deliverable for Each Phase:**

PHASE 1 Output:
- File checklist with changes needed
- CSS variable definitions to add
- Tailwind config updates
- Container component props interface

PHASE 2 Output:
- Page grid specification (ASCII diagram)
- Data dependencies (hooks + APIs required)
- Responsive breakpoints (each grid column count)
- Component structure (cards, tables, forms)

PHASE 3 Output:
- Implementation roadmap (ordered by priority)
- Dependencies graph (which pages need which hooks)
- Test strategy (unit, responsive, visual regression)
- Estimated effort per page

**Do NOT write code yet.**
Focus on understanding the architecture and planning the implementation.
Answer with detailed specifications for each page, clear diagrams, and structured prompts.

Start by acknowledging this spec completely.
Then output Phase 1 deliverable (file checklist + CSS variables).
```

***

This is a **complete, formal, AI-ready specification** that maps your entire project and defines the grid/layout system clearly. Your AI agent will now understand:

✅ How layouts are structured (public/auth/dashboard)
✅ How grids respond at each breakpoint
✅ Which pages exist and which are missing
✅ What data each page needs
✅ How components fit into the grid
✅ The order to implement pages
✅ Where to start (global setup first)

## Suggestion
### Modern Web3/Fintech Dashboard Layout & Grid Insights

The current XUPAY layout specification already incorporates several foundational elements for modern dashboards, such as responsive grid systems (e.g., 1-2-3-4 column layouts for KPIs), distinct layout types (Public/Auth/Dashboard), and a structured component hierarchy. This aligns well with best practices found in the search results, which emphasize clean layouts  and organizing content into clear sections .

**Grid Mapping & Layout Refinements:**

1.  **Prioritization & Visual Hierarchy:** The dashboard grid should reflect the importance of data . Ensure the most critical KPIs are prominently placed, often in the top-left quadrant, using larger grid cells or more prominent positions within the `lg:grid-cols-4` structure. Results suggest placing key insights at the top .
2.  **Consistent Spacing & Containers:** The use of consistent padding (`px-6 py-8`) and max-width containers (`max-w-7xl`) as defined in the spec is excellent for achieving a clean and professional look . Ensure this system is strictly followed across all pages.
3.  **Advanced Data Visualization Areas:** The spec defines a 2/3 - 1/3 split for the Wallet Detail page (`lg:col-span-2` / `lg:col-span-1`). This is ideal for placing detailed charts (like portfolio performance, transaction history) in the larger area, while using the sidebar for summary stats or quick actions. Modern dashboards often feature large, central chart areas .
4.  **Responsive Grid Flexibility:** The responsive grid definitions (1 column mobile, 2 tablet, 3 desktop for main content) are standard. Consider how complex components like tables or charts behave at the tablet breakpoint to ensure readability and usability. The dual view (table on desktop, cards on mobile) for transaction lists is a strong practice for responsive data presentation.

**Modern Design Effects & Enhancements:**

1.  **Sleek & Minimalist Aesthetic:** Embrace a minimalist approach . Use ample white space to define zones and improve scannability . Avoid cluttering the interface . This supports the "cleanliness" and "completeness" goals.
2.  **Smooth Transitions & Micro-Interactions:** Implement smooth transitions for state updates, such as when loading data or toggling filters . Subtle hover effects on cards and buttons enhance interactivity without being overwhelming.
3.  **Visual Consistency & Branding:** Ensure consistent use of color (especially for status indicators like success/green, warning/yellow, error/red), typography, and component styling across all pages. This reinforces the "completeness" and professionalism of the UI.
4.  **Data Visualization Clarity:** For financial and crypto data, clarity is paramount . Use appropriate chart types (line, bar, area) and ensure they are well-labeled. Some modern dashboards simplify complex data like crypto volatility using specific design choices .
5.  **Focus on Key Metrics (KPIs):** KPI cards should be visually distinct and easy to scan . Use concise labels, clear numerical formatting, and potentially directional indicators (up/down arrows) or sparkline charts within the card to show trends. The spec's `lg:grid-cols-4` for KPIs aligns with this.

**Borders, Grounding, and UI/UX Completeness:**

1.  **Subtle Borders and Depth:** The current spec uses `border border-gray-200` for cards. This is good for defining components. Consider using subtle shadows (`shadow-sm` or similar) sparingly to add depth and "ground" elements without adding visual weight. Ensure borders contribute to clarity rather than creating visual noise.
2.  **Clear Information Architecture:** The layout structure (Sidebar, Topbar, Main Content) is good for navigation and information hierarchy. Ensure the sidebar navigation labels are clear and logically grouped. Breadcrumbs (as mentioned in the spec for Wallet Detail) help with user orientation.
3.  **Feedback & Loading States:** Implement clear loading skeletons for KPIs and charts as data loads, as outlined in the spec. This prevents layout shifts  and provides a smoother user experience. Ensure error states for data fetching are also handled gracefully.
4.  **Accessibility:** While not explicitly a "design effect," ensuring the layout and components meet accessibility standards (sufficient color contrast, keyboard navigation) is crucial for UI/UX completeness and inclusivity.


