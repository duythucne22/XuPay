# **XUPAY AUTH PAGES LAYOUT SPECIFICATION**
## **For AI Agent Implementation (Sign In & Sign Up)**

***

## **1. OVERVIEW & DESIGN PRINCIPLES**

### **Objective**
Create a **minimal, split-screen authentication experience** where:
- **Left side (50% width, desktop)**: Form container for login/signup with tab switching
- **Right side (50% width, desktop)**: Hero image or description/illustration area
- **Mobile**: Single column stack (form on top, image below)

### **Technology Stack**
- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS + custom CSS (glassmorphism, gradients)
- **State Management**: React `useState` for tab switching and form validation
- **Icons**: Lucide React or inline SVG
- **Responsive**: Mobile-first, desktop breakpoint at `md:` (768px)

### **Theme & Aesthetics**
- **Color Palette**:
  - Primary: Blue gradient (`from-blue-500 to-indigo-600`)
  - Secondary: Light gray backgrounds (`#f9fafb`, `#e5e7eb`)
  - Text: Dark gray (`#111827`, `#374151`, `#6b7280`)
  - Accents: Green (validation), Red (errors)
- **Typography**: Inter font, weights 300–700
- **Effects**: Glassmorphism (backdrop blur, semi-transparent cards), soft shadows

### **Device Breakpoints**
- Mobile: < 768px (single column)
- Tablet: 768px–1024px (flexible)
- Desktop: ≥ 1024px (side-by-side)

***

## **2. PAGE STRUCTURE & LAYOUT HIERARCHY**

```
<html>
  ├── <body> (min-h-screen, flex flex-col, bg-gray-50)
  │   ├── <header> (fixed top, full width, flex justify-between)
  │   │   ├── Logo + Brand (left)
  │   │   └── Links (right): Help, Privacy, Terms
  │   │
  │   └── <main> (flex-1, flex flex-col md:flex-row)
  │       ├── <section.left> (w-full md:w-1/2, flex items-center justify-center)
  │       │   └── <div.form-container> (max-w-md, glass-card, rounded-2xl, p-8)
  │       │       ├── <div.header> (icon + title + subtitle)
  │       │       ├── <div.tab-switch> (Login | Sign Up buttons)
  │       │       ├── <form.login> (id="login-form")
  │       │       └── <form.signup> (id="register-form", hidden by default)
  │       │
  │       └── <section.right> (w-full md:w-1/2, flex items-center justify-center)
  │           └── <div.hero-content> (image, gradient, illustration, or description)
  │
  └── <script> (form logic, tab switching, validation)
```

***

## **3. HEADER COMPONENT**

**Location**: `src/components/layout/AuthHeader.tsx`

### **Structure**
```tsx
<header>
  {/* Full width, sticky top, flex row */}
  {/* Left block: logo icon + brand text */}
  {/* Right block: navigation links */}
</header>
```

### **Specifications**

| Element | Property | Value |
|---------|----------|-------|
| Container | `className` | `w-full py-4 px-6 flex justify-between items-center border-b border-gray-200` |
| Logo block | Flex, items center | `w-8 h-8 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600` |
| Brand text | Font | Inter, bold, `text-xl`, color gray-900 |
| Right nav | Space between | `space-x-4`, links in text-sm, hover → blue-600 |
| Links | Content | "Help", "Privacy", "Terms" |

***

## **4. FORM CONTAINER (CARD)**

**Location**: Left half of main, centered

### **Glassmorphism Card**
```css
.glass-card {

}
```

### **Card Structure**

```tsx
<div className="w-full max-w-md glass-card rounded-2xl p-8">
  {/* Header Section */}
  <div className="text-center mb-8">
    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
      {/* Lock Icon SVG */}
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
    <p className="text-gray-600">Log in to manage your wallets and payments</p>
  </div>

  {/* Tab Switch */}
  <div className="flex mb-6 rounded-xl overflow-hidden border border-gray-200">
    <button id="login-tab" className="flex-1 py-3 font-medium bg-blue-50 text-blue-600">
      Sign In
    </button>
    <button id="register-tab" className="flex-1 py-3 font-medium bg-white text-gray-600">
      Sign Up
    </button>
  </div>

  {/* Login Form (visible by default) */}
  <form id="login-form" className="space-y-6">
    {/* Form fields */}
  </form>

  {/* Sign Up Form (hidden by default) */}
  <form id="register-form" className="hidden space-y-6">
    {/* Form fields */}
  </form>
</div>
```

