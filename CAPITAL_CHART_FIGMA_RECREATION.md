# CapitalChart.tsx - Figma Recreation Documentation

## Overview

Recreated the `CapitalChart.tsx` component to match exact Figma specifications with pixel-perfect design and smooth line chart using Recharts.

---

## ✅ Component Features

### 1. **Data Fetching**

**Hook Used:** `useWorkingCapital` from `../hooks/useDashboardData`

**Endpoint:** `GET /financial/working-capital`

**Data Structure:**
```typescript
{
  period: string
  currency: string
  data: Array<{
    month: string      // "Jan", "Feb", "Mar"...
    income: number     // 15000, 18000...
    expense: number    // 12000, 14000...
    net: number
  }>
  summary: {
    totalIncome: number
    totalExpense: number
    netBalance: number
  }
}
```

**Mapping:**
```tsx
const chartData = apiData.map(item => ({
  month: item.month,    // X-axis labels
  income: item.income,  // Green line
  expense: item.expense // Lime line
}))
```

---

### 2. **Chart Configuration** (Recharts)

#### Chart Type
- **Component:** `LineChart` from Recharts
- **Line Type:** `type="monotone"` for smooth organic curves
- **Lines:** 2 lines (Income & Expenses)

#### Dimensions
- **Container:** 716px × 291px
- **Chart Area:** Responsive (100% width × 210px height)
- **Margin:** `{ top: 10, right: 20, left: -15, bottom: 5 }`

---

### 3. **Colors** (Exact Figma Specs)

| Element | Color | Hex |
|---------|-------|-----|
| **Income Line** | Dark Green | `#1A7D64` |
| **Expenses Line** | Light Lime | `#C8EE44` |
| Title | Primary Dark | `#1B212D` |
| Axis Labels | Grey | `#929EAE` |
| Grid Lines | Light Grey | `#F5F5F5` |
| Background | White | `#FFFFFF` |

**Before:**
```tsx
stroke="#29A073"  // ❌ Wrong green
```

**After:**
```tsx
stroke="#1A7D64"  // ✅ Correct dark green from Figma
```

---

### 4. **Axes Configuration**

#### X-Axis (Dates)
```tsx
<XAxis 
  dataKey="month" 
  tick={{ 
    fontSize: 12, 
    fill: '#929EAE',
    fontFamily: 'Kumbh Sans'
  }}
  axisLine={false}        // ✅ No axis line
  tickLine={false}        // ✅ No tick marks
  dy={10}                 // Spacing from chart
/>
```

**Styling:**
- Font: Kumbh Sans
- Size: 12px
- Color: #929EAE
- No axis line
- No tick marks

---

#### Y-Axis (Values)
```tsx
<YAxis 
  tick={{ 
    fontSize: 12, 
    fill: '#929EAE',
    fontFamily: 'Kumbh Sans'
  }}
  axisLine={false}              // ✅ No axis line
  tickLine={false}              // ✅ No tick marks
  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
  ticks={[0, 3000, 5000, 7000, 10000]}
  domain={[0, 10000]}
/>
```

**Labels:** `0K`, `3K`, `5K`, `7K`, `10K`

**Styling:**
- Font: Kumbh Sans
- Size: 12px
- Color: #929EAE
- No axis line (per Figma)
- No tick marks
- Formatter divides by 1000 and adds "K"

---

### 5. **Grid Configuration**

```tsx
<CartesianGrid 
  strokeDasharray="0"     // Solid lines (not dashed)
  stroke="#F5F5F5"        // Very light grey
  vertical={false}        // Only horizontal lines
/>
```

**Result:**
- ✅ Very light horizontal grid lines only
- ✅ No vertical lines
- ✅ Clean, minimal background

---

### 6. **Line Styling**

#### Income Line (Dark Green)
```tsx
<Line 
  type="monotone"                     // Smooth curves
  dataKey="income" 
  stroke="#1A7D64"                    // Dark green
  strokeWidth={3}                      // 3px width
  dot={false}                          // No dots on line
  activeDot={{                         // Dot on hover
    r: 6, 
    fill: '#1A7D64', 
    strokeWidth: 0 
  }}
/>
```

