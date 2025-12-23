### High‑level layout

- The component renders a **full‑screen dashboard shell**.
- It uses a **dark theme** with glassmorphism (black with opacity, blur, subtle borders).
- The layout is split into three main regions:
  1. **Top navigation bar** (fixed height, full width).
  2. **Left sidebar navigation** (fixed width).
  3. **Main content area** (flex‑1, scrollable).

Technologies used:
- React functional component with hooks (`useState`, `useEffect`, `useRef`).
- Framer Motion for section/element animations.
- Tailwind CSS utility classes for all layout and styling.
- Lucide icons and inline SVGs for iconography.

***

### Page shell

- Root `<div className="min-h-screen bg-[#0a0a0a] text-white font-sans">`
  - Ensures full viewport height, dark background, and base typography.
- Inside, a `<header>` and a flex container for sidebar + main content:
  - `<header>` height: `h-14`
  - Below it: `<div className="flex h-[calc(100vh-3.5rem)]">`
    - Left: `<aside className="w-64 ...">`
    - Right: `<main className="flex-1 ...">`

This establishes a **fixed top bar**, **fixed‑width sidebar**, and **flexible main panel**.

---

### Top navigation bar

- `<header className="bg-black/50 border-b border-gray-700/50 h-14 flex items-center px-4 backdrop-blur-sm">`
- Layout:
  - Left: three small colored circles (simulating macOS window controls).
  - Center‑left: “FOREX” site indicator (green square + domain text).
  - Right (aligned via `ml-auto`):
    - Search input (with leading icon inside a relatively positioned container).
    - Notification bell icon.
    - Circular avatar with user initial.
- Purpose: **global chrome** that stays visually separate from the dashboard content.

---

### Sidebar navigation

- `<aside className="w-64 bg-black/50 border-r border-gray-700/50 flex flex-col py-6 px-4 backdrop-blur-sm">`
- Vertical flex container with:
  - Brand/logo at top (`FOREX` wordmark).
  - Primary navigation stack (`<nav className="flex flex-col space-y-2">`):
    - Navigation buttons (`Dashboard`, `Analytics`, `My Wallet`, `Accounts`, `Settings`, `Security`, `Help Centre`).
    - Each button:
      - Full‑width, horizontal flex.
      - Left icon (SVG, fixed 24×24 viewBox).
      - Label text.
      - Active state driven by `activeTab` and `setActiveTab`:
        - Active: `bg-[#00c853]/20 text-[#00c853]`
        - Inactive: `hover:bg-black/30`
  - **Expandable “My Wallet” group**:
    - Button toggles `showWalletMenu`.
    - When open, renders a nested vertical list indented with `ml-12` representing sub‑items (Credit Cards, Bank Accounts, Crypto Wallets).
  - At the bottom (`mt-auto`):
    - User profile block (avatar, name, “Edit Profile”).
    - Dark‑mode toggle UI (visual switch; controlled by `isDarkMode` state but not wired to theme logic yet).

The sidebar is thus a **vertical navigation rail** with one expandable section and a persistent user/profile footer.

---

### Main content area

- `<main className="flex-1 p-6 overflow-auto">`
  - Takes remaining horizontal space.
  - Scrollable, with internal padding around content.
- Intro section:
  - Heading “Welcome Back, Lusiana 💫”
  - Subtitle explaining current status.

---

### Grid layout in main content

- Main dashboard body is a **responsive grid** controlled by Framer Motion:

```tsx
<motion.div
  ref={ref}
  initial="hidden"
  animate={controls}
  variants={containerVariants}
  className="grid grid-cols-1 lg:grid-cols-3 gap-6"
>
  {/* Left: lg:col-span-2, Right: analytics column */}
</motion.div>
```

- On large screens (`lg:`):
  - **Left column:** spans 2 grid columns (main cards + metrics).
  - **Right column:** spans 1 grid column (analytics and lists).
- On small screens:
  - Single‑column stacking.

---

### Left column structure

`<motion.div variants={itemVariants} className="lg:col-span-2">`

