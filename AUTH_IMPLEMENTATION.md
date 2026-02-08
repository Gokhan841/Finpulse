# Authentication System Implementation

This document describes the complete authentication system implemented for the FinTech application.

## API Configuration

**Base URL**: `https://case.nodelabs.dev/api/`

### Endpoints Used:
1. `POST /users/register` - Create new user account
2. `POST /users/login` - Authenticate and receive token
3. `GET /users/profile` - Fetch current user details

## Implementation Details

### 1. API Client (`src/lib/api.ts`)

**Features**:
- Axios instance with base URL configuration
- Request interceptor: Automatically attaches `Authorization: Bearer <token>` header
- Response interceptor: Handles 401 errors (auto-logout), displays error toasts
- TypeScript types for all API requests and responses

**Token Storage**: LocalStorage (`authToken` key)

### 2. Auth Context (`src/context/AuthContext.tsx`)

**State Management**:
- `user`: Current user object (name, email, avatar)
- `isAuthenticated`: Boolean authentication status
- `loading`: Initial auth check loading state

**Methods**:
- `login(data)`: Authenticate user with email/password
- `register(data)`: Create new user account
- `logout()`: Clear token and user state
- `updateUser(user)`: Update user data

**Initialization**:
- On app start, checks for stored token
- If token exists, fetches user profile via `GET /users/profile`
- Sets authentication state accordingly

### 3. Protected Routes (`src/components/ProtectedRoute.tsx`)

**Functionality**:
- Guards authenticated routes (Dashboard, etc.)
- Redirects unauthenticated users to `/login`
- Shows loading spinner during auth check

### 4. Auth Redirect (`src/app/routes/AppRouter.tsx`)

**Functionality**:
- Prevents authenticated users from accessing login/register pages
- Redirects authenticated users to `/dashboard`
- Shows loading spinner during auth check

### 5. Updated Components

#### LoginForm (`src/features/auth/components/LoginForm.tsx`)
- Uses `useAuth()` hook
- Calls real API via `login()` method
- Navigates to `/dashboard` on success
- Error handling via toast notifications

#### RegisterForm (`src/features/auth/components/RegisterForm.tsx`)
- Uses `useAuth()` hook
- Calls real API via `register()` method
- Field name changed from `fullName` to `name` (API requirement)
- Navigates to `/dashboard` on success

#### DashboardLayout (`src/components/layout/DashboardLayout.tsx`)
- Displays real user name from `user.name`
- Displays user avatar with fallback logic:
  - Primary: Uses `user.avatar` from API if available
  - Fallback: Generates avatar using `https://ui-avatars.com/api/?name=${user.name}&background=random`
  - Error fallback: Default "User" avatar
- Logout button calls `logout()` and redirects to `/login`

### 6. Main Entry Point (`src/main.tsx`)

**Provider Hierarchy**:
```tsx
<QueryClientProvider>
  <AuthProvider>
    <App />
    <Toaster />
  </AuthProvider>
</QueryClientProvider>
```

## User Flow

### Registration:
1. User fills registration form (name, email, password)
2. Form validation via Zod schema
3. API call to `POST /users/register`
4. Token stored in LocalStorage
5. User state updated in AuthContext
6. Redirect to `/dashboard`

### Login:
1. User fills login form (email, password)
2. Form validation via Zod schema
3. API call to `POST /users/login`
4. Token stored in LocalStorage
5. User state updated in AuthContext
6. Redirect to `/dashboard`

### Auto-Login (Page Refresh):
1. App checks for token in LocalStorage
2. If found, calls `GET /users/profile`
3. User state populated with API response
4. User remains logged in

### Logout:
1. User clicks logout button
2. Token removed from LocalStorage
3. User state cleared
4. Redirect to `/login`

### Route Protection:
1. User tries to access `/dashboard`
2. ProtectedRoute checks `isAuthenticated`
3. If false, redirect to `/login`
4. If true, render dashboard

## Error Handling

### Network Errors:
- Display toast: "Network error. Please check your connection."

### 401 Unauthorized:
- Auto-logout (clear token and user state)
- Display toast: "Session expired. Please login again."
- Redirect to `/login`

### API Errors:
- Display error message from API response
- Fallback to generic error message if none provided

## Avatar Logic

```typescript
const getAvatarUrl = () => {
  // 1. Try API avatar
  if (user?.avatar) {
    return user.avatar
  }
  
  // 2. Generate from user name
  if (user?.name) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
  }
  
  // 3. Default fallback
  return 'https://ui-avatars.com/api/?name=User&background=random'
}
```

### Image Error Handling:
```tsx
<img 
  src={getAvatarUrl()} 
  onError={(e) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`
  }}
/>
```

## TypeScript Types

```typescript
interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
}

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
}

interface AuthResponse {
  token: string
  user: User
}
```

## Testing the Implementation

### Register a New User:
1. Navigate to `/register`
2. Fill in name, email, password
3. Submit form
4. Should see toast: "Registration successful!"
5. Should be redirected to `/dashboard`
6. Should see your name in header

### Login:
1. Navigate to `/login`
2. Enter registered email and password
3. Submit form
4. Should see toast: "Login successful!"
5. Should be redirected to `/dashboard`
6. Should see your name and avatar in header

### Logout:
1. Click "Logout" in sidebar
2. Should see toast: "Logged out successfully"
3. Should be redirected to `/login`

### Auto-Login:
1. Login to dashboard
2. Refresh the page
3. Should remain logged in
4. Should still see your name in header

## Security Features

✅ Token stored in LocalStorage (can be upgraded to httpOnly cookies for production)
✅ Token automatically attached to all API requests
✅ Auto-logout on 401 errors
✅ Protected routes prevent unauthorized access
✅ Password minimum length validation (6 characters)
✅ Email format validation
✅ Error messages don't expose sensitive information

## Files Modified/Created

### Created:
- `src/lib/api.ts` - API client with interceptors
- `src/context/AuthContext.tsx` - Auth state management
- `src/components/ProtectedRoute.tsx` - Route protection
- `AUTH_IMPLEMENTATION.md` - This documentation

### Modified:
- `src/main.tsx` - Added AuthProvider
- `src/app/routes/AppRouter.tsx` - Protected routes & auth redirect
- `src/features/auth/components/LoginForm.tsx` - Real API integration
- `src/features/auth/components/RegisterForm.tsx` - Real API integration
- `src/components/layout/DashboardLayout.tsx` - Real user data display

## Next Steps (Optional Enhancements)

- [ ] Add "Remember Me" functionality
- [ ] Implement password reset flow
- [ ] Add email verification
- [ ] Implement refresh token mechanism
- [ ] Add loading states to avatar images
- [ ] Implement user profile editing
- [ ] Add OAuth social login (Google, GitHub)
- [ ] Implement role-based access control
- [ ] Add session timeout warnings
- [ ] Store tokens in httpOnly cookies (more secure)
