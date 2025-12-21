# 🚀 PHASE 1: FOUNDATION - COMPLETE SETUP

## Step 1: Create Next.js Project

```bash
npx create-next-app@latest xupay-frontend --typescript --tailwind --eslint --app  --no-git --src-dir --import-alias '@/*'
```

---

## Step 2: Install Dependencies

```bash
cd xupay-frontend

npm install framer-motion@11 @tanstack/react-query@5 zustand@4 sonner@1 lucide-react@0.344 react-confetti-explosion@2 @react-number-flow/core@1 clsx tailwind-merge class-variance-authority radix-ui

# Install shadcn/ui CLI
npm install -D shadcn-ui
```

---

## Step 3: Create File Structure

Create the following directories:

```
src/
├── app/
├── components/
├── hooks/
├── lib/
├── types/
├── styles/
└── config/

public/
```

---

## Step 4: File Contents

### `src/styles/globals.css` (DESIGN TOKENS)

```css
/* ============================================
   XuPay DESIGN TOKENS (CSS Variables)
   Source: frontend-design-spec-complete.md Section 1
   ============================================ */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* ============================================
   ROOT TOKENS (Light Mode Default)
   ============================================ */

:root {
  /* Primary Brand Colors */
  --color-primary: #2563EB;
  --color-primary-hover: #1D4ED8;
  --color-primary-active: #1E40AF;
  --color-primary-light: #DBEAFE;

  /* Semantic Status Colors */
  --color-success: #22C55E;
  --color-success-hover: #16A34A;
  --color-success-light: #DCFCE7;

  --color-danger: #EF4444;
  --color-danger-hover: #DC2626;
  --color-danger-light: #FEE2E2;

  --color-warning: #F59E0B;
  --color-warning-hover: #D97706;
  --color-warning-light: #FEF3C7;

  --color-info: #3B82F6;
  --color-info-light: #EFF6FF;

  /* Neutral/Grayscale */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F8FAFC;
  --color-bg-tertiary: #F1F5F9;

  --color-surface: #FFFFFF;
  --color-surface-hover: #F9FAFB;

  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-text-muted: #94A3B8;
  --color-text-inverse: #FFFFFF;

  --color-border-light: #E2E8F0;
  --color-border-default: #CBD5E1;
  --color-border-strong: #94A3B8;

  /* Sidebar & Navigation */
  --color-sidebar-bg: #0F172A;
  --color-sidebar-text: #E2E8F0;
  --color-sidebar-hover: #1E293B;
  --color-sidebar-active: #2563EB;

  /* Accessibility: RGB versions for opacity */
  --color-primary-rgb: 37, 99, 235;
  --color-success-rgb: 34, 197, 94;
  --color-danger-rgb: 239, 68, 68;
  --color-warning-rgb: 245, 158, 11;

  /* ============================================
     TYPOGRAPHY SCALE
     ============================================ */

  /* Font Family */
  --font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    'Oxygen', 'Ubuntu', 'Cantarell', 'Inter', sans-serif;
  --font-family-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono',
    monospace;

  /* Font Sizes */
  --font-size-xs: 0.75rem; /* 12px */
  --font-size-sm: 0.875rem; /* 14px */
  --font-size-base: 1rem; /* 16px */
  --font-size-lg: 1.125rem; /* 18px */
  --font-size-xl: 1.25rem; /* 20px */
  --font-size-2xl: 1.5rem; /* 24px */
  --font-size-3xl: 1.875rem; /* 30px */
  --font-size-4xl: 2.25rem; /* 36px */

  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  --line-height-loose: 2;

  /* Letter Spacing */
  --letter-spacing-tight: -0.01em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;

  /* ============================================
     SPACING SCALE (8px base unit)
     ============================================ */

  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
  --space-12: 3rem; /* 48px */
  --space-16: 4rem; /* 64px */

  /* Border Radius */
  --radius-sm: 0.375rem; /* 6px */
  --radius-base: 0.5rem; /* 8px */
  --radius-md: 0.75rem; /* 12px */
  --radius-lg: 1rem; /* 16px */
  --radius-full: 9999px; /* Fully rounded */

  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1),
    0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1),
    0 10px 10px rgba(0, 0, 0, 0.04);

  /* Transitions */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --easing-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --easing-ease-in: cubic-bezier(0.4, 0, 1, 1);
}

/* ============================================
   DARK MODE (Respects prefers-color-scheme)
   ============================================ */

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #0F172A;
    --color-bg-secondary: #1E293B;
    --color-bg-tertiary: #334155;

    --color-surface: #1E293B;
    --color-surface-hover: #334155;

    --color-text-primary: #F8FAFC;
    --color-text-secondary: #CBD5E1;
    --color-text-muted: #64748B;

    --color-border-light: #334155;
    --color-border-default: #475569;
    --color-border-strong: #64748B;

    --color-sidebar-bg: #020617;
    --color-sidebar-text: #CBD5E1;
    --color-sidebar-hover: #1E293B;
  }
}

/* ============================================
   MANUAL DARK MODE OVERRIDE (for theme toggle)
   ============================================ */

[data-theme='dark'] {
  --color-bg-primary: #0F172A;
  --color-bg-secondary: #1E293B;
  --color-bg-tertiary: #334155;

  --color-surface: #1E293B;
  --color-surface-hover: #334155;

  --color-text-primary: #F8FAFC;
  --color-text-secondary: #CBD5E1;
  --color-text-muted: #64748B;

  --color-border-light: #334155;
  --color-border-default: #475569;
  --color-border-strong: #64748B;

  --color-sidebar-bg: #020617;
  --color-sidebar-text: #CBD5E1;
  --color-sidebar-hover: #1E293B;
}

/* ============================================
   BASE STYLES
   ============================================ */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-family-sans);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  transition: background-color var(--duration-normal),
    color var(--duration-normal);
}

/* ============================================
   TYPOGRAPHY BASE
   ============================================ */

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
  letter-spacing: var(--letter-spacing-tight);
}

h1 {
  font-size: var(--font-size-4xl);
}
h2 {
  font-size: var(--font-size-3xl);
}
h3 {
  font-size: var(--font-size-2xl);
}
h4 {
  font-size: var(--font-size-xl);
}
h5 {
  font-size: var(--font-size-lg);
}
h6 {
  font-size: var(--font-size-base);
}

p {
  margin-bottom: var(--space-4);
}

small {
  font-size: var(--font-size-sm);
}

code,
pre {
  font-family: var(--font-family-mono);
  font-size: calc(var(--font-size-base) * 0.95);
}

/* ============================================
   LINKS
   ============================================ */

a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--duration-fast) var(--easing-standard);
}

a:hover {
  color: var(--color-primary-hover);
}

a:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* ============================================
   FOCUS VISIBLE (Accessibility)
   ============================================ */

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ============================================
   ANIMATIONS
   ============================================ */

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  animation: shimmer 2s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
}

@media (prefers-color-scheme: dark) {
  .skeleton {
    background: linear-gradient(
      90deg,
      #334155 25%,
      #475569 50%,
      #334155 75%
    );
  }
}

/* ============================================
   UTILITIES
   ============================================ */

.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  max-width: 1280px;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ============================================
   SCROLLBAR STYLING
   ============================================ */

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border-default);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-strong);
}

/* Firefox */
* {
  scrollbar-color: var(--color-border-default) var(--color-bg-secondary);
  scrollbar-width: thin;
}
```