***

## **5. TAB SWITCHING LOGIC**

**Behavior**: Clicking tabs toggles form visibility and active button styling.

```tsx
// State
const [activeForm, setActiveForm] = useState('login'); // 'login' | 'register'

// Handlers
const showLoginForm = () => {
  setActiveForm('login');
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('register-form').classList.add('hidden');
  // Update tab styles
};

const showRegisterForm = () => {
  setActiveForm('register');
  document.getElementById('register-form').classList.remove('hidden');
  document.getElementById('login-form').classList.add('hidden');
  // Update tab styles
};
```

**Tab Active State**:
- **Active**: `bg-blue-50 text-blue-600`
- **Inactive**: `bg-white text-gray-600 hover:bg-gray-50`

***

## **6. LOGIN FORM FIELDS**

**Location**: `<form id="login-form">`

### **Field Sequence**

#### **Error Message (conditional)**
```tsx
<div id="login-error" className="hidden p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
  {/* Validation error display */}
</div>
```

#### **Email Input**
```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">Email Address</label>
  <div className="relative">
    {/* Leading icon (envelope SVG) */}
    <input 
      type="email"
      placeholder="your@email.com"
      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    />
    {/* Trailing validation checkmark (hidden until valid) */}
  </div>
</div>
```

**Input Styling**:
- Border: `border-gray-300`
- Focus: `focus:ring-2 focus:ring-blue-500 focus:border-blue-500`
- Padding: `py-3 pl-10 pr-3` (icon space)
- Icons: Left (email icon), Right (checkmark on valid)

#### **Password Input**
```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">Password</label>
  <div className="relative">
    <input 
      type="password" 
      placeholder="••••••••"
      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    />
    {/* Toggle visibility button (eye icon) */}
  </div>
</div>
```

#### **Remember Me & Forgot Password**
```tsx
<div className="flex items-center justify-between">
  <div className="flex items-center">
    <input type="checkbox" id="login-remember-me" checked className="h-4 w-4 text-blue-600" />
    <label className="ml-2 text-sm text-gray-700">Remember me</label>
  </div>
  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
    Forgot password?
  </a>
</div>
```

#### **Submit Button**
```tsx
<button 
  type="submit" 
  className="w-full py-3 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
>
  Log in
</button>
```

***

## **7. SIGN UP FORM FIELDS**

**Location**: `<form id="register-form" className="hidden">`

### **Field Sequence** (all same styling as login, except password strength added)

#### **Full Name**
```tsx
<input type="text" placeholder="John Doe" className="..." />
```

#### **Email Address**
Same as login email field.

#### **Password**
```tsx
<div className="space-y-2">
  <input type="password" placeholder="••••••••" className="..." />
  {/* Password strength indicator */}
  <div className="password-strength">
    <div id="password-strength-fill" className="password-strength-fill" style={{width: '0%'}}></div>
  </div>
  <p className="text-xs text-gray-500">Password strength: <span>None</span></p>
</div>
```

**Password Strength Logic** (JavaScript):
```javascript
function evaluatePasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  const fills = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const labels = ['None', 'Weak', 'Fair', 'Good', 'Strong'];
  
  return { width: (strength / 4) * 100, color: fills[strength], label: labels[strength] };
}
```

#### **Confirm Password**
```tsx
<input type="password" placeholder="••••••••" className="..." />
```

