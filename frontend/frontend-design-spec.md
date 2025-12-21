# XuPay Frontend Design Specification

## Complete Design System & Implementation Guide

**Last Updated:** December 17, 2025  
**Status:** PRODUCTION-READY DESIGN SPEC  
**Purpose:** Single source of truth for all frontend development

---

## 📋 SECTION 1: DESIGN TOKENS (CSS Variables)

### Color Tokens

```css
:root {
  /* Primary Brand Colors */
  --color-primary: #2563EB;           /* Blue-600 */
  --color-primary-hover: #1D4ED8;     /* Blue-700 */
  --color-primary-active: #1E40AF;    /* Blue-800 */
  --color-primary-light: #DBEAFE;     /* Blue-100 */
  
  /* Semantic Status Colors */
  --color-success: #22C55E;           /* Green-500 */
  --color-success-hover: #16A34A;     /* Green-600 */
  --color-success-light: #DCFCE7;     /* Green-100 */
  
  --color-danger: #EF4444;            /* Red-500 */
  --color-danger-hover: #DC2626;      /* Red-600 */
  --color-danger-light: #FEE2E2;      /* Red-100 */
  
  --color-warning: #F59E0B;           /* Amber-500 */
  --color-warning-hover: #D97706;     /* Amber-600 */
  --color-warning-light: #FEF3C7;     /* Amber-100 */
  
  --color-info: #3B82F6;              /* Blue-500 */
  --color-info-light: #EFF6FF;        /* Blue-50 */
  
  /* Neutral/Grayscale */
  --color-bg-primary: #FFFFFF;        /* Page background */
  --color-bg-secondary: #F8FAFC;      /* Subtle background */
  --color-bg-tertiary: #F1F5F9;       /* Card/section background */
  
  --color-surface: #FFFFFF;           /* Surfaces (cards, modals) */
  --color-surface-hover: #F9FAFB;     /* Surface hover state */
  
  --color-text-primary: #0F172A;      /* Main text */
  --color-text-secondary: #475569;    /* Secondary text */
  --color-text-muted: #94A3B8;        /* Disabled/placeholder text */
  --color-text-inverse: #FFFFFF;      /* Text on dark backgrounds */
  
  --color-border-light: #E2E8F0;      /* Subtle borders */
  --color-border-default: #CBD5E1;    /* Default borders */
  --color-border-strong: #94A3B8;     /* Strong borders */
  
  /* Sidebar & Navigation */
  --color-sidebar-bg: #0F172A;        /* Sidebar background */
  --color-sidebar-text: #E2E8F0;      /* Sidebar text */
  --color-sidebar-hover: #1E293B;     /* Sidebar hover */
  --color-sidebar-active: #2563EB;    /* Sidebar active item */
  
  /* Accessibility: RGB versions for opacity */
  --color-primary-rgb: 37, 99, 235;
  --color-success-rgb: 34, 197, 94;
  --color-danger-rgb: 239, 68, 68;
  --color-warning-rgb: 245, 158, 11;
}

/* Dark Mode */
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

/* Manual dark mode override (for theme toggle) */
[data-theme="dark"] {
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
```

---

### Typography Scale

```css
:root {
  /* Font Family */
  --font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  --font-family-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', monospace;
  
  /* Font Sizes */
  --font-size-xs: 0.75rem;      /* 12px */
  --font-size-sm: 0.875rem;     /* 14px */
  --font-size-base: 1rem;       /* 16px */
  --font-size-lg: 1.125rem;     /* 18px */
  --font-size-xl: 1.25rem;      /* 20px */
  --font-size-2xl: 1.5rem;      /* 24px */
  --font-size-3xl: 1.875rem;    /* 30px */
  --font-size-4xl: 2.25rem;     /* 36px */
  
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
}
```

**Typography Usage:**