---

### `tailwind.config.ts` (EXTEND TAILWIND WITH CSS VARS)

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-active': 'var(--color-primary-active)',
        'primary-light': 'var(--color-primary-light)',

        // Status
        success: 'var(--color-success)',
        'success-hover': 'var(--color-success-hover)',
        'success-light': 'var(--color-success-light)',

        danger: 'var(--color-danger)',
        'danger-hover': 'var(--color-danger-hover)',
        'danger-light': 'var(--color-danger-light)',

        warning: 'var(--color-warning)',
        'warning-hover': 'var(--color-warning-hover)',
        'warning-light': 'var(--color-warning-light)',

        info: 'var(--color-info)',
        'info-light': 'var(--color-info-light)',

        // Backgrounds
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-tertiary': 'var(--color-bg-tertiary)',

        // Surfaces
        surface: 'var(--color-surface)',
        'surface-hover': 'var(--color-surface-hover)',

        // Text
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'text-inverse': 'var(--color-text-inverse)',

        // Borders
        'border-light': 'var(--color-border-light)',
        'border-default': 'var(--color-border-default)',
        'border-strong': 'var(--color-border-strong)',

        // Sidebar
        'sidebar-bg': 'var(--color-sidebar-bg)',
        'sidebar-text': 'var(--color-sidebar-text)',
        'sidebar-hover': 'var(--color-sidebar-hover)',
        'sidebar-active': 'var(--color-sidebar-active)',
      },
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
      },
      fontFamily: {
        sans: 'var(--font-family-sans)',
        mono: 'var(--font-family-mono)',
      },
      fontWeight: {
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
      },
      lineHeight: {
        tight: 'var(--line-height-tight)',
        normal: 'var(--line-height-normal)',
        relaxed: 'var(--line-height-relaxed)',
        loose: 'var(--line-height-loose)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        base: 'var(--radius-base)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        standard: 'var(--easing-standard)',
        'ease-out': 'var(--easing-ease-out)',
        'ease-in': 'var(--easing-ease-in)',
      },
    },
  },
  plugins: [],
}
export default config
```

---

### `tsconfig.json` (STRICT MODE)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

### `src/lib/cn.ts` (CLASSNAME UTILITY)

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

### `src/types/index.ts` (CORE TYPES)

```typescript
/* ============================================
   CORE ENTITY TYPES
   ============================================ */

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  kycTier: 1 | 2 | 3
  status: 'active' | 'suspended' | 'pending'
  createdAt: Date
}