#### **Terms Checkbox**
```tsx
<div className="flex items-start">
  <input type="checkbox" id="register-terms" className="h-4 w-4 text-blue-600" />
  <label className="ml-3 text-sm text-gray-700">
    I agree to the <a href="#" className="text-blue-600">Terms of Service</a> and 
    <a href="#" className="text-blue-600">Privacy Policy</a>
  </label>
</div>
```

#### **Submit Button**
```tsx
<button type="submit" className="...">Create account</button>
```

***

## **8. SOCIAL LOGIN SECTION**

**Location**: Both forms, after main button.

### **Divider**
```tsx
<div className="relative">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-300"></div>
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="px-2 bg-white text-gray-500">Or continue with</span>
  </div>
</div>
```

### **Social Buttons Grid**
```tsx
<div className="grid grid-cols-3 gap-3">
  <button type="button" className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
    {/* Google icon SVG */}
  </button>
  <button type="button" className="...">
    {/* Apple icon SVG */}
  </button>
  <button type="button" className="...">
    {/* Facebook icon SVG */}
  </button>
</div>
```

**Button Styling**:
- Border: `border border-gray-300`
- Background: `bg-white hover:bg-gray-50`
- Icon size: `h-5 w-5`

***

## **9. FORM SWITCH CTA (SIGN UP TEXT)**

**Location**: Bottom of form.

```tsx
<p className="text-center text-sm text-gray-600">
  Already have an account? 
  <button id="switch-to-login" className="ml-1 font-medium text-blue-600 hover:text-blue-500">
    Log in
  </button>
</p>
```

***

## **10. RIGHT SIDE (HERO SECTION)**

**Location**: Right half of main (desktop only, hidden on mobile)

### **Options for Right Side Content**

**Option A: Illustration/Image**
```tsx
<div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
  <img src="/auth-hero.png" alt="Secure finances" className="max-w-md h-auto" />
</div>
```

**Option B: Text Description**
```tsx
<div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
  <div className="max-w-md">
    <h2 className="text-3xl font-bold text-gray-900 mb-4">Secure Financial Management</h2>
    <p className="text-gray-600 mb-6">
      Join millions of smart investors who trust us to manage their finances securely.
    </p>
    <ul className="space-y-3 text-sm text-gray-700">
      <li className="flex items-center">
        <svg className="h-5 w-5 text-green-500 mr-2" />
        Real-time transaction monitoring
      </li>
      <li className="flex items-center">
        <svg className="h-5 w-5 text-green-500 mr-2" />
        Bank-level encryption
      </li>
      <li className="flex items-center">
        <svg className="h-5 w-5 text-green-500 mr-2" />
        Multi-wallet support
      </li>
    </ul>
  </div>
</div>
```

**Option C: 3D Illustration (like your SmartSave mockup)**
```tsx
<div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gradient-to-b from-blue-100 to-blue-200">
  {/* 3D rendered safe/lock/wallet illustration */}
  <img src="/3d-safe.png" alt="3D Safe" className="w-64 h-64" />
</div>
```

***

## **11. RESPONSIVE BEHAVIOR**

| Viewport | Layout | Form Width | Hero Visibility |
|----------|--------|-----------|-----------------|
| < 768px | Single column | Full width (-padding) | Below form |
| 768px–1024px | Side-by-side | ~50% | Visible, squeezed |
| > 1024px | Side-by-side | ~50%, centered | Full visible |

**Mobile Adjustments**:
- Hide right side or show below form
- Form takes full width with padding
- Reduce card padding from `p-8` to `p-6`

```css
@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
}
```

***

## **12. FORM VALIDATION & ERROR STATES**

### **Email Validation**
- Real-time check on blur/input
- Show green checkmark if valid
- Show error message in red box if invalid

### **Password Strength** (Sign Up only)
- Dynamic bar fill color based on strength
- Update label: None → Weak → Fair → Good → Strong
- Gradient colors: red → yellow → blue → green

### **Password Match** (Sign Up)
- Compare confirm password with password field
- Show error if mismatch on blur

### **Terms Agreement** (Sign Up)
- Disable submit button until checked

***

## **13. COMPONENT FILE STRUCTURE**

