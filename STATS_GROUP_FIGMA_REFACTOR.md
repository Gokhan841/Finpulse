# StatsGroup.tsx Figma Refactor - Complete Documentation

## Overview

Refactored `StatsGroup.tsx` component to match exact Figma specifications while maintaining API data integration.

---

## Changes Summary

### ✅ **Dimensions & Layout**

#### Main Container (StatsGroup)
- **Width:** `716px` (fixed)
- **Height:** `105px` (fixed)
- **Layout:** `display: flex` with `gap: 25px`

**Before:**
```tsx
<div className="flex gap-[25px] mb-[30px]">
```

**After:**
```tsx
<div className="w-[716px] h-[105px] flex gap-[25px] mb-[30px]">
```

---

#### Individual Card (StatCard)
- **Width:** `222px` (fixed)
- **Height:** `105px` (fixed)
- **Border Radius:** `10px` (was `15px`)
- **Padding:** `24px` top/bottom, `20px` left/right

**Before:**
```tsx
<div className="w-[222px] h-[105px] bg-[...] rounded-[15px] p-5 flex flex-col justify-between">
```

**After:**
```tsx
<div className="w-[222px] h-[105px] bg-[...] rounded-[10px] px-5 py-6 flex gap-[15px]">
```

**Changes:**
- ✅ Border radius: `15px` → `10px`
- ✅ Padding: `p-5` (20px all) → `px-5 py-6` (20px horizontal, 24px vertical)
- ✅ Layout: Vertical (`flex-col justify-between`) → Horizontal (`flex gap-[15px]`)

---

### ✅ **Icon System**

#### Icon Container (42x42)

**Structure:**
```
Outer Container (42x42)
    └── Inner Circle (42x42, rounded-full)
        └── Icon (20x20)
```

**Implementation:**
```tsx
<div className="w-[42px] h-[42px] flex items-center justify-center shrink-0">
  <div className="w-[42px] h-[42px] bg-[...] rounded-full flex items-center justify-center">
    <Icon className="w-5 h-5 text-[...]" />
  </div>
</div>
```

**Before:**
- Icon directly placed with card content
- No circular background
- Fixed size with no proper container

**After:**
- ✅ 42x42px outer container
- ✅ 42x42px inner circle with background
- ✅ 20x20px icon centered inside
- ✅ `shrink-0` prevents icon from shrinking

---

### ✅ **Text Content Box**

#### Dimensions & Layout
- **Width:** `125px` (fixed)
- **Height:** `57px` (fixed)
- **Layout:** Vertical flex (`flex-col`) with `gap: 10px`

**Implementation:**
```tsx
<div className="w-[125px] h-[57px] flex flex-col gap-[10px]">
  <p className="text-[14px] font-normal leading-[100%]">Label</p>
  <p className="text-[24px] font-bold leading-[100%]">Amount</p>
</div>
```

**Before:**
- No fixed dimensions
- Content stacked with `justify-between`
- No defined gap

**After:**
- ✅ Fixed `125px` width
- ✅ Fixed `57px` height
- ✅ Vertical flex with `10px` gap
- ✅ Line height `100%` on both texts

---

### ✅ **Typography**

#### Label (Title)
- **Font:** Kumbh Sans (inherited)
- **Size:** `14px`
- **Weight:** `400` (Regular) → `font-normal`
- **Line Height:** `100%` → `leading-[100%]`

#### Amount (Value)
- **Font:** Kumbh Sans (inherited)
- **Size:** `24px`
- **Weight:** `700` (Bold) → `font-bold`
- **Line Height:** `100%` → `leading-[100%]`

**Before:**
```tsx
<p className="text-[14px] font-normal text-gray-400">Total balance</p>
<p className="text-[24px] font-bold text-white">₺125,750.50</p>
```

**After:**
```tsx
<p className="text-[14px] font-normal leading-[100%] text-[#FFFFFF]">Total balance</p>
<p className="text-[24px] font-bold leading-[100%] text-[#FFFFFF]">₺125,750.50</p>
```

**Changes:**
- ✅ Added `leading-[100%]` to both
- ✅ Changed color classes to exact hex values

---

### ✅ **Theme System**

#### Theme ON (First Card - Total Balance)

| Element | Color | Hex |
|---------|-------|-----|
| Card Background | Dark Grey | `#363A3F` |
| Inner Circle Background | Lighter Grey | `#4E5257` |
| Icon Color | Lime | `#C8EE44` |
| Text Color (Label & Amount) | White | `#FFFFFF` |

#### Theme OFF (Other Cards - Expense & Savings)

