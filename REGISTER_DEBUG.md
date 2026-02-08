# 🔍 Registration Form Debug Guide

## Issue
Getting **400 Bad Request** error with message "The submitted data is invalid" during registration.

## Root Cause
The form collects field `name`, but the API expects `fullName`.

## ✅ Fix Applied

### 1. RegisterForm.tsx - Field Mapping

**Location:** `src/features/auth/components/RegisterForm.tsx`

```typescript
const onSubmit = async (data: RegisterFormData) => {
  setIsLoading(true)
  
  console.log('=== REGISTER FORM SUBMIT ===')
  console.log('Form data received:', data)
  
  const registerPayload = {
    fullName: data.name,  // ✅ Map 'name' to 'fullName' for API
    email: data.email,
    password: data.password,
  }
  
  console.log('Submitting Register Data:', registerPayload)
  console.log('===========================')
  
  try {
    await registerUser(registerPayload)
    navigate('/dashboard')
  } catch (error) {
    console.error('Registration failed:', error)
  } finally {
    setIsLoading(false)
  }
}
```

**What this does:**
- ✅ Receives form data with `name` field
- ✅ Creates new object with `fullName` field
- ✅ Logs both the input and output for debugging
- ✅ Sends correct payload to API

### 2. AuthContext.tsx - Validation Logging

**Location:** `src/context/AuthContext.tsx`

```typescript
const register = async (data: RegisterData) => {
  console.log('=== AUTH CONTEXT REGISTER ===')
  console.log('Data received by AuthContext:', data)
  console.log('Data keys:', Object.keys(data))
  console.log('fullName:', data.fullName)  // Should NOT be undefined
  console.log('email:', data.email)
  console.log('=============================')
  
  try {
    const response = await authAPI.register(data)
    // ... rest of logic
  }
}
```

**What this does:**
- ✅ Validates data structure before API call
- ✅ Confirms `fullName` field exists
- ✅ Shows all object keys to catch typos

### 3. API Client - Already Configured

**Location:** `src/lib/api.ts`

```typescript
export interface RegisterData {
  fullName: string  // ✅ Matches API expectation
  email: string
  password: string
}

export const authAPI = {
  register: async (data: RegisterData) => {
    console.log('=== API REGISTER RAW RESPONSE ===')
    // ... sends POST /users/register with fullName
  }
}
```

---

## 📋 Expected Console Output

When you submit the registration form, you should see:

### Step 1: Form Submission
```
=== REGISTER FORM SUBMIT ===
Form data received: { name: "John Doe", email: "john@example.com", password: "password123" }
Submitting Register Data: { fullName: "John Doe", email: "john@example.com", password: "password123" }
===========================
```

✅ **Verify:** `fullName` is present in "Submitting Register Data"

### Step 2: AuthContext Receives Data
```
=== AUTH CONTEXT REGISTER ===
Data received by AuthContext: { fullName: "John Doe", email: "john@example.com", password: "password123" }
Data keys: ["fullName", "email", "password"]
fullName: John Doe
email: john@example.com
=============================
```

✅ **Verify:** 
- Keys include `fullName` (NOT `name`)
- `fullName` value is NOT undefined

