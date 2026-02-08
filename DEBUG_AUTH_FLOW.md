# 🔍 Authentication Flow Debug Guide

## Comprehensive Logging Added

I've added extensive console logging throughout the entire authentication flow to diagnose the exact issue. Here's what to look for:

---

## 📋 What to Check in Browser Console

### Step 1: Login Request

When you submit the login form, look for:

```
=== API LOGIN RAW RESPONSE ===
Full axios response: { ... }
response.data: { status: "success", data: { token: "...", user: {...} } }
response.data type: object

Trying response.data.data.token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Trying response.data.token: undefined
Trying response.data.data: { token: "...", user: {...} }

✅ Using nested structure: response.data.data
Extracted token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Extracted user: { id: "123", name: "...", email: "..." }
==============================
```

**What this tells us:**
- ✅ API returned 200 OK
- ✅ Token extraction successful
- ✅ Response structure identified (nested or flat)

**⚠️ Red Flags:**
- ❌ `Extracted token: undefined` → API response structure is different
- ❌ `FAILED TO EXTRACT TOKEN OR USER` → Need to check actual API response format

---

### Step 2: Token Storage

After successful extraction, look for:

```
=== LOGIN RESPONSE DEBUG ===
Full response: { token: "eyJ...", user: {...} }
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Token type: string
Token length: 245
User: { id: "123", name: "John Doe", email: "john@example.com" }
===========================

✅ Token saved to localStorage: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**What this tells us:**
- ✅ Token is a valid string (not undefined or object)
- ✅ Token has reasonable length (~200-300 chars for JWT)
- ✅ Token saved successfully to localStorage

**⚠️ Red Flags:**
- ❌ `Token type: undefined` → Token extraction failed
- ❌ `Token type: object` → Token is being saved as [object Object]
- ❌ `Token length: 0` → Empty token
- ❌ `TOKEN MISMATCH! Saved: X Expected: Y` → localStorage write failed

---

### Step 3: Dashboard Load (First Request)

When the dashboard loads and makes its first API call, look for:

```
=== REQUEST INTERCEPTOR DEBUG ===
URL: /financial/summary
Method: get
Interceptor Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Token type: string
Token length: 245
✅ Authorization Header Set: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
================================
```

**What this tells us:**
- ✅ Token exists in localStorage
- ✅ Token is being attached to request
- ✅ Authorization header format is correct: `Bearer <token>`

**⚠️ Red Flags:**
- ❌ `Interceptor Token: null` → Token not in localStorage
- ❌ `NO TOKEN FOUND in localStorage` → Token was never saved or was cleared
- ❌ `localStorage keys: []` → localStorage is empty

---

### Step 4: API Response (Success)

If the request succeeds:

```
✅ Response success: /financial/summary 200
```

**This means:**
- ✅ Token is valid
- ✅ Backend accepted the token
- ✅ Authorization working correctly

---

### Step 5: API Response (401 Error)

If you see a 401 error:

```
=== RESPONSE ERROR DEBUG ===
URL: /financial/summary
Status: 401
Error data: { message: "Unauthorized" }
Current path: /dashboard

❌ 401 UNAUTHORIZED ERROR
Token in localStorage: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Authorization header sent: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

🔄 Redirecting to /login (not on auth page)
===========================
```

**This tells us:**
1. Token exists in localStorage ✅
2. Token was sent in Authorization header ✅
3. **But backend rejected the token** ❌

**Possible Causes:**
- Token format is wrong (missing "Bearer " prefix, extra spaces)
- Token is expired
- Backend expects different token format
- Backend URL mismatch (token issued for different domain)

---

## 🔧 Diagnostic Scenarios

### Scenario A: Token Never Saved

**Console Output:**
```
❌ INVALID TOKEN: undefined
```

**Fix:**
The API response structure doesn't match what we expect. Look at the `=== API LOGIN RAW RESPONSE ===` section and share it with me. The actual response structure might be:
- `response.data.token` (flat)
- `response.data.data.token` (nested)
- `response.token` (direct)

---

### Scenario B: Token Saved as "[object Object]"

**Console Output:**
```
Token type: object
Token saved to localStorage: [object Object]
```

**Fix:**
We're trying to save the entire object instead of the token string. Check the extraction logic - we might need to access a nested property.

---

### Scenario C: Token Saved but Not Found on Dashboard

**Console Output:**
```
✅ Token saved to localStorage: eyJ...
(Then later)
❌ NO TOKEN FOUND in localStorage
localStorage keys: []
```

**Possible Causes:**
1. **localStorage cleared between login and dashboard**
   - Browser privacy mode
   - Extension clearing storage
   - Another script clearing localStorage

2. **Different domain/subdomain**
   - Login on `http://localhost`
   - Dashboard on `http://127.0.0.1`
   - localStorage is domain-specific!

---

### Scenario D: Token Found but 401 Still Occurs

**Console Output:**
```
✅ Authorization Header Set: Bearer eyJ...
❌ 401 UNAUTHORIZED ERROR
Authorization header sent: Bearer eyJ...
```

**Possible Causes:**

1. **Token Format Issue**
   ```javascript
   // Wrong (extra space)
   Authorization: Bearer  eyJ...
   
   // Wrong (missing space)
   Authorization: Bearereyj...
   
   // Correct
   Authorization: Bearer eyJ...
   ```

2. **Token Expired**
   - Decode the JWT (use jwt.io)
   - Check the `exp` claim
   - Token might have already expired

3. **Token for Wrong Environment**
   - Token issued by different backend
   - Token contains wrong audience/issuer

4. **CORS/Preflight Issues**
   - Authorization header might be stripped
   - Check Network tab for OPTIONS requests