1. **Upper two‑column grid** (`My Cards` and `Recent Payments`):
   - `grid grid-cols-1 md:grid-cols-2 gap-6 mb-6`
   - Card container pattern: `bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50`.

   a) **My Cards panel**
   - Header with title and “See All” inline button.
   - Internal grid of cards (`cards` array):
     - Each card is a hover‑animated `motion.div` with fixed height (`h-40`).
     - Background: gradient `bg-gradient-to-r` with card‑defined color.
     - Top row: left text block (card network, number, holder, expiry) and right circular logo.
   - Last tile is an “Add New Card” call‑to‑action with dashed border.

   b) **Recent Payments panel**
   - Header with title and two icon buttons (search/filter actions).
   - `grid grid-cols-1 md:grid-cols-3 gap-4` of payment tiles.
   - Each tile:
     - Small colored square icon with initial.
     - Name and amount, with amount in green.
     - Hover state uses border and scale via Framer Motion.

2. **Metrics section** (four compact KPI cards)
   - `grid grid-cols-1 md:grid-cols-4 gap-6`
   - Each item is a `motion.div` using `itemVariants` for entrance animation.
   - Card composition:
     - Top row: gradient icon pill (DollarSign) and metric label (Balance/Income/Saving/Expenses).
     - Metric value as large number.
     - Change percentage with color semantics (green for positive, red for negative).

The left column is therefore **“accounts + recents + KPI metrics”**, arranged in nested grids.

***

### Right column structure

`<motion.div variants={itemVariants} className="space-y-6">`

1. **Analytics card**
   - Header row:
     - Title “Analytics”.
     - Legend showing colored dots for Income vs Outcome and a small year selector pill.
   - Body:
     - Custom `AnalyticsChart` component.

2. **Top Performing Categories**
   - Title.
   - Vertical list of categories, each with:
     - Label + amount row.
     - Horizontal progress bar showing the percentage (width controlled via inline style and Tailwind background color).

3. **Upcoming Bills**
   - Title.
   - Vertical list of bill items:
     - Left: colored circular icon with first letter, bill name, due date.
     - Right: amount.
     - Hoverable row with subtle background change.

The right column is **“analytical overview + categorical breakdown + upcoming obligations.”**

***

### AnalyticsChart component (embedded in same file)

- Reads `analyticsData` array of `{ month, income, outcome }`.
- Derives `max` across both income and outcome for relative bar heights.
- Layout:
  - A `relative` container with fixed height.
  - **Y‑axis labels** as a left absolute column (40K, 30K, 20K, 10K, 0).
  - **X‑axis month bars**:
    - Positioned using flex row (`absolute left-8 right-0 top-0 bottom-0 flex items-end justify-between px-2`).
    - Each month: a vertical stack of two bars:
      - Outcome bar (green).
      - Income bar (blue).
    - Heights set by inline style `height: ${value / max * 100}%`.
  - **Highlight marker** for current month:
    - Vertical yellow line in approximate center.
    - Little tooltip above showing “May 2023 – $40k”.

This is a **pure CSS + JS bar chart** without external charting libraries.

***

### Animation system

- Uses Framer Motion:
  - `useInView(ref, { once: true, margin: "-100px" })` detects when the main grid enters viewport.
  - `controls.start("visible")` triggers the animation once.
- `containerVariants`:
  - `hidden`: opacity 0.
  - `visible`: opacity 1 with `staggerChildren` and `delayChildren` to sequentially animate inner items.
- `itemVariants`:
  - `hidden`: `y: 20, opacity: 0`.
  - `visible`: `y: 0, opacity: 1, duration: 0.5`.
- Applied to the main grid and to cards/sections for smooth entrance transitions.

***

### State model

- `isDarkMode`: boolean, currently only drives switch position; can later drive theme toggling.
- `activeTab`: string representing current sidebar selection; affects active styling.
- `showWalletMenu`: boolean controlling expansion of the “My Wallet” submenu.

These states do **not** yet change the main content; they primarily control visual states and navigation appearance.
