# Custom Speech Bubble Tooltip - CapitalChart Documentation

## Overview

Implemented a custom SVG speech bubble tooltip with white outer/colored inner active dot for the `CapitalChart.tsx` component, matching the exact Figma design.

---

## ✅ Implementation Summary

### 1. **Custom Tooltip Bubble (SVG Speech Bubble)**

**Specifications:**
- **Dimensions:** 57px × 36px
- **Shape:** Rounded rectangle with triangular pointer at bottom center
- **Background:** #F0F3F6 (Light grey)
- **Shadow:** Drop shadow (Tailwind `drop-shadow-md`)

**SVG Implementation:**
```tsx
<svg 
  width="57" 
  height="36" 
  viewBox="0 0 57 36" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"
  className="drop-shadow-md"
>
  <path
    d="M 5 0 L 52 0 Q 57 0 57 5 L 57 25 Q 57 30 52 30 L 32 30 L 28.5 36 L 25 30 L 5 30 Q 0 30 0 25 L 0 5 Q 0 0 5 0 Z"
    fill="#F0F3F6"
  />
</svg>
```

**Path Breakdown:**
```
M 5 0           - Start at top-left (with 5px offset for rounding)
L 52 0          - Line to top-right (with 5px offset)
Q 57 0 57 5     - Quadratic curve for top-right corner
L 57 25         - Line down right side
Q 57 30 52 30   - Quadratic curve for bottom-right corner
L 32 30         - Line to right side of pointer
L 28.5 36       - Line to pointer tip (bottom center)
L 25 30         - Line to left side of pointer
L 5 30          - Line to bottom-left (with offset)
Q 0 30 0 25     - Quadratic curve for bottom-left corner
L 0 5           - Line up left side
Q 0 0 5 0       - Quadratic curve for top-left corner
Z               - Close path
```

**Visual:**
```
┌───────────────────────────────┐
│                               │  ← Rounded top corners
│           ₺5,500              │  ← Text centered
│                               │
└─────────────▼─────────────────┘  ← Triangle pointer bottom center
```

---

### 2. **Tooltip Typography**

**Text Positioning:**
```tsx
<div 
  className="absolute top-[6px] left-0 w-full flex items-center justify-center"
  style={{ height: '24px' }}
>
  <p 
    className="text-[12px] font-medium text-[#1B212D] leading-[100%]"
    style={{ fontFamily: 'Kumbh Sans' }}
  >
    {formattedValue}
  </p>
</div>
```

**Specifications:**
- **Font:** Kumbh Sans ✅
- **Size:** 12px ✅
- **Weight:** Medium (500) ✅
- **Color:** #1B212D ✅
- **Line Height:** 100% ✅
- **Position:** Top 6px, centered horizontally ✅

**Content:**
- ✅ Shows only amount with currency symbol
- ❌ No colored dots
- ❌ No "Income/Expenses" labels
- ❌ No month name

---

### 3. **Single-Series Behavior**

**Configuration:**
```tsx
<Tooltip 
  content={<CustomTooltip />} 
  shared={false}  // ✅ Critical: Single-series only
/>
```

**Behavior:**
```
Hover over Income line (Green)
        ↓
Tooltip shows: ₺75,481 (Income value only)
        ↓
Purple dot on Income line

Hover over Expenses line (Lime)
        ↓
Tooltip shows: ₺48,200 (Expenses value only)
        ↓
Purple dot on Expenses line
```

**Result:** ✅ Tooltip dynamically shows only the hovered line's data

---

### 4. **Custom Active Dot (Nested Circles)**

**Component:**
```tsx
const CustomActiveDot = (props: any) => {
  const { cx, cy, stroke } = props
  
  return (
    <g>
      {/* Outer circle: 12x12px white */}
      <circle 
        cx={cx} 
        cy={cy} 
        r={6} 
        fill="#FFFFFF" 
        stroke="none"
      />
      {/* Inner circle: 8x8px colored */}
      <circle 
        cx={cx} 
        cy={cy} 
        r={4} 
        fill={stroke || '#5243AA'} 
        stroke="none"
      />
    </g>
  )
}
```

**Structure:**
```
     ┌────────┐
     │  ○○○○  │  ← 12x12px white outer circle (r=6)
     │  ○██○  │  ← 8x8px colored inner circle (r=4)
     │  ○○○○  │
     └────────┘
```