---

## 🎯 Quick Checklist

After login, verify each step:

| Step | What to Check | Expected Result |
|------|---------------|-----------------|
| 1 | `=== API LOGIN RAW RESPONSE ===` | `response.data` contains token |
| 2 | `Extracted token:` | Long string starting with `eyJ` |
| 3 | `Token type:` | `string` (not object/undefined) |
| 4 | `Token length:` | 200-300 characters |
| 5 | `Token saved to localStorage:` | Same token value |
| 6 | `Interceptor Token:` | Same token value |
| 7 | `Authorization Header Set:` | `Bearer <token>` |
| 8 | `Response success:` | 200 status |

If any step fails, that's where the problem is!

---

## 🐛 Common Issues & Solutions

### Issue 1: "Token is undefined"

**Console shows:**
```
Extracted token: undefined
❌ INVALID TOKEN: undefined
```

**Solution:**
Check the `=== API LOGIN RAW RESPONSE ===` section. Share the `response.data` structure with me. The API might return:
- `{ token: "...", user: {...} }` (flat)
- `{ data: { token: "...", user: {...} } }` (one level nested)
- `{ status: "success", data: { token: "...", user: {...} } }` (two levels nested)

I've added defensive code that tries both, but we might need to adjust.

---

### Issue 2: "Token saved but requests still fail with 401"

**Console shows:**
```
✅ Token saved to localStorage: eyJ...
✅ Authorization Header Set: Bearer eyJ...
❌ 401 UNAUTHORIZED ERROR
```

**Debugging Steps:**

1. **Copy the token from console**
   ```
   Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImlhdCI6MTY4ODg4ODg4OH0.abc123
   ```

2. **Decode it at jwt.io**
   - Paste the token
   - Check the `exp` (expiration) claim
   - Verify it hasn't expired

3. **Test with Postman/Insomnia**
   ```
   GET https://case.nodelabs.dev/api/financial/summary
   Headers:
     Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   - If Postman works but app doesn't → Frontend header issue
   - If Postman also gets 401 → Token is invalid/expired

4. **Check Network Tab**
   - Open DevTools → Network
   - Find the `/financial/summary` request
   - Check "Request Headers"
   - Verify `Authorization: Bearer <token>` is present
   - Verify no extra spaces or malformed header

---

### Issue 3: "Infinite redirect loop"

**Console shows:**
```
❌ 401 UNAUTHORIZED ERROR
⚠️ Already on auth page, NOT redirecting (prevent loop)
```

**This is actually GOOD!**
- The loop prevention is working
- The real issue is why you're getting 401 on the login page
- Usually means the `/users/login` endpoint itself is returning 401

**Check:**
- Are you sending correct email/password?
- Is the login endpoint `/users/login` or something else?
- Check Network tab for the actual error message

---

## 📊 Expected Console Flow (Success)

Here's what a successful login → dashboard flow looks like:

```
1. USER CLICKS "SIGN IN"

2. === API LOGIN RAW RESPONSE ===
   response.data: { status: "success", data: { token: "eyJ...", user: {...} } }
   ✅ Using nested structure: response.data.data
   Extracted token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Extracted user: { id: "123", name: "John", email: "john@example.com" }

3. === LOGIN RESPONSE DEBUG ===
   Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Token type: string
   Token length: 245
   ✅ Token saved to localStorage: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

4. NAVIGATE TO /dashboard

5. === REQUEST INTERCEPTOR DEBUG ===
   URL: /financial/summary
   Interceptor Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ✅ Authorization Header Set: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

6. ✅ Response success: /financial/summary 200

7. (Dashboard renders with data)
```

---

## 🚀 Action Items

### After you login, immediately check the console and tell me:

1. **What does `Extracted token:` show?**
   - If it's a long string starting with `eyJ` → ✅ Good
   - If it's `undefined` → ❌ Share the `response.data` structure

2. **What does `Token saved to localStorage:` show?**
   - Should match the extracted token
   - If different or `null` → ❌ Storage issue

3. **What does `Interceptor Token:` show on dashboard?**
   - Should match the saved token
   - If `null` → ❌ Token lost between pages

4. **Do you see `✅ Response success` or `❌ 401 UNAUTHORIZED ERROR`?**
   - Success → ✅ Everything works!
   - 401 → ❌ Backend rejects the token (share the error data)

5. **If 401, what does `Authorization header sent:` show?**
   - Should be: `Bearer eyJ...` (with space after Bearer)
   - If malformed → Frontend issue
   - If correct → Backend issue

---

## 🔍 Debug Modes

### Mode 1: Check Raw API Response
```typescript
// In src/lib/api.ts, login function
console.log('response.data:', response.data)
```
**Purpose:** See the exact structure returned by the API

---

### Mode 2: Check localStorage
```javascript
// Run in browser console
console.log('authToken:', localStorage.getItem('authToken'))
console.log('All keys:', Object.keys(localStorage))
```
**Purpose:** Verify token is actually stored

---

### Mode 3: Check Request Headers
```javascript
// In browser DevTools → Network tab
// Click on any API request
// Look at "Request Headers" section
// Find "authorization" or "Authorization"
```
**Purpose:** Verify token is being sent

---

## 📝 Summary

The app now has **comprehensive logging** at every step:

1. ✅ Raw API response logging
2. ✅ Token extraction with fallback logic
3. ✅ Token validation before storage
4. ✅ Storage verification
5. ✅ Request interceptor logging
6. ✅ Response error logging
7. ✅ 401 redirect with loop prevention

**Next Step:** Try logging in and share the console output. The logs will tell us exactly where the issue is!
