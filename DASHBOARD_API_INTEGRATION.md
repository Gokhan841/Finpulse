# Dashboard API Integration Documentation

This document describes the complete integration of real API endpoints for the Dashboard.

## API Base URL
`https://case.nodelabs.dev/api/`

## Endpoints Integrated

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/dashboard/summary` | GET | Financial summary (balance, spending, saved) |
| `/dashboard/working-capital` | GET | Chart data (income/expense over time) |
| `/dashboard/transactions/recent` | GET | Recent transactions list |
| `/dashboard/wallet/cards` | GET | User's wallet cards |
| `/dashboard/transfers/scheduled` | GET | Scheduled transfers list |

## File Structure

### 1. Types Definition (`src/lib/types.ts`)

**Purpose**: Strict TypeScript types for all API responses

**Key Types**:
- `FinancialSummaryResponse` - Summary stats (totalBalance, totalSpending, totalSaved)
- `WorkingCapitalResponse` - Chart data with period, currency, data array, and summary
- `RecentTransactionsResponse` - Transaction list
- `WalletResponse` - Wallet cards with full details
- `ScheduledTransfersResponse` - Scheduled transfers

**Example Structure**:
```typescript
interface WorkingCapitalResponse {
  data: {
    period: string
    currency: string
    data: Array<{
      month: string
      income: number
      expense: number  // Note: singular 'expense', not 'expenses'
      net: number
    }>
    summary: {
      totalIncome: number
      totalExpense: number
      netBalance: number
    }
  }
}
```

### 2. API Client (`src/lib/api.ts`)

**Added Functions**:
```typescript
export const dashboardAPI = {
  getFinancialSummary: async () => Promise<FinancialSummary>
  getWorkingCapital: async () => Promise<WorkingCapitalData>
  getRecentTransactions: async () => Promise<Transaction[]>
  getWalletCards: async () => Promise<WalletCard[]>
  getScheduledTransfers: async () => Promise<ScheduledTransfer[]>
}
```

**Features**:
- All requests automatically include Bearer token
- Proper error handling via interceptors
- TypeScript return types for type safety
- Data extraction from nested API responses

### 3. Dashboard Hooks (`src/features/dashboard/hooks/useDashboardData.ts`)

**Updated to use real API**:
- `useDashboardSummary()` - Fetches financial summary
- `useWorkingCapital()` - Fetches chart data
- `useRecentTransactions()` - Fetches transactions
- `useWalletCards()` - Fetches wallet cards
- `useScheduledTransfers()` - Fetches scheduled transfers

**Features**:
- React Query integration for caching
- 5-minute stale time
- Automatic refetching
- Loading and error states

## Component Updates

### 1. StatsGroup Component

**Changes**:
- Uses real API data for totalBalance, totalSpending, totalSaved
- Added fallback values for safety (`amount || 0`)
- Currency from API response

### 2. CapitalChart Component

**Critical Changes**:
```typescript
// API returns data in nested structure
const chartData = apiData.data?.map(item => ({
  month: item.month,
  income: item.income,
  expense: item.expense  // API uses 'expense', not 'expenses'
}))
```

**Features**:
- Maps API data structure to Recharts format
- Displays period from API (e.g., "Last 7 days")
- Custom tooltip with formatted amounts
- Green line for income (#29A073)
- Lime line for expense (#C8EE44)

### 3. WalletSection Component

**Critical Logic**:

#### Card Number Masking:
```typescript
const maskCardNumber = (number: string) => {
  const cleaned = number.replace(/\s/g, '')
  const last4 = cleaned.slice(-4)
  return `**** **** **** ${last4}`
}
```

**Input**: `"5495 7381 3759 2321"`  
**Output**: `"**** **** **** 2321"`

#### Expiry Date Formatting:
```typescript
const formatExpiryDate = (month: number, year: number) => {
  const monthStr = month.toString().padStart(2, '0')
  const yearStr = year.toString().slice(-2)
  return `${monthStr}/${yearStr}`
}
```

**Input**: `month: 12, year: 2027`  
**Output**: `"12/27"`

#### Color Detection:
```typescript
const isDark = card.color?.toLowerCase().includes('dark') || 
               card.color?.toLowerCase().includes('black') ||
               card.color === '#1B212D'