| Context | Size | Weight | Line Height | Example |
|---------|------|--------|-------------|---------|
| Page title | 2xl (24px) | semibold | 1.5 | "Dashboard", "Transactions" |
| Section heading | xl (20px) | semibold | 1.5 | "Key Metrics", "Recent Activity" |
| Card title | lg (18px) | semibold | 1.5 | Card headers |
| Body text | base (16px) | normal | 1.5 | Description text |
| Small text | sm (14px) | normal | 1.5 | Secondary info, labels |
| Tiny text | xs (12px) | normal | 1.5 | Timestamps, meta info |
| Mono (numbers) | base | semibold | 1.5 | Balance: "$1,234.56" |

---

### Spacing Scale

```css
:root {
  /* Spacing (8px base unit) */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  
  /* Border Radius */
  --radius-sm: 0.375rem;    /* 6px */
  --radius-base: 0.5rem;    /* 8px */
  --radius-md: 0.75rem;     /* 12px */
  --radius-lg: 1rem;        /* 16px */
  --radius-full: 9999px;    /* Fully rounded (pills/avatars) */
  
  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
  
  /* Transitions */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --easing-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --easing-ease-in: cubic-bezier(0.4, 0, 1, 1);
}
```

---

## 🎨 SECTION 2: COMPONENT LIBRARY

### Component Structure

All components use **shadcn/ui** as base, extended with custom variants:

#### Card Component

```tsx
<Card>
  <CardHeader>
    <CardTitle>Total Balance</CardTitle>
    <CardDescription>Across all wallets</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content goes here */}
  </CardContent>
  <CardFooter>
    {/* Optional footer */}
  </CardFooter>
</Card>
```

**Styling:**
- Background: `var(--color-surface)`
- Border: `1px solid var(--color-border-light)`
- Padding: `var(--space-4)` (16px)
- Border radius: `var(--radius-md)` (12px)
- Shadow: `var(--shadow-sm)`
- Hover: shadow increases to `var(--shadow-md)` (200ms transition)

#### KPI Card (Custom Component)

```tsx
interface KPICardProps {
  label: string;
  value: string | number;
  trend?: { value: number; direction: 'up' | 'down' };
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'danger' | 'warning';
}

export function KPICard({ label, value, trend, icon, color = 'primary' }: KPICardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        {icon && <span className="text-2xl">{icon}</span>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs mt-2 ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}% vs last 7d
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

#### Button Component

**Variants:**

| Variant | Use Case | Styling |
|---------|----------|---------|
| `primary` | Main CTAs (Send, Approve) | `bg-primary text-white hover:bg-primary-hover` |
| `secondary` | Secondary actions | `bg-gray-100 text-gray-900 hover:bg-gray-200` |
| `outline` | Tertiary actions | `border border-border-default hover:bg-gray-50` |
| `ghost` | Minimal actions (Close, Cancel) | `hover:bg-gray-100` |
| `danger` | Destructive (Delete, Reject) | `bg-danger text-white hover:bg-danger-hover` |

**Interactions:**
- Hover: +2px translateY (lift effect), shadow increase
- Click: -1px translateY (press effect), scale 0.98
- Disabled: opacity 0.5, cursor not-allowed
- Loading: spinner appears, text becomes "Loading..."

#### Form Components

**Input Field:**
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    placeholder="you@example.com"
    onBlur={handleValidation}
  />
  {error && (
    <p className="text-xs text-danger flex items-center gap-1">
      <AlertCircle className="w-4 h-4" />
      {error}
    </p>
  )}
  <p className="text-xs text-muted-foreground">Must be a valid email</p>
</div>
```

**Styling:**
- Border: `1px solid var(--color-border-default)`
- Focus: `border-primary ring-2 ring-primary/20` (no outline)
- Error: `border-danger ring-2 ring-danger/20`
- Disabled: `bg-gray-50 opacity-50 cursor-not-allowed`

#### Select Component

