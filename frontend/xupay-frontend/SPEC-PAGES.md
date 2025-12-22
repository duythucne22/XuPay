# SPEC: Pages & Layout Integration (XuPay)

> Purpose: document the current layout state, provide a traceable file tree and layout search results, and specify the implementation plan to standardize page interiors using a single `Container`, adopt a 12‑column grid, and provide tests, rollout steps, and PR guidance for engineers and automation agents.

---

## 🎯 Goals
- Centralize interior width/padding with a single `Container` component.
- Use a responsive 12‑column grid for page internals and right-rail patterns.
- Keep intentional full-bleed sections (hero/banner/footer) outside the `Container`.
- Add tests, screenshots, and docs so other engineers can continue the work safely.

---

## 🔎 Quick findings (summary)
- I found 84 occurrences of layout patterns that commonly cause full-bleed/vertical stacking (`w-full`, `w-screen`, `max-w-full`, `min-h-screen`, `px-0`) across pages and components using a grep search.
- The primary layout responsibilities are split between:
  - Root: `src/app/layout.tsx` (fonts, providers) and `src/app/globals.css` (imports)
  - Global tokens & resets: `src/styles/global.css` (CSS vars, resets, typography)
  - App layout: `src/app/(app)/layout.tsx` → delegates to `DashboardLayout`
  - Layout components: `src/components/layout/*` (Sidebar, DashboardLayout, AppShell, Topbar)
- Short cause: inconsistent use of a centered container — `AppShell` uses `max-w-7xl` inline, but `DashboardLayout` does not, causing many pages to render full-bleed.

---

## 🔎 Detailed file tree (layout & globals focus)
```
src/
├─ app/
│  ├─ layout.tsx                  # Root providers & font setup
│  ├─ globals.css                 # Imports src/styles/global.css (tokens + resets)
│  ├─ (app)/layout.tsx            # Delegates to DashboardLayout
│  ├─ (auth)/layout.tsx           # Auth pages layout
│  ├─ (app)/dashboard/page.tsx    # Dashboard page (uses StaggerContainer / wide cards)
│  ├─ (app)/transactions/page.tsx # Transactions list (panels + drawers)
│  └─ (app)/...                   # wallets, profile, settings, compliance pages
├─ components/
│  ├─ layout/
│  │  ├─ DashboardLayout.tsx      # Sidebar + header + main (primary change target)
│  │  ├─ AppShell.tsx             # Alternative shell (already uses max-w-7xl inline)
│  │  ├─ Sidebar.tsx
│  │  ├─ Topbar.tsx
│  │  ├─ MobileSidebar.tsx
│  │  ├─ AuthContainer.tsx
│  │  └─ ...
│  ├─ dashboard/                   # StatsGrid, WalletGrid, History components (w-full cards)
│  ├─ home/                        # HeroSection (intentional full-bleed), Navbar, Footer
│  └─ ui/                          # input, table, dialog components
├─ styles/
│  ├─ global.css                   # Design tokens, resets, typography (large file)
│  ├─ variables.css
│  └─ animations.css
└─ tailwind.config.ts              # Theme settings (colors, font sizes, spacing)
```

---

## 🔍 Layout search summary (what I ran & key hits)
- Command examples you can run locally:
  - ripgrep (recommended):
    ```bash
    rg "w-full|w-screen|max-w-full|min-h-screen|px-0" src || true
    ```
  - PowerShell alternative:
    ```powershell
    Get-ChildItem -Recurse -Include *.tsx,*.css | Select-String -Pattern 'w-full|w-screen|max-w-full|min-h-screen|px-0' | Format-Table Path, LineNumber, Line -AutoSize
    ```

- Summary results (representative hits):
  - `src/app/page.tsx` — `min-h-screen bg-[#0a0a0a] flex items-center justify-center` (full viewport hero) 
  - `src/components/home/HeroSection.tsx` — `w-full h-full relative` (intentional full-bleed hero)
  - `src/components/layout/AuthContainer.tsx` — `w-full max-w-md` (auth form container)
  - `src/components/layout/AppShell.tsx` — `div.max-w-7xl.mx-auto` (already centered; should use `Container`)
  - `src/components/layout/DashboardLayout.tsx` — `p-4 md:p-8` wrapper with no max width → full-bleed content
  - `src/app/(app)/transactions/page.tsx` — multiple `w-full` panels and a right-drawer `w-full max-w-md` (drawers are fine)
  - `src/components/dashboard/*` — many `StaggerContainer className="w-full"` usages

- High-impact files with multiple matches: `dashboard` page, `transactions` page, `Wallet*` components, `Profile` page, `Settings` page, `Home` components, and many `ui` primitives.