```

**Features**:
- Uses card.cardNumber (not card.number)
- Uses card.expiryMonth and card.expiryYear
- Uses card.network for badge (VISA, Mastercard)
- Proper asset selection (BG.svg for dark, Effect.svg for light)

### 4. ScheduledTransfers Component

**Critical Logic**:

#### Date Formatting:
```typescript
const formatTransferDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
```

**Input**: `"2022-04-28T11:00:00Z"`  
**Output**: `"28 Apr 2022"`

#### Currency Symbol Mapping:
```typescript
const getCurrencySymbol = (currency: string) => {
  const symbols = {
    'USD': '$',
    'TRY': '₺',
    'EUR': '€',
    'GBP': '£'
  }
  return symbols[currency] || '$'
}
```

**Features**:
- Extracts time from ISO date string
- Displays currency symbol dynamically
- Shows negative amounts (e.g., -$435.00)
- Image fallback to ui-avatars.com

### 5. RecentTransactions Component

**Features**:
- Formats dates using date-fns
- Displays company logos (with fallback)
- Shows absolute amounts (no negative sign)
- Table layout with proper styling

## Data Flow

```
API Call → React Query Hook → Component → Display

Example:
dashboardAPI.getWalletCards()
  ↓
useWalletCards() hook
  ↓
WalletSection component
  ↓
Card component with masking & formatting
  ↓