```tsx
<Select value={selectedWallet} onValueChange={setSelectedWallet}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Choose wallet" />
  </SelectTrigger>
  <SelectContent>
    {wallets.map(wallet => (
      <SelectItem key={wallet.id} value={wallet.id}>
        {wallet.name} ({wallet.balance})
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

#### Badge Component

```tsx
/* Status badges */
<Badge variant="success">Completed</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Failed</Badge>

/* KYC tier badges */
<Badge className="bg-blue-100 text-blue-900">Tier 2</Badge>

/* Pill-shaped badges */
<Badge variant="outline" className="rounded-full">Active</Badge>
```

---

## 📐 SECTION 3: LAYOUT COMPONENTS

### AppShell Layout

**Structure:**

```tsx
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-bg-primary">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <Topbar />
        
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-auto bg-bg-primary">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

**Sidebar Component:**

```tsx
export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <aside
      className={`
        fixed lg:relative
        h-screen
        bg-sidebar-bg
        transition-all duration-300
        ${isCollapsed ? 'w-20' : 'w-64'}
        z-50
        flex flex-col
        border-r border-border-light
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-border-light">
        {!isCollapsed && <h1 className="text-xl font-bold text-white">XuPay</h1>}
        <button onClick={() => setIsCollapsed(!isCollapsed)}>
          <Menu className="w-5 h-5 text-sidebar-text" />
        </button>
      </div>
      
      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-6">
        {/* Money Section */}
        <NavGroup label={isCollapsed ? "" : "Money"} items={moneyItems} />
        
        {/* Risk & Compliance Section */}
        <NavGroup label={isCollapsed ? "" : "Risk & Compliance"} items={complianceItems} />
        
        {/* System Section */}
        <NavGroup label={isCollapsed ? "" : "System"} items={systemItems} />
      </nav>
      
      {/* User Menu (Bottom) */}
      <div className="p-4 border-t border-border-light">
        <UserMenu />
      </div>
    </aside>
  );
}

interface NavGroupProps {
  label: string;
  items: NavItem[];
}

function NavGroup({ label, items }: NavGroupProps) {
  return (
    <div className="px-4">
      {label && (
        <h3 className="text-xs font-semibold text-sidebar-text/60 mb-3 uppercase tracking-wide">
          {label}
        </h3>
      )}
      <div className="space-y-2">
        {items.map(item => (
          <NavLink key={item.href} {...item} />
        ))}
      </div>
    </div>
  );
}

function NavLink({ icon, label, href, isActive }: NavItem) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-md
        transition-all duration-200
        relative
        ${isActive 
          ? 'bg-sidebar-active text-white' 
          : 'text-sidebar-text hover:bg-sidebar-hover'
        }
      `}
    >
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r"
          transition={{ duration: 0.2 }}
        />
      )}
      
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium hidden lg:inline">{label}</span>
    </Link>
  );
}
```

**Topbar Component:**

```tsx
export function Topbar() {
  return (
    <header className="h-16 border-b border-border-light bg-surface flex items-center justify-between px-6">
      {/* Left: Page Title & Breadcrumb */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-text-primary">
          {getCurrentPageTitle()}
        </h1>
      </div>
      
      {/* Right: Controls */}
      <div className="flex items-center gap-6">
        {/* Environment Badge */}
        <Badge variant="outline" className="text-xs">
          🔵 Sandbox
        </Badge>
        
        {/* KYC Tier Badge */}
        <Badge className="bg-blue-100 text-blue-900 text-xs">
          KYC Tier {userKYCTier}
        </Badge>
        
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-md transition-colors">
          <Bell className="w-5 h-5 text-text-secondary" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full animate-pulse" />
          )}
        </button>
        
        {/* Theme Toggle */}
        <button onClick={toggleTheme}>
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
              <Avatar className="w-8 h-8">
                <AvatarImage src={userAvatar} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem href="/app/settings/profile">Profile</DropdownMenuItem>
            <DropdownMenuItem href="/app/settings/security">Security</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
```

---

### Page Layout Archetypes

#### 1. DashboardLayout (Operational Summary)

