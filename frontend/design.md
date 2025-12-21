#
## Tree
```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                          # Root layout with providers
│   │   ├── page.tsx                            # Redirect to /app/dashboard
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   └── (app)/
│   │       ├── layout.tsx                      # AppShell wrapper (Sidebar + Topbar)
│   │       ├── dashboard/
│   │       │   ├── page.tsx                    # Main dashboard page
│   │       │   ├── _components/
│   │       │   │   ├── DashboardHeader.tsx
│   │       │   │   ├── DashboardStats.tsx      # KPI grid container
│   │       │   │   ├── DashboardCharts.tsx     # Chart section
│   │       │   │   ├── RecentActivity.tsx      # Transactions + Alerts
│   │       │   │   └── SkeletonDashboard.tsx   # Loading skeleton
│   │       ├── transactions/
│   │       │   ├── page.tsx                    # ListingLayout archetype
│   │       │   ├── [id]/
│   │       │   │   ├── page.tsx                # DetailLayout archetype
│   │       │   │   └── _components/
│   │       │   │       ├── TransactionDetail.tsx
│   │       │   │       ├── LedgerTable.tsx
│   │       │   │       └── ActivityTimeline.tsx
│   │       │   └── _components/
│   │       │       ├── TransactionsTable.tsx
│   │       │       └── TransactionsFilters.tsx
│   │       ├── wallets/
│   │       │   ├── page.tsx
│   │       │   ├── [id]/page.tsx
│   │       │   └── _components/
│   │       │       ├── WalletCard.tsx
│   │       │       └── WalletForm.tsx
│   │       ├── compliance/
│   │       │   ├── sars/page.tsx
│   │       │   ├── fraud-alerts/page.tsx
│   │       │   └── _components/
│   │       │       ├── SARTable.tsx
│   │       │       └── FraudAlertsList.tsx
│   │       ├── settings/
│   │       │   ├── profile/page.tsx
│   │       │   ├── security/page.tsx
│   │       │   └── _components/
│   │       │       ├── ProfileForm.tsx
│   │       │       └── SecuritySettings.tsx
│   │       └── transfers/
│   │           ├── page.tsx
│   │           ├── new/page.tsx
│   │           └── _components/
│   │               └── TransferForm.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx                    # Main layout wrapper
│   │   │   ├── Sidebar.tsx                     # Navigation sidebar (collapsible)
│   │   │   ├── Topbar.tsx                      # Top header bar
│   │   │   ├── NavLink.tsx                     # Individual nav item
│   │   │   ├── NavGroup.tsx                    # Nav section grouping
│   │   │   └── UserMenu.tsx                    # User dropdown
│   │   │
│   │   ├── layout-archetypes/
│   │   │   ├── DashboardLayout.tsx             # Template for dashboard pages
│   │   │   ├── ListingPageLayout.tsx           # Template for list pages
│   │   │   └── DetailPageLayout.tsx            # Template for detail pages
│   │   │
│   │   ├── common/
│   │   │   ├── KPICard.tsx                     # Custom KPI card with NumberFlow
│   │   │   ├── StatusBadge.tsx                 # Status indicator badge
│   │   │   ├── EmptyState.tsx                  # Empty state with icon + CTA
│   │   │   ├── PageHeader.tsx                  # Page title + description
│   │   │   ├── DetailField.tsx                 # Key-value display
│   │   │   ├── MetadataField.tsx               # Metadata card field
│   │   │   ├── AlertItem.tsx                   # Single alert notification
│   │   │   ├── Timeline.tsx                    # Activity timeline
│   │   │   ├── LoadingSpinner.tsx              # Centered loading indicator
│   │   │   └── ThemeToggle.tsx                 # Sun/Moon theme switcher
│   │   │
│   │   ├── forms/
│   │   │   ├── FormField.tsx                   # Wrapper: label + input + error
│   │   │   ├── TransferFormFields.tsx          # Transfer form with live validation
│   │   │   └── ValidationMessage.tsx           # Error/success message component
│   │   │
│   │   ├── tables/
│   │   │   ├── TransactionsTable.tsx           # Transactions listing with rows
│   │   │   ├── SARTable.tsx                    # SAR listing
│   │   │   ├── TableRow.tsx                    # Interactive row with click handler
│   │   │   └── TablePagination.tsx             # Pagination controls
│   │   │
│   │   ├── ui/
│   │   │   ├── button.tsx                      # shadcn Button wrapper + custom variants
│   │   │   ├── card.tsx                        # shadcn Card (shadcn default)
│   │   │   ├── input.tsx                       # shadcn Input (shadcn default)
│   │   │   ├── select.tsx                      # shadcn Select (shadcn default)
│   │   │   ├── table.tsx                       # shadcn Table (shadcn default)
│   │   │   ├── avatar.tsx                      # shadcn Avatar (shadcn default)
│   │   │   ├── dropdown-menu.tsx               # shadcn DropdownMenu (shadcn default)
│   │   │   ├── skeleton.tsx                    # shadcn Skeleton (shadcn default)
│   │   │   ├── badge.tsx                       # shadcn Badge with custom variants
│   │   │   ├── label.tsx                       # shadcn Label (shadcn default)
│   │   │   └── dialog.tsx                      # shadcn Dialog (shadcn default)
│   │   │
│   │   ├── animations/
│   │   │   ├── PageTransition.tsx              # Fade + slide entrance
│   │   │   ├── StaggeredContainer.tsx          # Stagger children animation
│   │   │   ├── SkeletonLoader.tsx              # Shimmer animation
│   │   │   ├── SuccessAnimation.tsx            # Confetti + checkmark bounce
│   │   │   ├── NumberCounter.tsx               # NumberFlow wrapper
│   │   │   └── MotionConfig.tsx                # Respect prefers-reduced-motion
│   │   │
│   │   └── providers/
│   │       ├── ReactQueryProvider.tsx          # TanStack Query wrapper
│   │       ├── ThemeProvider.tsx               # Dark mode + theme toggle state
│   │       └── ToastProvider.tsx               # Sonner toast container
│   │
│   ├── hooks/
│   │   ├── useDashboardData.ts                 # Mock dashboard data with 1.5s delay
│   │   ├── useTransactions.ts                  # Fetch transactions
│   │   ├── useWallets.ts                       # Fetch wallets
│   │   ├── useTheme.ts                         # Theme state management
│   │   ├── useSidebar.ts                       # Sidebar collapsed state
│   │   ├── useMediaQuery.ts                    # Responsive breakpoint detection
│   │   ├── useReducedMotion.ts                 # Accessibility: motion preference
│   │   └── useToast.ts                         # Toast notification trigger
│   │
│   ├── lib/
│   │   ├── utils.ts                            # clsx + tailwind-merge utility
│   │   ├── cn.ts                               # Tailwind classname merge (alias)
│   │   ├── constants.ts                        # App-wide constants (colors, breakpoints)
│   │   ├── api.ts                              # Axios instance + base URL
│   │   ├── mock-data.ts                        # Mock data for development
│   │   └── validators.ts                       # Form validation rules
│   │
│   ├── types/
│   │   ├── api.ts                              # API response types
│   │   ├── entities.ts                         # Core entities: User, Transaction, Wallet
│   │   ├── forms.ts                            # Form input types
│   │   └── ui.ts                               # UI component prop types
│   │
│   ├── styles/
│   │   ├── globals.css                         # Design tokens (CSS variables) + base styles
│   │   ├── animations.css                      # Keyframe animations (shimmer, etc.)
│   │   └── typography.css                      # Font imports + typography utilities
│   │
│   └── config/
│       ├── site.ts                             # Site metadata + navigation structure
│       ├── navigation.ts                       # Sidebar nav items + routes
│       └── theme.ts                            # Theme configuration (dark mode, colors)
│
├── public/
│   ├── logo.svg
│   ├── favicon.ico
│   └── images/
│       ├── empty-state-wallet.svg
│       ├── empty-state-transactions.svg
│       └── logo-dark.svg
│
├── .env.example                                 # Environment variables template
├── .env.local                                   # Local environment (git-ignored)
├── tailwind.config.ts                           # Tailwind theme config (maps CSS vars)
├── tsconfig.json                                # TypeScript strict mode
├── next.config.js                               # Next.js configuration
├── package.json                                 # Dependencies list
├── README.md                                    # Project documentation
└── DESIGN_SPEC.md                               # Reference to frontend-design-spec-complete.md

```