```
src/
├── app/
│   └── (auth)/
│       ├── layout.tsx          # Wraps auth pages
│       ├── login/
│       │   └── page.tsx        # Login page
│       └── register/
│           └── page.tsx        # Register page
│
├── components/
│   ├── layout/
│   │   └── AuthHeader.tsx      # Header component
│   └── auth/
│       ├── LoginForm.tsx       # Login form component
│       ├── SignUpForm.tsx      # Sign-up form component
│       └── AuthCard.tsx        # Glass card wrapper
│
└── styles/
    └── auth.css               # Glassmorphism + animations
```

***

## **14. KEY TAILWIND CLASSES REFERENCE**

```tailwind
/* Layout */
flex flex-col md:flex-row min-h-screen
w-full md:w-1/2 flex items-center justify-center
max-w-md mx-auto p-6 md:p-8

/* Card Styling */
rounded-2xl p-8 border border-gray-200
bg-white bg-opacity-80 backdrop-blur-lg

/* Gradients */
bg-gradient-to-r from-blue-500 to-indigo-600
bg-gradient-to-br from-blue-50 to-indigo-100

/* Form Elements */
w-full px-3 py-3 border border-gray-300 rounded-lg
focus:ring-2 focus:ring-blue-500 focus:border-transparent
placeholder-gray-400

/* Buttons */
py-3 px-4 rounded-lg font-medium text-white
hover:from-blue-600 hover:to-indigo-700
focus:ring-2 focus:ring-offset-2 focus:ring-blue-500

/* Text */
text-sm font-medium text-gray-700
text-xs text-gray-500
```

***

## **15. ANIMATION & INTERACTION**

### **Tab Switch Animation** (optional Framer Motion)
```tsx
<motion.form 
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Form content */}
</motion.form>
```

### **Input Focus**
```css
input:focus {
  ring: 2px;
  ring-color: rgb(59, 130, 246);
  border-color: transparent;
}
```

### **Button Hover/Active**
```css
button:hover {
  background: linear-gradient(to right, rgb(37, 99, 235), rgb(79, 70, 229));
}

button:active {
  transform: scale(0.98);
}
```

***

## **16. ACCEPTANCE CRITERIA FOR AI AGENT**

**The implementation is complete when:**

✅ **Layout**
- [ ] Header spans full width with logo + nav links
- [ ] Left form container is centered, max-width 448px, glassmorphism styling
- [ ] Right hero section (or text) displays on desktop, hidden on mobile
- [ ] Responsive breakpoints work at 768px

✅ **Tabs**
- [ ] Clicking "Sign In" shows login form, hides signup form
- [ ] Clicking "Sign Up" shows signup form, hides login form
- [ ] Active tab has blue background, inactive has gray background

✅ **Login Form**
- [ ] Email input with icon and validation checkmark
- [ ] Password input with toggle visibility button
- [ ] Remember me checkbox + Forgot password link
- [ ] Submit button with gradient and hover state
- [ ] Social login buttons (3-column grid)
- [ ] Link to switch to signup form

✅ **Sign Up Form**
- [ ] Full name input
- [ ] Email input with validation
- [ ] Password input with strength indicator
- [ ] Confirm password input
- [ ] Terms agreement checkbox
- [ ] Submit button with gradient
- [ ] Social login buttons
- [ ] Link to switch to login form

✅ **Validation**
- [ ] Email validation (regex or real-time check)
- [ ] Password strength meter updates dynamically (Sign Up)
- [ ] Confirm password match validation (Sign Up)
- [ ] Terms checkbox controls submit button enable/disable
- [ ] Error messages display in red box if validation fails

✅ **Styling**
- [ ] All text uses Inter font
- [ ] Color palette matches (blues, grays, gradients)
- [ ] Rounded corners on inputs and buttons (6–16px radius)
- [ ] Glassmorphism card with blur and semi-transparent background
- [ ] Proper spacing (Tailwind gap/space utilities)
- [ ] Focus states visible on all inputs and buttons