```tsx
export function DashboardLayout() {
  return (
    <div className="space-y-6">
      {/* Section 1: KPI Cards */}
      <section aria-label="Key metrics">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard 
            label="Total Balance" 
            value="$10,250.00" 
            trend={{ value: 12, direction: 'up' }}
            icon="💰"
          />
          <KPICard 
            label="Today's Sent" 
            value="$850.00" 
            trend={{ value: 5, direction: 'down' }}
            icon="📤"
          />
          <KPICard 
            label="Today's Received" 
            value="$3,200.00" 
            trend={{ value: 18, direction: 'up' }}
            icon="📥"
          />
          <KPICard 
            label="Open SARs" 
            value="2" 
            trend={undefined}
            icon="⚠️"
            color="warning"
          />
        </div>
      </section>
      
      {/* Section 2: Analytics */}
      <section aria-label="Analytics">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main chart (2 columns) */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Volume Trend (30 days)</CardTitle>
              <CardDescription>Daily transaction volume</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <AreaChart data={volumeData} />
            </CardContent>
          </Card>
          
          {/* Secondary card (1 column) */}
          <Card>
            <CardHeader>
              <CardTitle>Volume Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <PieChart data={distributionData} />
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Section 3: Activity */}
      <section aria-label="Activity">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transactions table (2 columns) */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest 20 transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsTable />
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">View All</Button>
            </CardFooter>
          </Card>
          
          {/* Alerts (1 column) */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>SAR & fraud notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <AlertItem severity="high" message="High fraud score on txn-001" />
              <AlertItem severity="warning" message="Daily limit approaching" />
              <AlertItem severity="info" message="KYC tier upgrade available" />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
```

#### 2. ListingPageLayout (Entity Listing)

```tsx
export function ListingPageLayout({ title, description, items, columns }) {
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <Button primary>+ New {title.slice(0, -1)}</Button>
      </div>
      
      {/* Filter Row */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startIcon={<Search className="w-4 h-4" />}
            />
          </div>
          
          {/* Filters */}
          <Select value={filters.status} onValueChange={(v) => setFilters({...filters, status: v})}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Date Range */}
          <DatePickerRange />
          
          {/* Export */}
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </Card>
      
      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            {columns.map(col => (
              <TableHead key={col.key} className="hover:bg-gray-50 cursor-pointer">
                {col.label}
              </TableHead>
            ))}
          </TableHeader>
          <TableBody>
            {items.map((item, idx) => (
              <TableRow 
                key={item.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigateToDetail(item.id)}
              >
                {columns.map(col => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(item[col.key]) : item[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        <TableFooter>
          <Pagination />
        </TableFooter>
      </Card>
    </div>
  );
}
```

#### 3. DetailPageLayout (Entity Detail)

```tsx
export function DetailPageLayout({ title, entity, onUpdate }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-muted-foreground mt-1">{entity.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge>{entity.status}</Badge>
          <Button primary>Primary Action</Button>
          <Button variant="outline">Secondary</Button>
        </div>
      </div>
      
      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main facts (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Facts section */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <DetailField label="Amount" value="$1,250.00" />
              <DetailField label="From" value={entity.from} />
              <DetailField label="To" value={entity.to} />
              <DetailField label="Status" value={entity.status} />
              <DetailField label="Created" value={formatDate(entity.createdAt)} />
            </CardContent>
          </Card>
          
          {/* Timeline/History */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline events={entity.events} />
            </CardContent>
          </Card>
          
          {/* Ledger entries */}
          <Card>
            <CardHeader>
              <CardTitle>Ledger Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                {/* Ledger table */}
              </Table>
            </CardContent>
          </Card>
        </div>
        
        {/* Right: Metadata (1 column) */}
        <div className="space-y-6">
          {/* Tags/Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <MetadataField label="Fraud Score" value={entity.fraudScore} />
              <MetadataField label="Risk Level" value={entity.riskLevel} />
              <MetadataField label="KYC Tier" value={entity.kycTier} />
            </CardContent>
          </Card>
          
          {/* Related entities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Related</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/app/wallets/${entity.walletId}`} className="text-primary hover:underline text-sm">
                → View Wallet
              </Link>
              <Link href={`/app/compliance/sars`} className="text-primary hover:underline text-sm">
                → View SARs
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