---

## ✉️ Global files analysis (what they control)
- `src/styles/global.css` (BASE) — defines tokens (colors, spacing, font sizes), resets (`* { margin:0; padding:0 }`), typography scales and base `body` styles.
  - Impact: controls look & feel (font sizes, color tokens), and base reset ensures spacing is handled by layout components rather than the browser.
  - Action: keep tokens, but avoid adding global padding/margins which would force full-bleed layouts.

- `src/app/globals.css` (Tailwind integration) — includes Tailwind `@tailwind base; components; utilities;` and maps theme variables for shadcn.
  - Impact: adds class utilities and variables used by components. Changing it can affect many components.
  - Action: do not add page-level layout rules here; use `Container` instead.

- `tailwind.config.ts` — extends colors, spacing, font sizes, and theme-based variables. No container override currently.
  - Action: Optionally add `container: { center: true, padding: '1.5rem', screens: { lg: '1120px' } }` if you prefer to use Tailwind `container` utility instead of a `Container` component.

---

## 📄 Per-file Trace & Implementation Notes
This section provides per-file observations, the specific classes that cause full-bleed, and exact edits to make so automation or engineers can apply changes reliably.

### 1) `src/app/(app)/dashboard/page.tsx` (Dashboard page)
- Top-level wrapper: `<div className="space-y-8">` — no max-width container here → content will be full width inside the layout.
- Key components used: `StatsGrid`, `BalanceCard`, `RecentTransactions`, `WalletSelector`, `QuickActions` (many internal `w-full` cards).
- Full-bleed candidates: `space-y-8` top wrapper, `StaggerContainer className="w-full"`, `grid grid-cols-1 lg:grid-cols-3 gap-8` (these grids are fine inside a Container but require Container to prevent full-bleed).
- Suggested change:
  - Wrap the top-level `div.space-y-8` inside `Container` in `DashboardLayout` (no file-level change required here if DashboardLayout supplies Container). If doing file-only: replace
```tsx
<div className="space-y-8">
  ...
</div>
```
with
```tsx
<Container>
  <div className="space-y-8">...</div>
</Container>
```
  - Keep `StaggerContainer className="w-full"` intact (component children should keep `w-full`).

### 2) `src/app/(app)/transactions/page.tsx`
- Top-level wrapper: `<div className="space-y-8">` — table and cards inside are full-bleed unless wrapped.
- Key components: `TransactionSummary`, `StaggerContainer` wrappers, table rows use `grid grid-cols-12` internally (good grid semantics).
- Full-bleed candidates: `w-full` on `StaggerContainer`, top-level `space-y-8` — requires Container to center the page and prevent a full-bleed feel.
- Suggested change: ensure page content sits inside Container (via DashboardLayout). No change to internal grid classes.

### 3) `src/app/(app)/wallets/page.tsx`
- Top-level wrapper: `<div className="space-y-8">` and UI sections with `bg-white rounded-lg border p-6` — these should be centered with Container.
- Key components: `WalletSummaryStats`, `WalletGrid`, `WalletDetailDrawer` (drawers are full-bleed by design: `fixed right-0 top-0 h-full w-full max-w-md` — keep as-is).
- Suggestion: wrap page in Container for centering; keep drawer classes unchanged.

### 4) `src/app/(app)/profile/page.tsx` and `settings/page.tsx`
- Both use `className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4"` and an inner `max-w-4xl mx-auto` — they already use a narrower centered width (`max-w-4xl`) which is fine.
- Action: leave `max-w-4xl` patterns in place (these are intentional narrower content areas inside Container). If Container wraps them too, it's OK — `max-w-*` will constrain further.

### 5) `src/app/(app)/compliance/sars/page.tsx`
- Page uses forms and lists; follow same Container/wrapper rules. Keep internal components like `StaggerContainer` unchanged.

### 6) `src/components/layout/DashboardLayout.tsx`
- Current structure:
```tsx
<div className="min-h-screen bg-white dark:bg-[#0f172a]">
  <aside className="fixed left-0 top-0 h-screen w-64 ..." />
  <div className="flex flex-col lg:ml-64">
    <DashboardHeader />
    <main className="flex-1 overflow-auto">
      <div className="p-4 md:p-8">{children}</div>
    </main>
  </div>
</div>
```
- Issues: `div.p-4` has no max-width; children are full-bleed.
- Exact change: replace ` <div className="p-4 md:p-8">{children}</div>` with:
```tsx
<Container>
  <div className="grid grid-cols-12 gap-6">
    <div className="col-span-12 lg:col-span-8">{children}</div>
    <aside className="hidden lg:block lg:col-span-4">{/* optional right rail */}</aside>
  </div>
</Container>
```
- Also ensure `lg:ml-64` stays (it offsets main for the fixed sidebar) while Container centers the interior.