| Element | Color | Hex |
|---------|-------|-----|
| Card Background | Light Grey | `#F8F8F8` |
| Inner Circle Background | Beige | `#EBE8E8` |
| Icon Color | Dark Grey | `#363A3F` |
| Text Color (Label & Amount) | Primary Dark | `#1B212D` |

**Implementation:**
```tsx
const cardBg = theme === 'on' ? 'bg-[#363A3F]' : 'bg-[#F8F8F8]'
const circleBg = theme === 'on' ? 'bg-[#4E5257]' : 'bg-[#EBE8E8]'
const iconColor = theme === 'on' ? 'text-[#C8EE44]' : 'text-[#363A3F]'
const textColor = theme === 'on' ? 'text-[#FFFFFF]' : 'text-[#1B212D]'
```

**Before:**
- Used `isDark` boolean prop
- Inconsistent color values
- Mixing Tailwind defaults with hex

**After:**
- ✅ Uses `theme: 'on' | 'off'` prop
- ✅ Exact Figma color values
- ✅ All colors defined explicitly

---

### ✅ **Props Changes**

#### StatCard Props

**Before:**
```tsx
interface StatCardProps {
  title: string
  amount: number
  currency: string
  change: { percentage: number; trend: 'up' | 'down' }  // ❌ Removed
  icon: React.ComponentType<{ className?: string }>
  isDark?: boolean  // ❌ Replaced
}
```

**After:**
```tsx
interface StatCardProps {
  title: string
  amount: number
  currency: string
  icon: React.ComponentType<{ className?: string }>
  theme: 'on' | 'off'  // ✅ New
}
```

**Changes:**
- ❌ Removed `change` prop (percentage/trend not displayed per Figma)
- ❌ Removed `isDark` boolean
- ✅ Added `theme: 'on' | 'off'` for explicit theme control

---

### ✅ **Usage in StatsGroup**

**Before:**
```tsx
<StatCard
  title="Total balance"
  amount={data.totalBalance?.amount || 0}
  currency={data.totalBalance?.currency || 'USD'}
  change={data.totalBalance?.change || { percentage: 0, trend: 'up' }}
  icon={Wallet}
  isDark={true}
/>
```

**After:**
```tsx
<StatCard
  title="Total balance"
  amount={data.totalBalance?.amount || 0}
  currency={data.totalBalance?.currency || 'USD'}
  icon={Wallet}
  theme="on"
/>
```

**Changes:**
- ❌ Removed `change` prop
- ✅ Changed `isDark={true}` to `theme="on"`
- ✅ Cleaner, more explicit API

---

## API Data Mapping

### ✅ **Data Intact**

All API data mappings remain **100% functional**:

```tsx
// Card 1: Total Balance (Theme ON)
<StatCard
  title="Total balance"
  amount={data.totalBalance?.amount || 0}
  currency={data.totalBalance?.currency || 'USD'}
  icon={Wallet}
  theme="on"
/>

// Card 2: Total Expense (Theme OFF)
<StatCard
  title="Total expense"
  amount={data.totalExpense?.amount || 0}
  currency={data.totalExpense?.currency || 'USD'}
  icon={CreditCard}
  theme="off"
/>

// Card 3: Total Savings (Theme OFF)
<StatCard
  title="Total savings"
  amount={data.totalSavings?.amount || 0}
  currency={data.totalSavings?.currency || 'USD'}
  icon={PiggyBank}
  theme="off"
/>
```

**API Response Structure:**
```json
{
  "totalBalance": {
    "amount": 125750.5,
    "currency": "TRY",
    "change": { "percentage": 12.5, "trend": "up" }
  },
  "totalExpense": {
    "amount": 45320.75,
    "currency": "TRY",
    "change": { "percentage": -8.3, "trend": "down" }
  },
  "totalSavings": {
    "amount": 80429.75,
    "currency": "TRY",
    "change": { "percentage": 15.2, "trend": "up" }
  },
  "lastUpdated": "2026-02-04T09:23:34.390Z"
}
```

**Displayed:**
- ✅ `amount` (formatted with currency)
- ✅ `currency` (TRY, USD, etc.)
- ❌ `change` (not displayed per Figma specs)
- ❌ `lastUpdated` (not displayed per Figma specs)

---

## Visual Comparison

### Before (Old Design)

```
┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐
│ 💰 Total balance      │  │ 💳 Total spending     │  │ 🐷 Total saved        │
│                        │  │                        │  │                        │
│ ₺125,750.50           │  │ ₺45,320.75            │  │ ₺80,429.75            │
│ ↑ 12.5%               │  │ ↓ 8.3%                │  │ ↑ 15.2%               │
└────────────────────────┘  └────────────────────────┘  └────────────────────────┘
```