export interface Wallet {
  id: string
  userId: string
  name: string
  balance: number
  currency: 'USD' | 'EUR' | 'GBP'
  type: 'personal' | 'business'
  status: 'active' | 'frozen' | 'closed'
  createdAt: Date
}

export interface Transaction {
  id: string
  fromWalletId: string
  toWalletId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  transactionType: 'p2p' | 'deposit' | 'withdrawal' | 'internal'
  description?: string
  fraudScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  createdAt: Date
  updatedAt: Date
}

export interface SAR {
  id: string
  transactionId: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  reason: string
  status: 'open' | 'under_review' | 'resolved' | 'dismissed'
  createdAt: Date
  reviewedAt?: Date
}

/* ============================================
   API RESPONSE TYPES
   ============================================ */

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  meta?: {
    timestamp: string
    requestId: string
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  hasMore: boolean
}

/* ============================================
   COMPONENT PROPS TYPES
   ============================================ */

export interface KPICardProps {
  label: string
  value: string | number
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  icon?: React.ReactNode
  color?: 'primary' | 'success' | 'danger' | 'warning'
  isLoading?: boolean
}

export interface StatusBadgeProps {
  status: 'completed' | 'pending' | 'failed' | 'active' | 'inactive'
  variant?: 'solid' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}
```

---

## PHASE 1: COMPLETE ✅

You now have:

✅ Design tokens fully configured (colors, typography, spacing, shadows, animations)  
✅ Tailwind extended with CSS variables  
✅ TypeScript strict mode enabled  
✅ Dark mode support (system + toggle)  
✅ Core type definitions  
✅ Accessibility foundations (focus rings, reduced motion)  
✅ Utility functions (cn.ts for classname merging)  

---

## NEXT: PHASE 2

Ready for **Phase 2: Base Components (shadcn UI setup + custom wrappers)**

```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init -d

# Install core components
npx shadcn-ui@latest add button card input select badge label avatar dropdown-menu table
```

Then I'll generate:
- `Button.tsx` (with Framer Motion tap/hover effects)
- `Card.tsx` (with shadow hover)
- `KPICard.tsx` (custom with NumberFlow)
- `StatusBadge.tsx` (semantic colors)
- And all other atomic components