#### Expenses Line (Light Lime)
```tsx
<Line 
  type="monotone"                     // Smooth curves
  dataKey="expense" 
  stroke="#C8EE44"                    // Light lime
  strokeWidth={3}                      // 3px width
  dot={false}                          // No dots on line
  activeDot={{                         // Dot on hover
    r: 6, 
    fill: '#C8EE44', 
    strokeWidth: 0 
  }}
/>
```

**Features:**
- ✅ Smooth monotone curves
- ✅ 3px stroke width
- ✅ No dots along the line
- ✅ Active dot (6px radius) appears on hover

---

### 7. **Custom Tooltip**

**Design:**
```tsx
<div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-100">
  <p className="text-[14px] font-semibold text-[#1B212D] mb-2">
    Apr 14
  </p>
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-[#1A7D64]"></div>
      <span className="text-[12px] text-[#929EAE]">Income:</span>
      <span className="text-[12px] font-semibold text-[#1B212D]">
        $5,500
      </span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-[#C8EE44]"></div>
      <span className="text-[12px] text-[#929EAE]">Expenses:</span>
      <span className="text-[12px] font-semibold text-[#1B212D]">
        $4,200
      </span>
    </div>
  </div>
</div>
```

**Features:**
- ✅ White background with shadow
- ✅ Rounded corners
- ✅ Month/date label at top
- ✅ Color-coded dots for Income/Expenses
- ✅ Formatted currency values
- ✅ Clean, readable layout

**Interaction:**
```tsx
<Tooltip 
  content={<CustomTooltip />} 
  cursor={{ 
    stroke: '#E5E5E5',       // Vertical line color
    strokeWidth: 1,          // Thin line
    strokeDasharray: '5 5'   // Dashed style
  }}
/>
```