**Issues:**
- ❌ Inconsistent spacing
- ❌ Wrong border radius
- ❌ No icon container/circle
- ❌ Showing trend data (not in Figma)
- ❌ Vertical layout (icon top, text bottom)

---

### After (Figma Specs)

```
┌─────────────────────────────────────────────────────────────────┐
│  716px Container (flex, gap 25px)                              │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐     │
│  │ ●  Total      │  │ ○  Total      │  │ ○  Total      │     │
│  │    balance    │  │    expense    │  │    savings    │     │
│  │    ₺125,750.50│  │    ₺45,320.75 │  │    ₺80,429.75 │     │
│  │  (42x42 icon) │  │  (42x42 icon) │  │  (42x42 icon) │     │
│  └───────────────┘  └───────────────┘  └───────────────┘     │
│   Theme ON          Theme OFF          Theme OFF              │
│   (Dark)            (Light)            (Light)                │
└─────────────────────────────────────────────────────────────────┘
```

**Improvements:**
- ✅ Exact dimensions (716px x 105px)
- ✅ Correct border radius (10px)
- ✅ Icon in circular container (42x42)
- ✅ Clean horizontal layout (icon left, text right)
- ✅ No trend data (per Figma)
- ✅ Precise spacing (15px gap between icon and text)

---

## Card Breakdown

### Card Structure (222px x 105px)

```
┌─────────────────────────────────────────┐
│  Padding: 20px (left/right)             │
│  Padding: 24px (top/bottom)             │
│                                          │
│  ┌──────┐  ┌──────────────────────┐   │
│  │ Icon │  │ Text Content Box     │   │
│  │ 42x42│  │ 125px x 57px         │   │
│  │      │  │                      │   │
│  │  ●   │  │ Label (14px)        │   │
│  │  💰  │  │ Total balance       │   │
│  │      │  │                      │   │
│  │      │  │ Amount (24px Bold)   │   │
│  │      │  │ ₺125,750.50         │   │
│  └──────┘  └──────────────────────┘   │
│     ↑            ↑                      │
│   Circle     Vertical flex             │
│   bg color   gap: 10px                 │
│                                          │
└─────────────────────────────────────────┘
     ↑                    ↑
  Horizontal flex      gap: 15px
```

---

## Theme Implementation Details

### Theme ON (Total Balance - Dark Card)

```tsx
// Colors
cardBg: '#363A3F'      // Dark grey card
circleBg: '#4E5257'    // Lighter grey circle
iconColor: '#C8EE44'   // Lime icon
textColor: '#FFFFFF'   // White text

// Visual
┌──────────────────────┐
│ ╔════════╗          │ #363A3F
│ ║  💰    ║ Total    │
│ ║ #C8EE44║ balance  │ White text
│ ╚════════╝          │
│ #4E5257  ₺125,750.50│
└──────────────────────┘
```

---

### Theme OFF (Expense & Savings - Light Cards)

```tsx
// Colors
cardBg: '#F8F8F8'      // Light grey card
circleBg: '#EBE8E8'    // Beige circle
iconColor: '#363A3F'   // Dark grey icon
textColor: '#1B212D'   // Primary dark text

// Visual
┌──────────────────────┐
│ ╔════════╗          │ #F8F8F8
│ ║  💳    ║ Total    │
│ ║ #363A3F║ expense  │ #1B212D text
│ ╚════════╝          │
│ #EBE8E8  ₺45,320.75 │
└──────────────────────┘
```

---

## Component Code Structure

### Final StatCard Component

```tsx
const StatCard = ({ title, amount, currency, icon: Icon, theme }: StatCardProps) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  })

  // Theme colors
  const cardBg = theme === 'on' ? 'bg-[#363A3F]' : 'bg-[#F8F8F8]'
  const circleBg = theme === 'on' ? 'bg-[#4E5257]' : 'bg-[#EBE8E8]'
  const iconColor = theme === 'on' ? 'text-[#C8EE44]' : 'text-[#363A3F]'
  const textColor = theme === 'on' ? 'text-[#FFFFFF]' : 'text-[#1B212D]'

  return (
    <div className={`w-[222px] h-[105px] ${cardBg} rounded-[10px] px-5 py-6 flex gap-[15px]`}>
      {/* Icon System: 42x42 Container */}
      <div className="w-[42px] h-[42px] flex items-center justify-center shrink-0">
        <div className={`w-[42px] h-[42px] ${circleBg} rounded-full flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>

      {/* Text Content Box: 125px x 57px */}
      <div className="w-[125px] h-[57px] flex flex-col gap-[10px]">
        <p className={`text-[14px] font-normal leading-[100%] ${textColor}`}>
          {title}
        </p>
        <p className={`text-[24px] font-bold leading-[100%] ${textColor}`}>
          {formatter.format(amount)}
        </p>
      </div>
    </div>
  )
}
```

---

## Loading State

### Before
```tsx
<div className="flex gap-[25px] mb-[30px]">
  {[1, 2, 3].map((i) => (
    <div key={i} className="w-[222px] h-[105px] bg-gray-200 rounded-[15px] animate-pulse" />
  ))}