## 📊 FILE COUNT & PHASE BREAKDOWN

| Phase | Category | Files | Notes |
|-------|----------|-------|-------|
| **Phase 1: Foundation** | Config + Styles | 6 files | `globals.css`, `tailwind.config.ts`, `tsconfig.json`, design tokens setup |
| **Phase 2: Base Components** | UI Library | 12 files | shadcn wrappers + base components (button, card, input, etc.) |
| **Phase 3: Common Components** | Atomic Components | 15 files | KPICard, StatusBadge, EmptyState, Timeline, etc. |
| **Phase 4: Layout System** | Layout Components | 8 files | AppShell, Sidebar, Topbar, Nav groups, layout archetypes |
| **Phase 5: Animations** | Motion Layer | 6 files | Page transitions, stagger, skeleton, confetti, NumberFlow |
| **Phase 6: Hooks & Utilities** | Logic Layer | 10 files | React Query hooks, theme state, form validators |
| **Phase 7: Pages & Features** | Page Components | 18 files | Dashboard, Transactions, Wallets, Settings, Transfers |
| **Total** | | **~93 files** | Production-ready core infrastructure |

***

## 🎯 KEY ARCHITECTURAL DECISIONS

1. **Design Tokens → Tailwind Config:** Every token in `frontend-design-spec.md` Section 1 mapped as CSS variables, then consumed by Tailwind.

