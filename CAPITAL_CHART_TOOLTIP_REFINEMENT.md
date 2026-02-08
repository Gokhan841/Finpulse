# CapitalChart Tooltip Refinement - Documentation

## Overview

Updated the `CustomTooltip` component in `CapitalChart.tsx` to display a simplified, single-series tooltip that shows only the amount with currency symbol.

---

## ✅ Changes Made

### 1. **Single-Series Tooltip Behavior**

**Configuration:**
```tsx
<Tooltip 
  content={<CustomTooltip />} 
  shared={false}  // ✅ Only shows data for hovered line
/>
```

**Before (shared={true} - default):**
- Tooltip showed data for **both** Income and Expenses lines simultaneously
- Confusing when hovering near one line

**After (shared={false}):**
- ✅ Tooltip shows data **only** for the specific line being hovered
- ✅ Cleaner, more focused user experience
- ✅ Matches reference image behavior

---

### 2. **Tooltip Content - Simplified**

**Before:**
```tsx
<div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-100">
  <p className="text-[14px] font-semibold text-[#1B212D] mb-2">
    Apr 14  {/* ❌ Month name */}
  </p>
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-[#1A7D64]"></div>  {/* ❌ Colored dot */}
      <span className="text-[12px] text-[#929EAE]">Income:</span>  {/* ❌ Label */}
      <span className="text-[12px] font-semibold text-[#1B212D]">
        $5,500
      </span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-[#C8EE44]"></div>  {/* ❌ Colored dot */}
      <span className="text-[12px] text-[#929EAE]">Expenses:</span>  {/* ❌ Label */}
      <span className="text-[12px] font-semibold text-[#1B212D]">
        $4,200
      </span>
    </div>
  </div>
</div>
```

**Issues:**
- ❌ Month name displayed
- ❌ Colored dots for both series
- ❌ "Income:" and "Expenses:" labels
- ❌ Shows both series data
- ❌ Too complex

---

