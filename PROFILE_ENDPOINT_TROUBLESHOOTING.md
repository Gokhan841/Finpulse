# Profile Endpoint Troubleshooting

## Issue

**Error:**
```
GET https://case.nodelabs.dev/api/auth/me 404 (Not Found)
```

**Previous Attempts:**
- ❌ `/users/me` → 404 Not Found
- ❌ `/auth/me` → 404 Not Found

**Impact:**
- Users are redirected to login on page refresh
- Cannot maintain logged-in state
- Poor user experience

---

## Current Fix Attempt

### Updated Endpoint: `/users/profile`

**Reasoning:**
- Login uses: `POST /users/login` ✅
- Register uses: `POST /users/register` ✅
- Profile should follow same pattern: `GET /users/profile` ⚠️ (testing)

**File: `src/lib/api.ts` (Line 129)**

```tsx
// Get current user profile
getProfile: async (): Promise<User> => {
  const response = await api.get<{ success: boolean; data: User }>('/users/profile')
  return response.data.data
},
```

---

## Test This Endpoint

### 1. Clear Previous State
```bash
# Open DevTools Console
localStorage.clear()
```

### 2. Fresh Login
```
1. Go to /login
2. Enter credentials
3. Click "Sign In"
4. Watch Network tab for:
   - POST /users/login → 200 ✅
   - GET /users/profile → Should be 200 (not 404)
```

### 3. Check Console
```
Look for:
✅ Token stored
✅ GET /users/profile → 200 OK
✅ User data received
```

---

## If `/users/profile` Still Fails (404)

If the endpoint still returns 404, we have **two alternative solutions**:

---

### **Alternative 1: Store User Data from Login (Recommended)**

The login response already includes complete user data:

```json
{
  "data": {
    "accessToken": "eyJ...",
    "user": {
      "id": "123",
      "fullName": "Mahfuzul Nabil",
      "email": "user@example.com",
      "avatar": "..."
    }
  }
}
```

**Solution:** Store user data in localStorage alongside token.

#### Update `src/context/AuthContext.tsx`

**Modify Login Function (Lines 58-96):**

```tsx
const login = async (data: LoginData) => {
  try {
    const response = await authAPI.login(data)
    
    // Store both token AND user data
    localStorage.setItem('authToken', response.token)
    localStorage.setItem('userData', JSON.stringify(response.user))  // ✅ Add this
    
    setUser(response.user)
    setIsAuthenticated(true)
    
    toast.success('Login successful!')
  } catch (error: any) {
    const message = error.response?.data?.message || 'Login failed'
    toast.error(message)
    throw error
  }
}
```

**Modify Register Function (Lines 99-126):**

```tsx
const register = async (data: RegisterData) => {
  try {
    const response = await authAPI.register(data)
    
    // Store both token AND user data
    localStorage.setItem('authToken', response.token)
    localStorage.setItem('userData', JSON.stringify(response.user))  // ✅ Add this
    
    setUser(response.user)
    setIsAuthenticated(true)
    
    toast.success('Registration successful!')
  } catch (error: any) {
    const message = error.response?.data?.message || 'Registration failed'
    toast.error(message)
    throw error
  }
}
```

**Modify initAuth useEffect (Lines 35-56):**

```tsx
useEffect(() => {
  const initAuth = async () => {
    const token = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('userData')
    
    if (token && storedUser) {
      try {
        // Parse stored user data
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsAuthenticated(true)
        
        // Optional: Validate token by making a test API call
        // await authAPI.getProfile()  // Only if endpoint exists
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
        setUser(null)
        setIsAuthenticated(false)
      }
    }
    
    setLoading(false)
  }

  initAuth()
}, [])
```

**Modify Logout Function (Lines 128-133):**

```tsx
const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('userData')  // ✅ Add this
  setUser(null)
  setIsAuthenticated(false)
  toast.success('Logged out successfully')
}
```

**Pros:**
- ✅ No API call needed on page refresh (faster)
- ✅ Works even if profile endpoint doesn't exist
- ✅ Simple implementation
- ✅ User data always available