2. **Component Hierarchy:**
   - **UI Layer:** shadcn primitives (Button, Card, etc.)
   - **Atomic Layer:** Custom variants (KPICard, StatusBadge)
   - **Layout Layer:** AppShell, Sidebar, page templates
   - **Page Layer:** Feature-specific pages

3. **State Management:**
   - **Server State:** React Query (useDashboardData, useTransactions)
   - **UI State:** Zustand (sidebar toggle, theme)
   - **Form State:** React Hook Form (transfer form validation)

4. **Animations:**
   - **Framer Motion v11** for micro-interactions (hover, click, entrance)
   - **NumberFlow** for animated counters
   - **react-confetti-explosion** for success celebrations
   - **Skeleton loaders** with CSS shimmer effect

5. **Responsiveness:**
   - **Mobile-first:** Start with `xs`, extend to `lg`
   - **Sidebar:** Drawer on mobile, collapsible rail on desktop
   - **Grid:** 1-col mobile → 4-col desktop (for KPI cards)

6. **Accessibility:**
   - WCAG AA compliance (4.5:1 contrast, `aria-label`, semantic HTML)
   - `prefers-reduced-motion` respected in all animations
   - Keyboard navigation on all interactive elements

***

## ✅ VERIFICATION CHECKLIST

- [x] **Design Spec Alignment:** Every component references Section 1-7 of `frontend-design-spec-complete.md`
- [x] **Tech Stack:** Next.js 14 + TypeScript + Tailwind + shadcn + Framer Motion + React Query
- [x] **No Deviations:** No arbitrary dependencies or custom CSS frameworks
- [x] **Type Safety:** All interfaces defined in `types/`
- [x] **Scalability:** Structure supports adding new pages/features without refactoring
- [x] **Dark Mode:** Built-in via CSS variables + Zustand theme state
- [x] **Loading States:** Skeleton components for all async data
- [x] **Error Handling:** Empty states + form validation feedback


