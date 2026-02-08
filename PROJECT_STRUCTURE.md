# Fintech Case - Project Structure

## Configuration Files

### Tailwind CSS Setup
- ✅ `postcss.config.js` - PostCSS configuration with Tailwind and Autoprefixer
- ✅ `tailwind.config.js` - Tailwind configuration scanning all TSX/JSX files
- ✅ `src/index.css` - Main CSS file with Tailwind directives

### TypeScript Configuration
- ✅ `tsconfig.app.json` - Updated with path aliases (`@/*` → `./src/*`)
- ✅ `vite.config.ts` - Updated with path resolution for `@` alias

### Dependencies Added
- `tailwindcss`, `postcss`, `autoprefixer` - Styling
- `@hookform/resolvers` - Form validation with Zod
- `@types/node` - Node types for path resolution

## Project Architecture

```
src/
├── app/
│   ├── routes/
│   │   └── AppRouter.tsx           # Main router configuration
│   └── stores/
│       └── useAuthStore.ts         # Zustand auth store with persistence
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx              # Reusable button component (4 variants)
│   │   └── Input.tsx               # Reusable input with label & error
│   └── layout/
│       ├── AuthLayout.tsx          # Layout for login/register pages
│       └── DashboardLayout.tsx     # Layout for dashboard pages
│
├── features/
│   ├── auth/
│   │   ├── api/
│   │   │   └── authApi.ts          # Login, register, logout endpoints
│   │   ├── components/
│   │   │   └── LoginForm.tsx       # Login form with validation
│   │   ├── hooks/
│   │   │   └── useAuth.ts          # useLogin, useRegister, useLogout
│   │   └── types/
│   │       └── index.ts            # Auth type definitions
│   │
│   └── dashboard/
│       ├── api/
│       │   └── dashboardApi.ts     # Stats & transactions endpoints
│       ├── components/
│       │   └── StatsCard.tsx       # Reusable stats card component
│       ├── hooks/
│       │   └── useDashboard.ts     # Dashboard data hooks
│       └── types/
│           └── index.ts            # Dashboard type definitions
│
├── config/
│   └── api.ts                      # Axios instance with interceptors
│
├── lib/
│   └── utils.ts                    # cn() helper (clsx + tailwind-merge)
│
├── types/
│   └── index.ts                    # Global type definitions
│
├── main.tsx                        # App entry with providers
└── App.tsx                         # Root component with router
```

## Key Features Implemented

### 1. API Configuration (`src/config/api.ts`)
- Axios instance with base URL: `https://case.nodelabs.dev/api/`
- Request interceptor: Automatically adds Bearer token
- Response interceptor: Handles 401 errors (logout)

### 2. Authentication (`src/features/auth/`)
- **Store**: Zustand store with localStorage persistence
- **API**: Login, register, logout methods
- **Hooks**: `useLogin()`, `useRegister()`, `useLogout()`
- **Components**: `LoginForm` with react-hook-form + Zod validation
- **Types**: TypeScript interfaces for credentials and responses

### 3. Dashboard (`src/features/dashboard/`)
- **API**: Stats, transactions CRUD operations
- **Hooks**: React Query hooks for data fetching
- **Components**: `StatsCard` for displaying metrics
- **Types**: Transaction, DashboardStats, ChartData interfaces

### 4. UI Components (`src/components/ui/`)
- **Button**: 4 variants (default, outline, ghost, destructive), 3 sizes
- **Input**: With label, error message, and validation styling
- Built with Tailwind CSS using the `cn()` utility

### 5. Layouts (`src/components/layout/`)
- **AuthLayout**: Centered layout for auth pages
- **DashboardLayout**: Header + content area for dashboard

### 6. Routing (`src/app/routes/AppRouter.tsx`)
- React Router setup
- Currently redirects `/` to `/login`
- Ready for route expansion

### 7. Global Setup (`src/main.tsx`)
- React Query client configured
- Toast notifications (react-hot-toast)
- Strict mode enabled

## Utilities

### `cn()` Helper (`src/lib/utils.ts`)
Combines `clsx` and `tailwind-merge` for conditional Tailwind classes:

```tsx
<Button className={cn('custom-class', condition && 'conditional-class')} />
```

## Next Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Add routes** to `AppRouter.tsx`:
   - `/login` → Login page
   - `/register` → Register page
   - `/dashboard` → Dashboard page
   - Protected routes wrapper

4. **Create page components**:
   - `src/pages/LoginPage.tsx`
   - `src/pages/RegisterPage.tsx`
   - `src/pages/DashboardPage.tsx`

5. **Implement features**:
   - Transaction list component
   - Charts using Recharts
   - Transaction form with react-hook-form
   - Date filtering with date-fns

## Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand (auth) + React Query (server state)
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Dates**: date-fns

## Notes

- All imports use `@/` path alias (e.g., `@/components/ui/Button`)
- API base URL is configured for the case API
- Authentication token is stored in localStorage
- React Query handles caching, refetching, and loading states
- All forms use Zod schemas for validation
