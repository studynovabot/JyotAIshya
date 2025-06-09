# Manual Frontend-Backend Integration Testing Guide

## 🎯 Objective
Verify that the JyotAIshya frontend can successfully communicate with the backend APIs through manual browser testing.

## 📋 Pre-Testing Checklist

### 1. Verify Servers Are Running
```bash
# Check if backend is running (should show server info)
curl http://localhost:3002 2>/dev/null || echo "Backend not accessible"

# Check if frontend is running (should show HTML)
curl http://localhost:5173 2>/dev/null || echo "Frontend not accessible"

# Alternative: Check processes
netstat -ano | findstr :3002  # Backend
netstat -ano | findstr :5173  # Frontend
```

### 2. Browser Setup
1. Open browser to: http://localhost:5173
2. Open Developer Tools (F12)
3. Go to **Network** tab
4. Go to **Console** tab (in separate window/tab)
5. Clear both Network and Console logs

## 🧪 Test Scenarios

### Test 1: Frontend Loading and API Configuration
**What to check:**
1. **Page loads successfully** - JyotAIshya homepage appears
2. **Console logs** - Look for API configuration debug messages:
   ```
   Environment mode: development
   API_URL from env: http://localhost:3002/api
   Final API_URL: /api
   ```
3. **No immediate errors** - Console should not show red error messages

**Expected Result:** ✅ Homepage loads with proper API configuration logged

---

### Test 2: Navigation and Component Loading
**Steps:**
1. Click on **"Kundali"** in navigation menu
2. Verify Kundali page loads with form fields

**What to check:**
- Form fields appear: Name, Date of Birth, Time of Birth, Place of Birth
- No JavaScript errors in console
- Page renders correctly

**Expected Result:** ✅ Kundali page loads successfully

---

### Test 3: API Communication - Kundali Generation
**Steps:**
1. Fill in the form:
   - **Name:** "Test User"
   - **Date of Birth:** "1990-05-15"
   - **Time of Birth:** "14:30"
   - **Place of Birth:** "New Delhi, India"
2. Click **"Generate Birth Chart"** button

**What to check in Network tab:**
1. **API Request appears:**
   - URL: `/api/kundali/generate` or `http://localhost:3002/api/kundali/generate`
   - Method: `POST`
   - Status: `200` (success) or `4xx/5xx` (error)

2. **Request Headers:**
   - `Content-Type: application/json`
   - `Origin: http://localhost:5173`

3. **Request Payload:**
   ```json
   {
     "name": "Test User",
     "birthDate": "1990-05-15",
     "birthTime": "14:30",
     "birthPlace": "New Delhi, India"
   }
   ```

4. **Response Headers:**
   - `Access-Control-Allow-Origin: http://localhost:5173` (CORS working)
   - `Content-Type: application/json`

**What to check in Console tab:**
1. **API request logs:**
   ```
   Making API request: {method: 'POST', url: '/kundali/generate', ...}
   ```
2. **API response logs:**
   ```
   API response received: {status: 200, url: '/kundali/generate', ...}
   ```
3. **No CORS errors** (would appear as red errors)

**Expected Results:**
- ✅ **Success (200):** Kundali data appears with planetary positions, birth chart
- ❌ **CORS Error:** Red error about "blocked by CORS policy"
- ❌ **Network Error:** "Failed to fetch" or connection refused
- ❌ **404 Error:** API endpoint not found
- ❌ **500 Error:** Server error in calculations

---

### Test 4: Authentication Flow (Optional)
**Steps:**
1. Navigate to **Register** page
2. Fill in registration form
3. Submit registration

**What to check:**
- API call to `/api/users/register`
- Successful registration or appropriate error message
- Token storage in localStorage (Application tab → Local Storage)

---

## 🔍 Troubleshooting Common Issues

### Issue 1: CORS Errors
**Symptoms:** Console shows "blocked by CORS policy"
**Solution:** Backend CORS not properly configured
```bash
# Check server logs for CORS messages
# Should see: "CORS request from origin: http://localhost:5173"
```

### Issue 2: Network Errors
**Symptoms:** "Failed to fetch" or "ERR_CONNECTION_REFUSED"
**Causes:**
- Backend server not running on port 3002
- Vite proxy not working
- Firewall blocking connections

**Debug Steps:**
```bash
# Test backend directly
curl http://localhost:3002/api/health

# Check if proxy is working
curl http://localhost:5173/api/health
```

### Issue 3: 404 Errors
**Symptoms:** API returns 404 Not Found
**Causes:**
- Wrong API endpoint URL
- Backend routes not properly configured
- Proxy configuration incorrect

### Issue 4: API Configuration Issues
**Symptoms:** Requests going to wrong URL
**Check:** Console logs should show correct API_URL configuration

## 📊 Success Criteria

### ✅ Integration Working Correctly
1. **Frontend loads** without errors
2. **API requests appear** in Network tab
3. **CORS headers present** in responses
4. **Kundali generation succeeds** with planetary data
5. **No console errors** related to API communication

### ❌ Integration Issues Detected
1. **CORS errors** in console
2. **Network connection failures**
3. **404 errors** for API endpoints
4. **Missing API configuration** logs
5. **JavaScript errors** preventing API calls

## 🎯 Alternative Testing Methods

If manual browser testing reveals issues:

### Method 1: Direct API Testing
```bash
# Test backend health
curl -X GET http://localhost:3002/api/health

# Test kundali generation
curl -X POST http://localhost:3002/api/kundali/generate \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","birthDate":"1990-05-15","birthTime":"14:30","birthPlace":"Delhi"}'
```

### Method 2: Proxy Testing
```bash
# Test if Vite proxy works
curl -X GET http://localhost:5173/api/health
```

### Method 3: Deployed API Testing
Test the deployed Vercel API to verify backend functionality:
```bash
curl -X POST https://jyotaishya-nabtzaeyk-ranveer-singh-rajputs-projects.vercel.app/api/kundali/generate \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","birthDate":"1990-05-15","birthTime":"14:30","birthPlace":"Delhi"}'
```

## 📝 Testing Report Template

After testing, document results:

```
## Frontend-Backend Integration Test Results

### Environment
- Frontend: http://localhost:5173 [✅/❌]
- Backend: http://localhost:3002 [✅/❌]

### Test Results
1. Frontend Loading: [✅/❌]
2. API Configuration: [✅/❌]
3. Kundali Generation: [✅/❌]
4. CORS Handling: [✅/❌]
5. Error Handling: [✅/❌]

### Issues Found
- [List any issues discovered]

### Next Steps
- [Actions needed to resolve issues]
```

This manual testing approach will definitively show whether the frontend-backend integration is working correctly.