---

## ✨ SECTION 4: ANIMATIONS & INTERACTIONS

### Page Transitions

```tsx
const pageVariants = {
  initial: {
    opacity: 0,
    y: 16
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2
    }
  }
};

export function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
```

### Component Load Animations

**KPI Cards (Staggered):**

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

export function KPIGrid() {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {kpis.map(kpi => (
        <motion.div key={kpi.id} variants={itemVariants}>
          <KPICard {...kpi} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### Hover Effects

**Card Hover:**

```css
.card {
  transition: all var(--duration-normal) var(--easing-ease-out);
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}
```

**Button Hover & Click:**

```tsx
const buttonVariants = {
  hover: {
    y: -2,
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
  },
  tap: {
    y: 0,
    scale: 0.98,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  }
};

export function Button({ children, ...props }) {
  return (
    <motion.button
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      transition={{ duration: 0.15 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
```

### Scroll Animations

**Skeleton Loading → Data Fade:**

```tsx
const skeletonVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0, transition: { duration: 0.3 } }
};

export function DataSection({ isLoading, data }) {
  return (
    <motion.div
      variants={skeletonVariants}
      initial={isLoading ? 'visible' : 'hidden'}
      animate={isLoading ? 'visible' : 'hidden'}
    >
      {isLoading ? (
        <Skeleton className="h-40 rounded-lg" />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {data}
        </motion.div>
      )}
    </motion.div>
  );
}
```

### Event-Triggered Animations

**Transfer Success Confetti:**

```tsx
export function TransferSuccessAnimation() {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [transferSuccess]);
  
  return (
    <>
      {showConfetti && <ConfettiExplosion />}
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="text-center space-y-4"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: 2, duration: 0.3 }}
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        </motion.div>
        
        <h2 className="text-2xl font-bold">Transfer Successful!</h2>
        <p className="text-muted-foreground">Your payment has been completed</p>
      </motion.div>
    </>
  );
}
```

**Number Counter Animation:**

```tsx
import NumberFlow from '@react-number-flow/core';

export function BalanceDisplay({ balance }) {
  return (
    <NumberFlow
      value={balance}
      format={{ style: 'currency', currency: 'USD' }}
      transformTiming={{
        duration: 750,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // spring bounce
      }}
    />
  );
}
```

**Badge Bounce (New Notification):**

```tsx
const badgeBounceVariants = {
  bounce: {
    scale: [1, 1.3, 1.2, 1],
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

export function NotificationBadge({ count }) {
  return (
    <motion.div
      key={count}
      variants={badgeBounceVariants}
      animate="bounce"
      className="absolute top-1 right-1 w-5 h-5 bg-danger rounded-full flex items-center justify-center text-white text-xs font-bold"
    >
      {count}
    </motion.div>
  );
}
```

### On-Click Animations

**Transaction Row Click (Detail slide-in):**

```tsx
const detailSlideVariants = {
  hidden: { x: 100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: { x: 100, opacity: 0, transition: { duration: 0.2 } }
};

export function TransactionRow({ transaction, onSelect }) {
  return (
    <>
      <TableRow
        onClick={() => onSelect(transaction)}
        className="hover:bg-gray-50 cursor-pointer transition-colors"
      >
        {/* Row content */}
      </TableRow>
      
      <AnimatePresence>
        {selectedId === transaction.id && (
          <motion.div
            variants={detailSlideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 w-96 h-screen bg-white shadow-xl"
          >
            <DetailPanel transaction={transaction} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

### Loading States (Skeleton Animations)

```tsx
export function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  );
}

/* Shimmer effect via CSS */
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
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 1000px 100%;
}
```

---

## 🎯 SECTION 5: INTERACTION PATTERNS

### Form Validation

**On-Blur Validation:**

```tsx
export function TransferForm() {
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  
  const handleBlur = (field) => {
    const error = validateField(field, formData[field]);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };
  
  return (
    <form className="space-y-6">
      {/* Recipient field */}
      <div className="space-y-2">
        <Label htmlFor="recipient">Recipient</Label>
        <Input
          id="recipient"
          placeholder="Wallet ID or email"
          value={formData.recipient}
          onChange={(e) => setFormData({...formData, recipient: e.target.value})}
          onBlur={() => handleBlur('recipient')}
          className={errors.recipient ? 'border-danger' : ''}
        />
        {errors.recipient && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-danger flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {errors.recipient}
          </motion.p>
        )}
      </div>
      
      {/* Amount field with live balance check */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="amount">Amount</Label>
          <span className="text-xs text-muted-foreground">
            Balance: $5,000 | Limit: $5,000 today
          </span>
        </div>
        <Input
          id="amount"
          type="number"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          onBlur={() => handleBlur('amount')}
        />
        
        {/* Live limit indicator */}
        {formData.amount && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs mt-2"
          >
            <div className="flex items-center justify-between mb-1">
              <span>Daily limit remaining</span>
              <span className="font-semibold">
                ${5000 - parseFloat(formData.amount || 0)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(parseFloat(formData.amount) / 5000) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
        
        {errors.amount && (
          <p className="text-xs text-danger">{errors.amount}</p>
        )}
      </div>
      
      {/* Submit button */}
      <Button
        primary
        disabled={!formData.recipient || !formData.amount || Object.values(errors).some(Boolean)}
        className="w-full"
      >
        Send Transfer
      </Button>
    </form>
  );
}
```

### Toast/Notification System

```tsx
import { Toaster, toast } from 'sonner';

export function useNotification() {
  return {
    success: (message, options) => toast.success(message, {
      duration: 4000,
      ...options
    }),
    error: (message, options) => toast.error(message, {
      duration: 6000,
      ...options
    }),
    warning: (message, options) => toast.warning(message, {
      duration: 5000,
      ...options
    }),
    info: (message, options) => toast.info(message, {
      duration: 4000,
      ...options
    })
  };
}

// Usage:
const notify = useNotification();

async function handleTransfer() {
  try {
    await transferAPI.send(formData);
    notify.success('Transfer completed successfully!');
  } catch (error) {
    notify.error(`Transfer failed: ${error.message}`);
  }
}
```

### Empty State Pattern

```tsx
export function EmptyState({ 
  icon, 
  title, 
  description, 
  primaryAction, 
  secondaryAction 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      {/* Icon */}
      {icon && (
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl mb-4"
        >
          {icon}
        </motion.div>
      )}
      
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-sm">
        {description}
      </p>
      
      {/* Actions */}
      <div className="flex items-center gap-3">
        {primaryAction && (
          <Button primary onClick={primaryAction.onClick}>
            {primaryAction.label}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// Usage:
{wallets.length === 0 ? (
  <EmptyState
    icon="💰"
    title="No wallets yet"
    description="Create your first wallet to start managing funds"
    primaryAction={{
      label: "Create Wallet",
      onClick: () => router.push('/app/wallets/new')
    }}
    secondaryAction={{
      label: "Learn More",
      onClick: () => openHelp()
    }}
  />
) : (
  <WalletsList />
)}
```

---

## 📋 SECTION 6: RESPONSIVE BREAKPOINTS

**Tailwind Breakpoints:**

```
xs: 0px      (default, mobile)
sm: 640px    (mobile landscape)
md: 768px    (tablet)
lg: 1024px   (desktop)
xl: 1280px   (large desktop)
2xl: 1536px  (extra large)
```

**Component Breakpoint Strategy:**

| Component | xs | sm | md | lg | xl |
|-----------|----|----|----|----|-----|
| Sidebar | Hidden (drawer) | Hidden (drawer) | Hidden (drawer) | Fixed rail (260px) | Fixed rail (260px) |
| KPI Grid | 1 col | 1 col | 2 col | 4 col | 4 col |
| Dashboard Charts | Stacked | Stacked | 1-2 | 2-3 | 2-3 |
| Table | Scroll horiz | Scroll horiz | Scroll horiz | Full width | Full width |
| Detail Layout | 1 col | 1 col | 1 col | 2-3 col | 2-3 col |

---

## ♿ SECTION 7: ACCESSIBILITY

### WCAG 2.1 AA Compliance Checklist

- [x] **Color Contrast:** All text 4.5:1 minimum (verified with WebAIM Contrast Checker)
- [x] **Focus Indicators:** Visible ring on all interactive elements (`focus:ring-2 ring-primary`)
- [x] **Semantic HTML:** Use `<nav>`, `<main>`, `<section>`, `<article>`
- [x] **Form Labels:** All inputs have associated `<label>` elements
- [x] **ARIA:** Add `aria-label` to icon-only buttons, `aria-live` for dynamic updates
- [x] **Keyboard Navigation:** All features accessible via Tab + Enter
- [x] **Motion:** Respect `prefers-reduced-motion` media query

**Motion Respect:**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```tsx
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersReducedMotion;
}

// Usage:
const prefersReducedMotion = useReducedMotion();
const duration = prefersReducedMotion ? 0 : 0.3;
```

---

## 🚀 SECTION 8: IMPLEMENTATION CHECKLIST

Before starting React code, verify:

- [ ] Design tokens defined (colors, typography, spacing, shadows)
- [ ] Component library mapped (shadcn + custom variants)
- [ ] Layout archetypes finalized (dashboard, listing, detail, wizard)
- [ ] Animation library chosen (Motion.dev + Tremor + react-confetti)
- [ ] Responsive breakpoints locked (xs → 2xl strategy)
- [ ] Dark mode strategy decided (system + toggle)
- [ ] Accessibility standards verified (WCAG AA)
- [ ] Loading/empty states designed (skeleton patterns)
- [ ] Form validation rules defined (on-blur strategy)
- [ ] Notification system spec'd (toast types)
- [ ] Interaction patterns documented (hover, click, scroll)

---

## 📝 USAGE FOR CLAUDE CODE AGENT

When prompting Claude to build frontend:

```markdown
Build the XuPay React frontend using this design specification:

Tech Stack:
- Next.js 14 + App Router
- TypeScript
- shadcn/ui + Tailwind CSS
- Motion (Framer Motion successor)
- Tremor (charts)
- react-confetti-explosion
- NumberFlow (animated counters)

Design Tokens:
- Use CSS custom properties from frontend-design-spec.md SECTION 1
- All colors reference semantic tokens, never hardcoded
- All spacing uses 8px base unit
- All typography matches scale defined

Components:
- Implement component library (SECTION 2)
- Create layout archetypes (SECTION 3)
- All animations follow SECTION 4 patterns

Interactions:
- Form validation on blur (SECTION 5)
- Toast notifications for all feedback
- Loading states use skeletons (SECTION 5)
- Empty states use EmptyState component

Responsive:
- Use Tailwind breakpoints from SECTION 6
- Mobile-first approach
- Test all breakpoints

Accessibility:
- Implement all WCAG AA requirements (SECTION 7)
- Verify color contrast (4.5:1 minimum)
- Keyboard navigation on all features

Sitemap:
- Create routes based on sitemap defined earlier
- Use correct layout archetype for each route

Start with:
1. Setup globals.css with design tokens
2. Implement AppShell (sidebar + topbar)
3. Create layout components (DashboardLayout, ListingLayout, DetailLayout)
4. Implement /app/dashboard with real-looking dummy data
```

---