### Step 3: API Call
```
=== API REGISTER RAW RESPONSE ===
Full axios response: { ... }
response.data: { status: "success", data: { token: "...", user: {...} } }
✅ Using nested structure: response.data.data
Extracted token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **Verify:** 
- No 400 error
- Token successfully extracted
- Registration successful

---

## 🐛 Troubleshooting

### Issue 1: Still Getting 400 Error

**Console Check:**
Look for these logs and compare:

```
Submitting Register Data: { fullName: "...", email: "...", password: "..." }
```

**If you see `name` instead of `fullName`:**
- ❌ The mapping didn't work
- Check if there are multiple `onSubmit` functions
- Verify the file was saved

**If you see `fullName: undefined`:**
- ❌ Form data doesn't have `name` field
- Check the form schema (line 11-15)
- Verify `register('name')` on the input (line 64)

### Issue 2: Different 400 Error Message

**Other possible validation errors:**

1. **"Email is invalid"**
   - Check email format
   - Must be valid email (e.g., user@example.com)

2. **"Password is too short"**
   - Password must be at least 6 characters
   - Check form validation (line 14)

3. **"Full name is required"**
   - `fullName` is empty string
   - Check if form field is populated

### Issue 3: Network Error / CORS

**Console shows:**
```
Network error. Please check your connection.
```

**Possible causes:**
- API server is down
- CORS issues
- Wrong API URL

**Debug:**
1. Open Network tab in DevTools
2. Find the `/users/register` request
3. Check "Request Payload"
4. Verify it contains: `{ fullName: "...", email: "...", password: "..." }`

---

## 🎯 Validation Checklist

Before submitting the form, verify:

| Item | Expected | How to Check |
|------|----------|--------------|
| Form field name | `name` | Line 64: `{...register('name')}` |
| Zod schema | Has `name` field | Line 12: `name: z.string()...` |
| Payload mapping | `fullName: data.name` | Line 38 in onSubmit |
| AuthContext type | Expects `fullName` | RegisterData interface |
| API type | Expects `fullName` | Line 57 in api.ts |

All of these should be ✅ aligned.

---

## 📊 Data Flow

```
1. USER FILLS FORM
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "password123"

2. REACT-HOOK-FORM COLLECTS
   { name: "John Doe", email: "...", password: "..." }
   ↓
   
3. RegisterForm.onSubmit TRANSFORMS
   { fullName: "John Doe", email: "...", password: "..." }
   ↓
   
4. AuthContext.register RECEIVES
   { fullName: "John Doe", email: "...", password: "..." }
   ↓
   
5. authAPI.register SENDS TO BACKEND
   POST /users/register
   Body: { fullName: "John Doe", email: "...", password: "..." }
   ↓
   
6. BACKEND VALIDATES
   ✅ fullName: present
   ✅ email: valid format
   ✅ password: >= 6 chars
   ↓
   
7. BACKEND RESPONDS
   { status: "success", data: { token: "...", user: {...} } }
```

---

## 🔍 Network Tab Verification

1. Open DevTools (F12)
2. Go to "Network" tab
3. Submit the registration form
4. Find the request: `POST https://case.nodelabs.dev/api/users/register`
5. Click on it
6. Go to "Payload" or "Request" tab

**Should see:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Should NOT see:**
```json
{
  "name": "John Doe",  // ❌ Wrong field name
  ...
}
```

---

## ✅ Success Indicators

After submitting, if successful you'll see:

1. **Console Logs:**
   ```
   ✅ Using nested structure
   Extracted token: eyJ...
   Token saved to localStorage: eyJ...
   ```

2. **Toast Notification:**
   ```
   ✓ Registration successful!
   ```

3. **Navigation:**
   - Automatically redirected to `/dashboard`

4. **Dashboard Loads:**
   - No 401 errors
   - Financial data displays
   - User profile shows in header

---

## 🚀 Next Steps

1. **Try registering with these test values:**
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`

2. **Check console for logs starting with `===`**

3. **If still getting 400 error:**
   - Copy the **entire console output**
   - Copy the **Network request payload** from DevTools
   - Share both with me

4. **If successful:**
   - ✅ Registration works!
   - ✅ Token stored
   - ✅ Dashboard loads
   - You can now remove the console.logs for production

---

## 📝 Summary

### Changes Made:
1. ✅ **RegisterForm.tsx**: Added explicit mapping `fullName: data.name`
2. ✅ **RegisterForm.tsx**: Added console logs to track form data
3. ✅ **AuthContext.tsx**: Added validation logging
4. ✅ **RegisterData interface**: Already uses `fullName`

### Data Transformation:
```
Form Field: name      →  API Field: fullName
           ↓
{ name: "..." }       →  { fullName: "..." }
```

### Result:
- ✅ API receives correct field name (`fullName`)
- ✅ Full logging for debugging
- ✅ Type-safe throughout
- ✅ No linter errors

**Try registering now!** The console logs will show exactly what's being sent at each step. 🎯