</div>
```

### After
```tsx
<div className="w-[716px] h-[105px] flex gap-[25px] mb-[30px]">
  {[1, 2, 3].map((i) => (
    <div key={i} className="w-[222px] h-[105px] bg-gray-200 rounded-[10px] animate-pulse" />
  ))}
</div>
```

**Changes:**
- ✅ Container: Fixed width `716px`, height `105px`
- ✅ Skeleton cards: Border radius `10px` (was `15px`)

---

## Tailwind Classes Used

### Container
- `w-[716px]` - Fixed width
- `h-[105px]` - Fixed height
- `flex` - Flexbox layout
- `gap-[25px]` - Space between cards
- `mb-[30px]` - Bottom margin

### Card
- `w-[222px]` - Fixed width
- `h-[105px]` - Fixed height
- `rounded-[10px]` - Border radius
- `px-5` - Horizontal padding (20px)
- `py-6` - Vertical padding (24px)
- `flex` - Flexbox layout
- `gap-[15px]` - Space between icon and text

### Icon Container
- `w-[42px]` - Width
- `h-[42px]` - Height
- `shrink-0` - Prevent shrinking
- `rounded-full` - Circular shape

### Text Container
- `w-[125px]` - Fixed width
- `h-[57px]` - Fixed height
- `flex-col` - Vertical layout
- `gap-[10px]` - Space between label and amount

### Typography
- `text-[14px]` - Label size
- `text-[24px]` - Amount size
- `font-normal` - Regular weight (400)
- `font-bold` - Bold weight (700)
- `leading-[100%]` - Line height 100%

---

## Verification Checklist

### ✅ Dimensions
- [x] Container: 716px x 105px
- [x] Card: 222px x 105px
- [x] Icon container: 42px x 42px
- [x] Icon: 20px x 20px (w-5 h-5)
- [x] Text box: 125px x 57px

### ✅ Spacing
- [x] Cards gap: 25px
- [x] Icon to text gap: 15px
- [x] Label to amount gap: 10px
- [x] Card padding: 20px horizontal, 24px vertical

### ✅ Border Radius
- [x] Card: 10px
- [x] Icon circle: Full (rounded-full)

### ✅ Typography
- [x] Label: 14px, Regular (400), 100% line-height
- [x] Amount: 24px, Bold (700), 100% line-height
- [x] Font: Kumbh Sans (inherited)

### ✅ Colors - Theme ON
- [x] Card bg: #363A3F
- [x] Circle bg: #4E5257
- [x] Icon: #C8EE44
- [x] Text: #FFFFFF

### ✅ Colors - Theme OFF
- [x] Card bg: #F8F8F8
- [x] Circle bg: #EBE8E8
- [x] Icon: #363A3F
- [x] Text: #1B212D

### ✅ Data Integration
- [x] API data mapping intact
- [x] Currency formatting working
- [x] Optional chaining for safety
- [x] Default values provided

### ✅ Code Quality
- [x] No TypeScript errors
- [x] No linter warnings
- [x] Clean, readable code
- [x] Proper prop typing
- [x] Comments for clarity

---

## Summary

**File:** `src/features/dashboard/components/StatsGroup.tsx`

**Changes Made:**
1. ✅ Updated container dimensions (716px x 105px)
2. ✅ Fixed card dimensions and border radius (10px)
3. ✅ Implemented proper icon system (42x42 container + circle)
4. ✅ Added text content box (125px x 57px)
5. ✅ Applied exact typography specs (14px/24px, 100% line-height)
6. ✅ Implemented theme system (on/off instead of isDark)
7. ✅ Applied exact Figma colors for both themes
8. ✅ Removed trend display (per Figma specs)
9. ✅ Changed layout from vertical to horizontal
10. ✅ Maintained API data integration

**API Integration:**
- ✅ `totalBalance` → Card 1 (Theme ON)
- ✅ `totalExpense` → Card 2 (Theme OFF)
- ✅ `totalSavings` → Card 3 (Theme OFF)
- ✅ Currency formatting preserved
- ✅ Amount display preserved
- ❌ Trend data not displayed (per Figma)

**Result:** Component now matches Figma specifications exactly while maintaining full API data integration and functionality.