Display: "**** **** **** 2321" | "12/27"
```

## Key Mappings

### API Field → Component Field

**Wallet Card**:
| API Field | Component Usage |
|-----------|----------------|
| `cardNumber` | Masked to `**** **** **** 2321` |
| `expiryMonth` + `expiryYear` | Formatted to `12/27` |
| `network` | Displayed as badge (VISA) |
| `color` | Determines card theme (dark/light) |
| `bank` | Displayed as card issuer |

**Working Capital**:
| API Field | Chart Usage |
|-----------|-------------|
| `data[].month` | X-axis labels |
| `data[].income` | Green line |
| `data[].expense` | Lime line (not 'expenses') |
| `period` | Dropdown display |

**Scheduled Transfer**:
| API Field | Display |
|-----------|---------|
| `date` | "28 Apr 2022 at 11:00" |
| `amount` | "-$435.00" |
| `currency` | Currency symbol (₺, $, €) |
| `image` | Avatar with fallback |

## Error Handling

### Network Errors:
- Toast notification via API interceptor
- Component shows loading skeleton

### Missing Data:
- Fallback values for amounts (`|| 0`)
- Default currency (`|| 'USD'`)
- Placeholder images for avatars

### Invalid Dates:
- Try/catch blocks in formatters
- Fallback to original string

### Image Load Failures:
```tsx
<img 
  src={transfer.image}
  onError={(e) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${name}&background=random`
  }}
/>
```

## Loading States

All components show skeleton loaders:
- **Stats**: 3 gray boxes (222px × 105px each)
- **Chart**: Gray box (716px × 291px)
- **Transactions**: 3-5 gray rows
- **Wallet**: Gray card box
- **Transfers**: 3-5 gray rows

## Caching Strategy

**React Query Configuration**:
- `staleTime`: 5 minutes
- `retry`: 1 attempt
- `refetchOnWindowFocus`: false

**Benefits**:
- Data cached for 5 minutes
- Reduced API calls
- Instant UI updates
- Background refetching

## Testing Checklist

✅ **Financial Summary**:
- [ ] Balance, Spending, Saved display correct amounts
- [ ] Currency symbols match API response
- [ ] Stats cards show correct colors

✅ **Working Capital Chart**:
- [ ] Income line (green) displays correctly
- [ ] Expense line (lime) displays correctly
- [ ] X-axis shows month labels from API
- [ ] Tooltip shows correct amounts
- [ ] Period dropdown shows API period

✅ **Recent Transactions**:
- [ ] Transaction name and business display
- [ ] Company logos load (or show fallback)
- [ ] Amounts show as positive ($420.84)
- [ ] Dates formatted correctly (14 Apr 2022)

✅ **Wallet Cards**:
- [ ] Card numbers masked: **** **** **** 2321
- [ ] Expiry dates formatted: 12/27
- [ ] Network badge shows (VISA, Mastercard)
- [ ] Dark/light theme based on color
- [ ] Correct assets loaded (chip, wifi, bg)

✅ **Scheduled Transfers**:
- [ ] Dates formatted: "28 Apr 2022 at 11:00"
- [ ] Currency symbols display correctly (₺, $)
- [ ] Amounts show with negative sign (-$435.00)
- [ ] Avatars load (or show fallback)

## API Response Examples

### Working Capital Response:
```json
{
  "data": {
    "period": "Last 7 days",
    "currency": "USD",
    "data": [
      { "month": "Apr 14", "income": 4500, "expense": 5200, "net": -700 },
      { "month": "Apr 15", "income": 6800, "expense": 4800, "net": 2000 }
    ],
    "summary": {
      "totalIncome": 35000,
      "totalExpense": 32000,
      "netBalance": 3000
    }
  }
}
```

### Wallet Response:
```json
{
  "data": {
    "cards": [
      {
        "id": "1",
        "name": "Maglo Gold Card",
        "type": "Credit",
        "cardNumber": "5495 7381 3759 2321",
        "bank": "Universal Bank",
        "network": "Visa",
        "expiryMonth": 12,
        "expiryYear": 2027,
        "color": "dark",
        "isDefault": true
      }
    ]
  }
}
```

### Scheduled Transfer Response:
```json
{
  "data": {
    "transfers": [
      {
        "id": "1",
        "name": "Saleh Ahmed",
        "image": "https://i.pravatar.cc/150?u=saleh",
        "date": "2022-04-28T11:00:00Z",
        "amount": -435,
        "currency": "USD",
        "status": "pending"
      }
    ]
  }
}
```

## Common Issues & Solutions

### Issue: Chart shows "expenses" undefined
**Solution**: API uses `expense` (singular), not `expenses`

### Issue: Card number shows with spaces
**Solution**: Use `maskCardNumber()` which removes spaces first

### Issue: Expiry shows as "12/2027"
**Solution**: Use `formatExpiryDate()` to get last 2 digits (12/27)

### Issue: Currency symbol not showing
**Solution**: Use `getCurrencySymbol()` for proper mapping

### Issue: Dates show as ISO strings
**Solution**: Use `formatTransferDate()` for proper formatting

## Performance Optimization

1. **React Query Caching**: 5-minute stale time reduces API calls
2. **Parallel Fetching**: All hooks fetch independently
3. **Lazy Loading**: Components only fetch when mounted
4. **Memoization**: React Query handles response caching
5. **Skeleton Loading**: Instant UI feedback

## Security

✅ Token automatically attached to all requests
✅ Interceptor handles 401 errors (auto-logout)
✅ No sensitive data in localStorage (only token)
✅ TypeScript prevents type errors
✅ Error messages don't expose internals

## Next Steps

- [ ] Add pagination for transactions
- [ ] Add filters for working capital period
- [ ] Add card selection (currently shows first card)
- [ ] Add refresh button for manual data update
- [ ] Add transaction search/filter
- [ ] Add transfer status indicators
- [ ] Implement real-time updates (WebSocket)
- [ ] Add export functionality (CSV/PDF)

## Summary

✅ All 5 dashboard endpoints integrated
✅ Real data displayed throughout dashboard
✅ Proper data mapping and formatting
✅ Error handling and fallbacks
✅ Loading states for all sections
✅ TypeScript type safety
✅ No linter errors
✅ Production-ready implementation