**Properties:**
- **Outer Circle:** Radius 6px (12px diameter), white (#FFFFFF)
- **Inner Circle:** Radius 4px (8px diameter), matches line color
- **Position:** Centered at `(cx, cy)` from Recharts
- **No Border:** `stroke="none"` on both circles

---

### 5. **Line Configuration**

**Income Line:**
```tsx
<Line
  name="Income"
  type="monotone"
  dataKey="income"
  stroke="#1A7D64"           // Green line
  strokeWidth={3}
  dot={false}
  activeDot={<CustomActiveDot />}  // ✅ Custom nested circles
/>
```

**Expenses Line:**
```tsx
<Line
  name="Expenses"
  type="monotone"
  dataKey="expense"
  stroke="#C8EE44"           // Lime line
  strokeWidth={3}
  dot={false}
  activeDot={<CustomActiveDot />}  // ✅ Custom nested circles
/>
```

**Result:**
- ✅ Custom active dot appears on hover
- ✅ Dot color matches line color (`stroke` prop passed automatically)
- ✅ 12x12px outer white circle
- ✅ 8x8px inner colored circle

---

### 6. **Chart Container Padding**

**Updated Margin:**
```tsx
<LineChart data={apiData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
```

**Before:** `top: 0` (tooltip cut off at top)  
**After:** `top: 20` (20px space for tooltip) ✅

**Result:** Tooltip has enough space at the top of the chart container

---

## Complete Tooltip Code

### Final CustomTooltip Component

```tsx
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length > 0) {
    const value = payload[0].value
    
    // Format currency
    const formatter = new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    
    const formattedValue = formatter.format(value)
    
    return (
      <div className="relative" style={{ width: '57px', height: '36px' }}>
        {/* Speech Bubble SVG (57x36) */}
        <svg 
          width="57" 
          height="36" 
          viewBox="0 0 57 36" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          {/* Rounded rectangle with triangle pointer */}
          <path
            d="M 5 0 L 52 0 Q 57 0 57 5 L 57 25 Q 57 30 52 30 L 32 30 L 28.5 36 L 25 30 L 5 30 Q 0 30 0 25 L 0 5 Q 0 0 5 0 Z"
            fill="#F0F3F6"
          />
        </svg>
        
        {/* Text overlay - centered */}
        <div 
          className="absolute top-[6px] left-0 w-full flex items-center justify-center"
          style={{ height: '24px' }}
        >
          <p 
            className="text-[12px] font-medium text-[#1B212D] leading-[100%]"
            style={{ fontFamily: 'Kumbh Sans' }}
          >
            {formattedValue}
          </p>
        </div>
      </div>
    )
  }
  return null
}
```

---

### Final CustomActiveDot Component

```tsx
const CustomActiveDot = (props: any) => {
  const { cx, cy, stroke } = props
  
  return (
    <g>
      {/* Outer circle: 12x12px white */}
      <circle 
        cx={cx} 
        cy={cy} 
        r={6} 
        fill="#FFFFFF" 
        stroke="none"
      />
      {/* Inner circle: 8x8px colored */}
      <circle 
        cx={cx} 
        cy={cy} 
        r={4} 
        fill={stroke || '#5243AA'} 
        stroke="none"
      />
    </g>
  )
}
```

---

## Visual Breakdown

### Tooltip Structure (57x36px)

```
        57px
    ┌─────────┐
36px│ ₺5,500  │  ← Text (12px Medium, Kumbh Sans)
    │         │     Position: top 6px, centered
    └────▼────┘  ← Triangle pointer (bottom center)
```

**Layers:**
1. **SVG Base:** Speech bubble shape with rounded corners and pointer
2. **Text Overlay:** Absolute positioned text centered in bubble

---

### Active Dot Structure (12x12px)

```
    Outer: 12x12px
    ┌──────────┐
    │  ⚪⚪⚪⚪  │  ← White circle (r=6)
    │  ⚪🟣🟣⚪  │  ← Colored inner (r=4)
    │  ⚪🟣🟣⚪  │     Color matches line
    │  ⚪⚪⚪⚪  │
    └──────────┘
```

**Colors:**
- **Income Line:** White outer + #1A7D64 inner (dark green)
- **Expenses Line:** White outer + #C8EE44 inner (lime)

---

## Hover Interaction Flow

### User Hovers Over Income Line

```
Mouse moves over green line at "Apr 14"
        ↓
Recharts detects hover
        ↓
shared={false} → Only Income data in payload
        ↓
CustomTooltip receives: payload[0] = { value: 75481, ... }
        ↓
Formatter creates: "₺75.481"
        ↓
Speech bubble renders with text
        ┌──────────┐
        │ ₺75,481  │
        └─────▼────┘
             ↓
CustomActiveDot renders at (cx, cy)
        ┌────┐
        │ ⚪ │  ← 12px white
        │⚪🟢⚪│  ← 8px green (#1A7D64)
        │ ⚪ │
        └────┘
             ↓
User sees tooltip + dot on green line
```

---

### User Hovers Over Expenses Line

```
Mouse moves over lime line at "Apr 14"
        ↓
Recharts detects hover
        ↓
shared={false} → Only Expenses data in payload
        ↓
CustomTooltip receives: payload[0] = { value: 48200, ... }
        ↓
Formatter creates: "₺48.200"
        ↓
Speech bubble renders with text
        ┌──────────┐
        │ ₺48,200  │
        └─────▼────┘
             ↓
CustomActiveDot renders at (cx, cy)
        ┌────┐
        │ ⚪ │  ← 12px white
        │⚪🟡⚪│  ← 8px lime (#C8EE44)
        │ ⚪ │
        └────┘
             ↓
User sees tooltip + dot on lime line
```

---

## SVG Path Explanation

### Speech Bubble Shape

```svg
M 5 0           - Move to (5, 0) - top-left with offset
L 52 0          - Line to (52, 0) - top-right with offset
Q 57 0 57 5     - Quadratic curve to (57, 5) - rounded top-right corner
L 57 25         - Line to (57, 25) - right edge
Q 57 30 52 30   - Quadratic curve to (52, 30) - rounded bottom-right corner
L 32 30         - Line to (32, 30) - right side of pointer
L 28.5 36       - Line to (28.5, 36) - pointer tip (extends 6px down)
L 25 30         - Line to (25, 30) - left side of pointer
L 5 30          - Line to (5, 30) - bottom-left with offset
Q 0 30 0 25     - Quadratic curve to (0, 25) - rounded bottom-left corner
L 0 5           - Line to (0, 5) - left edge
Q 0 0 5 0       - Quadratic curve to (5, 0) - rounded top-left corner
Z               - Close path
```

**Key Features:**
1. **Rounded Corners:** 5px radius using quadratic curves (Q command)
2. **Triangle Pointer:** 
   - Starts at x=25 (left edge)
   - Points down to x=28.5, y=36 (tip)
   - Ends at x=32 (right edge)
   - Width: 7px, Height: 6px
3. **Background:** Filled with #F0F3F6

---

## Tooltip Positioning

### Absolute Layout

```tsx
<div className="relative" style={{ width: '57px', height: '36px' }}>
  {/* SVG base */}
  <svg>...</svg>
  
  {/* Text overlay - absolute positioned */}
  <div className="absolute top-[6px] left-0 w-full flex items-center justify-center">
    <p>₺5,500</p>
  </div>
</div>
```

**Text Position:**
- **Top:** 6px from bubble top
- **Horizontal:** Centered using `justify-center`
- **Height:** 24px container (vertical centering)

**Result:** Text perfectly centered within the 30px tall bubble (30px - 6px top = 24px for content)

---

## Active Dot Implementation

### Component Structure

```tsx
const CustomActiveDot = (props: any) => {
  const { cx, cy, stroke } = props  // Recharts passes these automatically
  
  return (
    <g>
      {/* Outer circle: 12x12px white */}
      <circle cx={cx} cy={cy} r={6} fill="#FFFFFF" stroke="none" />
      
      {/* Inner circle: 8x8px colored */}
      <circle cx={cx} cy={cy} r={4} fill={stroke || '#5243AA'} stroke="none" />
    </g>
  )
}
```

**Props from Recharts:**
- `cx` - X coordinate on chart
- `cy` - Y coordinate on chart
- `stroke` - Line color (auto-passed by Recharts)

**Rendering:**
1. **Outer Circle:** 
   - Radius: 6px (diameter: 12px)
   - Fill: #FFFFFF (white)
   - No stroke
   
2. **Inner Circle:**
   - Radius: 4px (diameter: 8px)
   - Fill: `stroke` prop (line color) or fallback #5243AA
   - No stroke
   - Centered within outer circle (same cx, cy)

---

### Dot Color Logic

**Income Line:**
```tsx
<Line stroke="#1A7D64" activeDot={<CustomActiveDot />} />
```

**When active:**
- Recharts passes `stroke="#1A7D64"` to `CustomActiveDot`
- Inner circle fill: `#1A7D64` (dark green) ✅

**Expenses Line:**
```tsx
<Line stroke="#C8EE44" activeDot={<CustomActiveDot />} />
```

**When active:**
- Recharts passes `stroke="#C8EE44"` to `CustomActiveDot`
- Inner circle fill: `#C8EE44` (lime) ✅

**Result:** Inner dot automatically matches the line color! ✅

---

## Container Padding Fix

### Chart Margin

**Before:**
```tsx
<LineChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
```

**Issue:** Tooltip cut off at top of chart

---

**After:**
```tsx
<LineChart margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
```

**Result:** 20px top margin provides space for tooltip ✅

---

## Currency Formatting

### Turkish Locale

```tsx
const formatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})
```

**Examples:**
```
75481  → ₺75.481  (Turkish format uses . for thousands)
5500   → ₺5.500
120000 → ₺120.000
```

**Features:**
- ✅ Automatic `₺` symbol
- ✅ Turkish formatting (dot separator)
- ✅ No decimals (integer only)
- ✅ Proper spacing

---

## Complete Visual Example

### Hover Interaction

```
Chart with Income (green) and Expenses (lime) lines
        ↓
User hovers over green line at "Apr 14"
        ↓

       ┌──────────┐
       │ ₺75,481  │  ← Speech bubble (57x36, #F0F3F6)
       └─────▼────┘  ← Triangle pointer
            ↓
           ⚪        ← 12x12px white outer
          ⚪🟢⚪       ← 8x8px green inner (#1A7D64)
           ⚪
            ↓
    ───────●────────  ← Green line (#1A7D64)
```

---

### Side-by-Side Comparison

**Income Hover:**
```
Tooltip: ₺75,481
Dot: White (12px) + Green inner (8px)
```

**Expenses Hover:**
```
Tooltip: ₺48,200
Dot: White (12px) + Lime inner (8px)
```

---

## Technical Details

### SVG Drop Shadow

```tsx
className="drop-shadow-md"
```

**Tailwind `drop-shadow-md`:**
```css
filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) 
        drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));
```

**Result:** Subtle shadow creates elevation effect ✅

---

### Tooltip Dimensions

| Property | Value | Note |
|----------|-------|------|
| Width | 57px | Fixed |
| Height | 36px | Fixed (30px bubble + 6px pointer) |
| Border Radius | 5px | Corners (via SVG Q curves) |
| Pointer Width | 7px | Triangle base |
| Pointer Height | 6px | Triangle height |

---

### Active Dot Dimensions

| Property | Value | Note |
|----------|-------|------|
| Outer Diameter | 12px | White circle (r=6) |
| Inner Diameter | 8px | Colored circle (r=4) |
| Gap | 2px | Calculated (6-4=2px on each side) |

---

## Summary

**File:** `src/features/dashboard/components/CapitalChart.tsx`

**New Components:**
1. ✅ `CustomTooltip` - SVG speech bubble with text overlay
2. ✅ `CustomActiveDot` - Nested circles (12px white + 8px colored)

**Configuration Updates:**
1. ✅ `Tooltip shared={false}` - Single-series behavior
2. ✅ `LineChart margin={{ top: 20 }}` - Space for tooltip
3. ✅ `activeDot={<CustomActiveDot />}` - Custom nested dot

**Specifications Met:**
- ✅ Speech bubble: 57x36px, #F0F3F6, rounded corners, triangle pointer
- ✅ Text: Kumbh Sans, 12px, Medium, #1B212D, centered
- ✅ Shows only amount with currency (₺5,500)
- ✅ Single-series behavior (shows only hovered line)
- ✅ Active dot: 12x12px white + 8x8px colored
- ✅ Dot color matches line color
- ✅ Drop shadow on bubble
- ✅ Proper spacing and positioning

**Result:** The tooltip now matches the exact Figma design with custom speech bubble shape and nested circle active dot! 🎉