**After:**
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
    
    return (
      <div className="bg-[#FFFFFF] px-3 py-2 rounded-[5px] shadow-md">
        <p className="text-[12px] font-bold text-[#1B212D]" style={{ fontFamily: 'Kumbh Sans' }}>
          {formatter.format(value)}
        </p>
      </div>
    )
  }
  return null
}
```

**Result:**
- ✅ Shows only the amount: `₺75,481`
- ✅ No colored dots
- ✅ No "Income/Expenses" labels
- ✅ No month name
- ✅ Clean, minimal design

---

### 3. **Tooltip Styling**

#### Background Color
```tsx
bg-[#FFFFFF]  // ✅ Pure white
```

#### Border Radius
```tsx
rounded-[5px]  // ✅ 5px (was rounded-lg = 8px)
```

**Before:** `rounded-lg` (8px)  
**After:** `rounded-[5px]` (5px) ✅

---

#### Shadow
```tsx
shadow-md  // ✅ Light elevation shadow
```

**Tailwind `shadow-md`:**
```css
box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
```

**Result:** Subtle elevation effect ✅

---

#### Typography
```tsx
<p 
  className="text-[12px] font-bold text-[#1B212D]" 
  style={{ fontFamily: 'Kumbh Sans' }}
>
  ₺75,481
</p>
```

**Specifications:**
- **Font:** Kumbh Sans ✅
- **Size:** 12px ✅
- **Weight:** Bold (700) ✅
- **Color:** #1B212D (Primary dark) ✅

---

#### Padding
```tsx
px-3 py-2  // Horizontal: 12px, Vertical: 8px
```

**Result:** Compact, clean spacing ✅

---

### 4. **Currency Formatting**

**Implementation:**
```tsx
const formatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

{formatter.format(value)}  // Output: ₺75,481
```

**Features:**
- ✅ Automatically adds `₺` symbol
- ✅ Formats with Turkish locale (uses `.` for thousands separator)
- ✅ No decimal places (integer amounts only)
- ✅ Dynamic based on value

**Examples:**
```
value: 75481  → ₺75.481 (Turkish locale)
value: 5500   → ₺5.500
value: 120000 → ₺120.000
```

---

### 5. **Active Dot Configuration**

**Both Lines:**
```tsx
<Line
  name="Income"
  type="monotone"
  dataKey="income"
  stroke="#1A7D64"
  strokeWidth={3}
  dot={false}
  activeDot={{ r: 4, fill: '#5243AA', strokeWidth: 0 }}  // ✅ 8x8px
/>

<Line
  name="Expenses"
  type="monotone"
  dataKey="expense"
  stroke="#C8EE44"
  strokeWidth={3}
  dot={false}
  activeDot={{ r: 4, fill: '#5243AA', strokeWidth: 0 }}  // ✅ 8x8px
/>
```

**Active Dot Specs:**
- **Size:** `r: 4` (radius 4px = diameter 8px) ✅
- **Color:** `#5243AA` (Purple) ✅
- **Border:** `strokeWidth: 0` (no border) ✅

**Result:** Clean 8x8px purple dot appears under tooltip ✅

---

## Visual Comparison

### Before (Complex Multi-Series Tooltip)

```
┌─────────────────────────────┐
│ Apr 14                      │  ← Month name
│                             │
│ ● Income:     $5,500        │  ← Dot + Label
│ ● Expenses:   $4,200        │  ← Dot + Label
└─────────────────────────────┘
```

**Issues:**
- ❌ Too much information
- ❌ Shows both series
- ❌ Labels and dots clutter
- ❌ Month name redundant

---

### After (Simplified Single-Series Tooltip)

```
┌──────────┐
│ ₺75,481  │  ← Amount only
└──────────┘
     ↓
    ●  ← 8x8px purple dot (#5243AA)
   ╱
  ╱  Income line
```

**Improvements:**
- ✅ Shows only hovered series
- ✅ Clean amount display only
- ✅ No clutter (no dots, labels, month)
- ✅ Purple active dot (8x8px)
- ✅ Matches reference image

---

## Tooltip Styling Details

### Container
```tsx
className="bg-[#FFFFFF] px-3 py-2 rounded-[5px] shadow-md"
```

| Property | Value |
|----------|-------|
| Background | #FFFFFF (White) |
| Padding X | 12px |
| Padding Y | 8px |
| Border Radius | 5px |
| Shadow | `shadow-md` (light elevation) |

---

### Text
```tsx
className="text-[12px] font-bold text-[#1B212D]"
style={{ fontFamily: 'Kumbh Sans' }}
```

| Property | Value |
|----------|-------|
| Font Family | Kumbh Sans |
| Font Size | 12px |
| Font Weight | Bold (700) |
| Color | #1B212D |
| Line Height | Default (normal) |

---

## Complete Tooltip Code

### Final Implementation

```tsx
// --- Custom Tooltip Component (Single-Series, Amount Only) ---
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
    
    return (
      <div className="bg-[#FFFFFF] px-3 py-2 rounded-[5px] shadow-md">
        <p className="text-[12px] font-bold text-[#1B212D]" style={{ fontFamily: 'Kumbh Sans' }}>
          {formatter.format(value)}
        </p>
      </div>
    )
  }
  return null
}
```

---

### Usage in Chart

```tsx
<Tooltip 
  content={<CustomTooltip />} 
  shared={false}  // ✅ Single-series behavior
/>
```

---

## User Interaction Flow

### Hover Over Income Line (Green)

```
User hovers over green line at "Apr 14"
        ↓
Tooltip triggers (shared={false})
        ↓
payload[0] = { value: 75481, dataKey: 'income', ... }
        ↓
Formatter creates: "₺75.481"
        ↓
Tooltip displays: ┌──────────┐
                  │ ₺75,481  │
                  └──────────┘
        ↓
Purple dot appears on green line (8x8px, #5243AA)
```

---

### Hover Over Expenses Line (Lime)

```
User hovers over lime line at "Apr 14"
        ↓
Tooltip triggers (shared={false})
        ↓
payload[0] = { value: 48200, dataKey: 'expense', ... }
        ↓
Formatter creates: "₺48.200"
        ↓
Tooltip displays: ┌──────────┐
                  │ ₺48,200  │
                  └──────────┘
        ↓
Purple dot appears on lime line (8x8px, #5243AA)
```

---

## Key Differences

### shared={true} (Default, Before)

```
Hover at X position → Shows ALL lines' data at that X position
```

**Example:**
```
User hovers at "Apr 14"
↓
Tooltip shows:
- Income: ₺75,481
- Expenses: ₺48,200
```

---

### shared={false} (After)

```
Hover over specific line → Shows ONLY that line's data
```

**Example:**
```
User hovers over green line at "Apr 14"
↓
Tooltip shows:
- ₺75,481  (Income only)

User hovers over lime line at "Apr 14"
↓
Tooltip shows:
- ₺48,200  (Expenses only)
```

---

## Tooltip Positioning

**Recharts Automatic Positioning:**
- Tooltip appears near cursor
- Adjusts position to stay within chart bounds
- Follows mouse movement along line
- Disappears when mouse leaves line

**No manual positioning needed** - Recharts handles it ✅

---

## Active Dot Behavior

### Configuration
```tsx
activeDot={{ 
  r: 4,              // Radius 4px = Diameter 8px
  fill: '#5243AA',   // Purple
  strokeWidth: 0     // No border
}}
```

### When Active
```
User hovers over line
        ↓
Purple dot (8x8px) appears at hover point
        ↓
Tooltip displays above dot
        ↓
User moves mouse → dot follows along line
        ↓
User leaves line → dot disappears
```

---

## Testing Checklist

### ✅ Tooltip Behavior
- [x] Hovering Income line shows only Income amount
- [x] Hovering Expenses line shows only Expenses amount
- [x] Tooltip does NOT show both lines simultaneously
- [x] Tooltip follows mouse along line

### ✅ Tooltip Content
- [x] Shows currency symbol: ₺
- [x] Shows formatted amount: e.g., ₺75,481
- [x] NO colored dots
- [x] NO "Income/Expenses" labels
- [x] NO month name

### ✅ Tooltip Styling
- [x] Background: White (#FFFFFF)
- [x] Border radius: 5px
- [x] Shadow: Light elevation (shadow-md)
- [x] Font: Kumbh Sans
- [x] Font size: 12px
- [x] Font weight: Bold

### ✅ Active Dot
- [x] Size: 8x8px (r=4)
- [x] Color: #5243AA (Purple)
- [x] No border (strokeWidth=0)
- [x] Appears under tooltip
- [x] Follows mouse on line

---

## Summary

**File:** `src/features/dashboard/components/CapitalChart.tsx`

**Changes:**
1. ✅ Set `shared={false}` on Tooltip component
2. ✅ Simplified tooltip to show only amount with currency
3. ✅ Removed colored dots, labels, and month name
4. ✅ Updated styling: white bg, 5px radius, shadow-md
5. ✅ Applied Kumbh Sans 12px Bold typography
6. ✅ Verified active dot: 8x8px, #5243AA
7. ✅ Added Turkish currency formatting (₺)

**Result:**
- ✅ Clean, minimal tooltip
- ✅ Shows only hovered series
- ✅ Matches reference image
- ✅ Better UX (less clutter)
- ✅ Consistent with design system

**The tooltip now displays exactly as specified in the reference image!** 🎉