**Cons:**
- ⚠️ User data in localStorage can become stale
- ⚠️ If user updates profile elsewhere, local data won't update
- ⚠️ Slightly less secure (but encrypted token makes this minimal)

---

### **Alternative 2: Find Correct Endpoint from API Docs**

The API might use a different endpoint pattern. Common alternatives:

| Endpoint | Try This |
|----------|----------|
| `GET /profile` | Simple, no namespace |
| `GET /me` | Very simple |
| `GET /user` | Singular |
| `GET /users/current` | RESTful pattern |
| `GET /api/v1/users/me` | Versioned API |
| `GET /account` | Account-based |
| `GET /users/{id}` | Requires user ID from token |

**How to Find:**

1. **Check API Documentation:**
   - Swagger/OpenAPI docs
   - Postman collection
   - API reference guide

2. **Check Network Tab:**
   - Login to any working instance
   - Look for profile/user API calls
   - Copy the exact endpoint

3. **Ask Backend Team:**
   - What's the correct profile endpoint?
   - Or: Does a profile endpoint exist?

---

## Recommended Approach

### If API documentation is unavailable:

**Step 1:** Try current fix (`/users/profile`)
```bash
npm run dev
# Login and check Network tab
```

**Step 2:** If still 404, implement **Alternative 1** (store user data)
- Fastest solution
- Works without profile endpoint
- Good UX

**Step 3:** Later, if profile endpoint is found, can switch back to API calls

---

## Implementation Guide for Alternative 1

### Complete Updated `AuthContext.tsx`

```tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI, User, RegisterData, LoginData } from '@/lib/api'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user from localStorage on app start
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('authToken')
      const storedUser = localStorage.getItem('userData')
      
      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setIsAuthenticated(true)
        } catch (error) {
          // Invalid stored data
          localStorage.removeItem('authToken')
          localStorage.removeItem('userData')
          setUser(null)
          setIsAuthenticated(false)
        }
      }
      
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (data: LoginData) => {
    try {
      const response = await authAPI.login(data)
      
      // Store token and user data
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('userData', JSON.stringify(response.user))
      
      setUser(response.user)
      setIsAuthenticated(true)
      
      toast.success('Login successful!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await authAPI.register(data)
      
      // Store token and user data
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('userData', JSON.stringify(response.user))
      
      setUser(response.user)
      setIsAuthenticated(true)
      
      toast.success('Registration successful!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully')
  }

  const updateUser = (userData: User) => {
    setUser(userData)
    // Also update localStorage
    localStorage.setItem('userData', JSON.stringify(userData))
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
```

---

## Testing Checklist

### Test Current Fix (`/users/profile`)

- [ ] Clear localStorage
- [ ] Login with valid credentials
- [ ] Check Network tab:
  - [ ] POST /users/login → 200
  - [ ] GET /users/profile → 200 (success) or 404 (failed)
- [ ] If 200: Refresh page → User stays logged in ✅
- [ ] If 404: Implement Alternative 1 below

---

### Test Alternative 1 (Store User Data)

- [ ] Implement changes to AuthContext
- [ ] Clear localStorage
- [ ] Login with valid credentials
- [ ] Check localStorage:
  - [ ] `authToken` exists
  - [ ] `userData` exists and contains user object
- [ ] Refresh page (F5)
- [ ] Verify:
  - [ ] User still logged in ✅
  - [ ] No API call to profile endpoint
  - [ ] Dashboard loads correctly
  - [ ] User info displays in header

---

## Summary

**Tried So Far:**
- ❌ `/users/me` → 404
- ❌ `/auth/me` → 404
- ⚠️ `/users/profile` → Testing now

**Next Steps:**

1. **Test `/users/profile`** (current implementation)
   - If works → Done! ✅
   - If 404 → Go to step 2

2. **Implement Alternative 1** (store user in localStorage)
   - Fastest solution
   - No dependency on profile endpoint
   - Good user experience

3. **Long-term:** Find correct endpoint from API docs
   - Can switch back to API calls later
   - Keeps user data fresh

**Recommended:** If `/users/profile` fails, use Alternative 1 to unblock development, then investigate correct endpoint later.