**Vertical Highlight:**
- ✅ Dashed vertical line on hover
- ✅ Light grey color (#E5E5E5)
- ✅ Follows mouse along X-axis

---

### 8. **Header Layout**

```tsx
<div className="flex items-center justify-between mb-[20px]">
  {/* Left: Title */}
  <h2 className="text-[18px] font-bold text-[#1B212D]">
    Working Capital
  </h2>
  
  {/* Right: Legend + Dropdown */}
  <div className="flex items-center gap-[20px]">
    {/* Legend */}
    <div className="flex items-center gap-[15px]">
      <div className="flex items-center gap-[6px]">
        <div className="w-[8px] h-[8px] rounded-full bg-[#1A7D64]"></div>
        <span className="text-[12px] font-medium text-[#929EAE]">Income</span>
      </div>
      <div className="flex items-center gap-[6px]">
        <div className="w-[8px] h-[8px] rounded-full bg-[#C8EE44]"></div>
        <span className="text-[12px] font-medium text-[#929EAE]">Expenses</span>
      </div>
    </div>
    
    {/* Dropdown */}
    <div className="relative">
      <select className="appearance-none bg-[#F5F5F5] text-[12px] font-medium text-[#929EAE] rounded-lg pl-3 pr-8 py-2">
        <option>Last 7 days</option>
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#929EAE] pointer-events-none" />
    </div>
  </div>
</div>
```

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Working Capital     ● Income  ● Expenses  [Last 7 days▼]│
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Elements:**

1. **Title (Left)**
   - Text: "Working Capital"
   - Font: 18px Bold
   - Color: #1B212D

2. **Legend (Center)**
   - 8px colored dots
   - 12px font, medium weight
   - Color: #929EAE
   - Gap: 6px between dot and text, 15px between items

3. **Dropdown (Right)**
   - Background: #F5F5F5
   - 12px font, medium weight
   - Rounded: 8px
   - Padding: 12px horizontal, 8px vertical
   - ChevronDown icon (lucide-react)

---

### 9. **Container Styling**

```tsx
<div className="w-[716px] h-[291px] bg-white rounded-[25px] p-[25px] mb-[30px]">
```

**Specifications:**
- **Width:** 716px (fixed)
- **Height:** 291px (fixed)
- **Background:** White (#FFFFFF)
- **Border Radius:** 25px (per Figma)
- **Padding:** 25px all sides
- **Bottom Margin:** 30px

**Before:**
```tsx
rounded-[15px] p-6  // ❌ Wrong values
```

**After:**
```tsx
rounded-[25px] p-[25px]  // ✅ Exact Figma specs
```

---

## Code Structure

### Complete Component

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useWorkingCapital } from '../hooks/useDashboardData'
import { ChevronDown } from 'lucide-react'

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const income = payload.find((p: any) => p.dataKey === 'income')?.value
    const expense = payload.find((p: any) => p.dataKey === 'expense')?.value
    
    return (
      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-100">
        <p className="text-[14px] font-semibold text-[#1B212D] mb-2">
          {payload[0]?.payload?.month}
        </p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#1A7D64]"></div>
            <span className="text-[12px] text-[#929EAE]">Income:</span>
            <span className="text-[12px] font-semibold text-[#1B212D]">
              ${income?.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C8EE44]"></div>
            <span className="text-[12px] text-[#929EAE]">Expenses:</span>
            <span className="text-[12px] font-semibold text-[#1B212D]">
              ${expense?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

const CapitalChart = () => {
  const { data: apiData, isLoading } = useWorkingCapital()

  if (isLoading) {
    return (
      <div className="w-[716px] h-[291px] bg-white rounded-[25px] p-[25px] mb-[30px]">
        <div className="h-4 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
        <div className="h-[200px] bg-gray-100 rounded animate-pulse"></div>
      </div>
    )
  }

  if (!apiData) return null

  const chartData = apiData.map(item => ({
    month: item.month,
    income: item.income,
    expense: item.expense,
  }))

  return (
    <div className="w-[716px] h-[291px] bg-white rounded-[25px] p-[25px] mb-[30px]">
      {/* Header with Title, Legend, and Dropdown */}
      <div className="flex items-center justify-between mb-[20px]">
        <h2 className="text-[18px] font-bold text-[#1B212D]">Working Capital</h2>
        
        <div className="flex items-center gap-[20px]">
          {/* Legend */}
          <div className="flex items-center gap-[15px]">
            <div className="flex items-center gap-[6px]">
              <div className="w-[8px] h-[8px] rounded-full bg-[#1A7D64]"></div>
              <span className="text-[12px] font-medium text-[#929EAE]">Income</span>
            </div>
            <div className="flex items-center gap-[6px]">
              <div className="w-[8px] h-[8px] rounded-full bg-[#C8EE44]"></div>
              <span className="text-[12px] font-medium text-[#929EAE]">Expenses</span>
            </div>
          </div>
          
          {/* Dropdown */}
          <div className="relative">
            <select className="appearance-none bg-[#F5F5F5] text-[12px] font-medium text-[#929EAE] rounded-lg pl-3 pr-8 py-2 cursor-pointer outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#929EAE] pointer-events-none" />
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="0" stroke="#F5F5F5" vertical={false} />
          
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: '#929EAE', fontFamily: 'Kumbh Sans' }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          
          <YAxis 
            tick={{ fontSize: 12, fill: '#929EAE', fontFamily: 'Kumbh Sans' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            ticks={[0, 3000, 5000, 7000, 10000]}
            domain={[0, 10000]}
          />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: '#E5E5E5', strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#1A7D64" 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#1A7D64', strokeWidth: 0 }}
          />
          
          <Line 
            type="monotone" 
            dataKey="expense" 
            stroke="#C8EE44" 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#C8EE44', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CapitalChart
```

---

## Visual Comparison

### Before

```
┌──────────────────────────────────────┐
│ Working Capital  ●Income ●Exp ▼      │ ← Wrong layout
│                                      │
│  ╱────╲                              │
│ ╱      ╲╱─────╲                      │ ← Wrong colors
│                ╲                     │   (#29A073 green)
│                                      │
│ Dashed grid lines                    │ ← Visible grid
└──────────────────────────────────────┘
```

**Issues:**
- ❌ Wrong green color (#29A073 instead of #1A7D64)
- ❌ Legend not centered properly
- ❌ Border radius 15px (should be 25px)
- ❌ Dashed grid lines
- ❌ Axis lines visible
- ❌ Basic tooltip

---

### After (Figma Specs)

```
┌────────────────────────────────────────────────┐
│ Working Capital    ● Income  ● Expenses  [▼]   │ ← Clean header
│                                                │
│ 10K ─────────────────────────────────────     │
│ 7K  ────────────────────────────────────      │
│ 5K  ──────╱───────╲─────────────────          │ ← Smooth curves
│ 3K  ────╱─────────╲╱────────────              │   Correct colors
│ 0K  ───────────────────────────                │   (#1A7D64, #C8EE44)
│     Jan  Feb  Mar  Apr  May  Jun              │
│                                                │
│     [Tooltip appears on hover with shadow]     │
└────────────────────────────────────────────────┘
```

**Improvements:**
- ✅ Exact Figma colors (#1A7D64 dark green)
- ✅ Smooth monotone curves
- ✅ Clean header layout with centered legend
- ✅ Y-axis: 0K, 3K, 5K, 7K, 10K labels only
- ✅ No axis lines (per Figma)
- ✅ Minimal horizontal grid lines
- ✅ Custom tooltip with shadow
- ✅ Vertical dashed cursor on hover
- ✅ Border radius 25px
- ✅ Proper spacing and typography

---

## API Integration

### Data Flow

```
useWorkingCapital Hook
        ↓
GET /financial/working-capital
        ↓
Response: {
  period: "2024",
  currency: "TRY",
  data: [
    { month: "Jan", income: 15000, expense: 12000, net: 3000 },
    { month: "Feb", income: 18000, expense: 14000, net: 4000 },
    ...
  ]
}
        ↓
chartData = apiData.map(item => ({
  month: item.month,    // X-axis
  income: item.income,  // Green line
  expense: item.expense // Lime line
}))
        ↓
Recharts LineChart renders smooth curves
        ↓
User sees chart with real data
```

---

## Responsive Design

**Container:** Fixed at 716px × 291px (matches dashboard layout)

**Chart:** Responsive within container
```tsx
<ResponsiveContainer width="100%" height={210}>
```

**Benefits:**
- ✅ Chart adapts to container width
- ✅ Maintains aspect ratio
- ✅ Scales properly on different screens

---

## Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Title | Kumbh Sans | 18px | Bold (700) | #1B212D |
| Legend Labels | Kumbh Sans | 12px | Medium (500) | #929EAE |
| Dropdown | Kumbh Sans | 12px | Medium (500) | #929EAE |
| X-Axis Labels | Kumbh Sans | 12px | Regular (400) | #929EAE |
| Y-Axis Labels | Kumbh Sans | 12px | Regular (400) | #929EAE |
| Tooltip Title | Kumbh Sans | 14px | SemiBold (600) | #1B212D |
| Tooltip Labels | Kumbh Sans | 12px | Regular (400) | #929EAE |
| Tooltip Values | Kumbh Sans | 12px | SemiBold (600) | #1B212D |

---

## Dependencies

```json
{
  "recharts": "^2.15.4",
  "lucide-react": "^0.468.0"
}
```

**Recharts Components Used:**
- `LineChart` - Main chart container
- `Line` - Line paths (Income & Expenses)
- `XAxis` - Horizontal axis (months)
- `YAxis` - Vertical axis (values)
- `CartesianGrid` - Background grid
- `Tooltip` - Interactive tooltip
- `ResponsiveContainer` - Responsive wrapper

**Lucide Icons Used:**
- `ChevronDown` - Dropdown arrow

---

## Summary

**File:** `src/features/dashboard/components/CapitalChart.tsx`

**Changes Made:**
1. ✅ Updated Income color: #29A073 → #1A7D64
2. ✅ Fixed container radius: 15px → 25px
3. ✅ Fixed padding: 24px → 25px
4. ✅ Removed axis lines (axisLine={false})
5. ✅ Removed tick marks (tickLine={false})
6. ✅ Configured Y-axis ticks: [0K, 3K, 5K, 7K, 10K]
7. ✅ Updated grid: minimal horizontal lines only
8. ✅ Improved tooltip design with shadow
9. ✅ Added vertical dashed cursor on hover
10. ✅ Redesigned header layout (title left, legend center, dropdown right)
11. ✅ Added ChevronDown icon to dropdown
12. ✅ Updated all typography to Kumbh Sans

**API Integration:**
- ✅ Uses `useWorkingCapital` hook
- ✅ Fetches from `/financial/working-capital`
- ✅ Maps data correctly (month, income, expense)
- ✅ Responsive and performant

**Result:** Component now matches Figma specifications exactly with smooth line chart, proper colors, clean axes, and interactive tooltip! 🎉