✅ **Accessibility**
- [ ] All form inputs have associated labels
- [ ] Focus indicators visible (focus:ring-*)
- [ ] Color not the only visual indicator of state
- [ ] Icons have alt text or aria-labels where appropriate

***

## **17. PROMPT FOR AI AGENT**

Copy-paste this into your AI tool:

```
**TASK: Implement XUPAY Login & Sign-Up Pages (Next.js + TypeScript + Tailwind)**

**Context:**
You are building minimal, side-by-side auth pages for a fintech dashboard. Left side: glassmorphic form with tab switching. Right side: hero illustration/description.

**Requirements:**

1. **Page Structure:**
   - Create two Next.js pages:
     - `src/app/(auth)/login/page.tsx` 
     - `src/app/(auth)/register/page.tsx`
   - Or: single page with tab switching between login/signup forms
   
2. **Components to Build:**
   - `AuthHeader.tsx` - Fixed top bar (logo + nav)
   - `AuthCard.tsx` - Glassmorphic card wrapper
   - `LoginForm.tsx` - Login form component
   - `SignUpForm.tsx` - Sign-up form component

3. **Layout (Desktop):**
   - Header: full width, py-4, px-6, border-bottom
   - Main: flex row (md:flex-row)
     - Left (50%): centered form card
     - Right (50%): hero image/text on gradient background

4. **Form Styling:**
   - Card: glassmorphism (backdrop-blur, rgba bg, subtle border)
   - Inputs: rounded-lg, border-gray-300, focus:ring-2 focus:ring-blue-500
   - Buttons: gradient from-blue-500 to-indigo-600, hover:brightness-110
   - Icons: Lucide React or inline SVG

5. **Tab Switch (if single page):**
   - Two tab buttons: Sign In | Sign Up
   - Click switches form visibility and active styling
   - Active tab: bg-blue-50 text-blue-600
   - Inactive tab: bg-white text-gray-600

6. **Login Form Fields:**
   - Email (with envelope icon, validation checkmark)
   - Password (with eye toggle)
   - Remember me checkbox + Forgot password link
   - Submit button
   - Social login (Google, Apple, Facebook)
   - Link to sign up

7. **Sign-Up Form Fields:**
   - Full name
   - Email (with validation)
   - Password (with strength meter)
   - Confirm password
   - Terms agreement checkbox
   - Submit button
   - Social login
   - Link to login

8. **Validation:**
   - Email: regex validation, show green checkmark if valid, red error if invalid
   - Password strength: dynamic bar (red → yellow → blue → green based on complexity)
   - Confirm password: match check, error if mismatch
   - Terms: submit button disabled until checked

9. **Responsive:**
   - Mobile (< 768px): single column, form full width, hero below or hidden
   - Desktop (≥ 768px): side-by-side, 50/50 split

10. **Styling:**
    - Font: Inter (from next/font)
    - Colors: blues, grays, white (from color palette above)
    - Spacing: Tailwind defaults (gap-6, p-6, py-3, etc.)
    - Rounded: rounded-2xl (cards), rounded-lg (inputs/buttons)

**Acceptance Criteria:**
- [ ] Header renders correctly with logo and nav links
- [ ] Left form card is centered, glassmorphic, max-width 448px
- [ ] Tab switching works (visible/hidden form states)
- [ ] All form fields render with icons and proper styling
- [ ] Validation works (email, password strength, terms)
- [ ] Buttons have hover/focus states
- [ ] Responsive on mobile (single column, stacked)
- [ ] Responsive on desktop (side-by-side)
- [ ] No console errors, TypeScript strict mode compliant

**Files to Generate:**
- src/app/(auth)/layout.tsx
- src/app/(auth)/login/page.tsx (or page.tsx with tabs)
- src/app/(auth)/register/page.tsx (if separate page)
- src/components/auth/AuthCard.tsx
- src/components/auth/LoginForm.tsx
- src/components/auth/SignUpForm.tsx
- src/components/layout/AuthHeader.tsx

**Start by acknowledging this spec and listing the file structure you'll create. Then generate code.**