### 7) `src/components/layout/AppShell.tsx`
- Current code uses an inline `div.max-w-7xl.mx-auto` inside `main`.
- Exact change: replace inline div with `<Container>{children}</Container>` (import the Container component).

### 8) `src/components/layout/Sidebar.tsx` & `Topbar.tsx`
- Sidebar is `fixed`/`w-64` and provides navigation; Topbar is `h-16 px-4 lg:px-6` — both are layout primitives and should NOT be given max-widths. Keep them as-is.
- Note: Topbar contains `div.hidden md:flex flex-1 max-w-md mx-8` for centered search; fine to keep.

### 9) `src/components/*` (dashboard widgets, StaggerContainer, StatCard, RecentTransactions)
- Many use `w-full` for card width and are intended to be full width of their column. After Container + grid, these will correctly fill the column width.

---

## ✏️ Implementation spec (concise)
(See earlier shorter spec — same rules apply.)
- Add `Container` component at `src/components/layout/Container.tsx`.
- Replace `DashboardLayout` inner wrapper with `Container` + `grid grid-cols-12 gap-6` (exact snippet above).
- Replace `div.max-w-7xl.mx-auto` literal in `AppShell` with `<Container>`.
- For each page, move interior content inside `Container` (or rely on DashboardLayout's Container) and convert internal page layouts to `col-span` patterns where needed.

---

## 🧩 UI primitives & helpful hooks (short)
These are the small, commonly used building blocks and hooks that affect page composition. Keep them flexible (`w-full` inside columns) and avoid moving layout responsibilities into them.

- `src/components/ui/input.tsx` — Styled input primitive; class defaults include `w-full` and focus/disabled states. Used in Topbar and forms.
- `src/components/ui/button.tsx` — Button variants (ghost, default) and sizes; used throughout the app for consistent actions.
- `src/components/ui/table.tsx` — Responsive table wrapper with `overflow-x-auto`. Used by the transactions table. Ensure tables are inside Container to prevent full-bleed.
- `src/components/ui/dialog.tsx` — Modal component with fixed centering and `max-w-[calc(100%-2rem)]` to avoid overflow; fine for receipts/details.
- `src/components/common/PaginationControls.tsx` — Pagination UI used on lists like Transactions and Wallets.
- `src/components/animations/StaggerContainer.tsx`, `PageTransition.tsx` — Animations wrappers; commonly used with `className="w-full"` on children.
- Key hooks:
  - `src/hooks/useMediaQuery.ts` — helper for responsive logic and predefined breakpoints (`sm`, `md`, `lg`, `xl`). Use it to switch layout patterns (e.g., hide right-rail on mobile).
  - `src/hooks/useDebounce.ts` — debounce utility used in search/filter UIs.
  - `src/hooks/useDisclosure.ts` — drawer/dialog open/close hook used by drawers like `WalletDetailDrawer`.
- Providers (top-level): `ThemeProvider`, `ReactQueryProvider`, `AuthProvider`, `ToastProvider` — they affect runtime state and redirect/login flows; do not move layout responsibilities into providers.

---

## 🛠 Quick sample code
- Container:
```tsx
export function Container({ children, className = '' }) {
  return (
    <div className={`max-w-7xl mx-auto px-6 lg:px-8 ${className}`} data-testid="app-container">
      {children}
    </div>
  )
}
```

- DashboardLayout main snippet:
```tsx
<main className="flex-1 overflow-auto">
  <Container>
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8">{children}</div>
      <aside className="hidden lg:block lg:col-span-4">{/* right rail */}</aside>
    </div>
  </Container>
</main>
```

---

## 🧪 Tests, QA and rollout (same as previous)
- Unit test: assert `data-testid="app-container"` in migrated layouts.
- Visual: capture before/after screenshots.
- Accessibility checks with axe/lighthouse.
- Rollout incrementally — Container → DashboardLayout → one page → remaining pages.

---

## ✅ Acceptance criteria
- Primary pages centered within `max-w-7xl` at desktop widths.
- Grid shows main content + right rail at `lg` breakpoints.
- No horizontal scrollbars appear.
- Tests and visual checks pass.

---

## 🧾 Next actions I can take for you
- Implement `Container`, update `DashboardLayout` and `AppShell`, add unit test(s), and present diffs & screenshots.
- Or generate a per-page migration PR plan (detailed edits for each page) if you prefer to split the work.

Tell me which you prefer and I'll proceed. 