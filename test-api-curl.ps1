# PowerShell script for comprehensive JyotAIshya API testing
# Tests all API endpoints using Invoke-RestMethod

# Configuration
$API_BASE = "https://jyotaishya-nabtzaeyk-ranveer-singh-rajputs-projects.vercel.app"
$LOCAL_API = "http://localhost:3000"
$TIMEOUT = 30

# Test counters
$TOTAL_TESTS = 0
$PASSED_TESTS = 0
$FAILED_TESTS = 0
$TEST_RESULTS = @()

# Utility functions
function Log-Test {
    param(
        [string]$TestName,
        [string]$Status,
        [string]$Details = ""
    )
    
    $global:TOTAL_TESTS++
    
    if ($Status -eq "PASSED") {
        Write-Host "✅ $TestName`: PASSED" -ForegroundColor Green
        $global:PASSED_TESTS++
    } else {
        Write-Host "❌ $TestName`: FAILED" -ForegroundColor Red
        $global:FAILED_TESTS++
    }
    
    if ($Details) {
        Write-Host "   $Details" -ForegroundColor Gray
    }
    
    $global:TEST_RESULTS += @{
        Test = $TestName
        Status = $Status
        Details = $Details
        Timestamp = Get-Date
    }
}

function Log-Section {
    param([string]$Title)
    
    Write-Host ""
    Write-Host ("=" * 80) -ForegroundColor Cyan
    Write-Host "🔍 $Title" -ForegroundColor Cyan
    Write-Host ("=" * 80) -ForegroundColor Cyan
}

function Test-ServerConnectivity {
    Log-Section "SERVER CONNECTIVITY TESTING"
    
    # Test deployed API first
    Write-Host "🔄 Testing deployed API at $API_BASE..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri $API_BASE -Method GET -TimeoutSec $TIMEOUT -ErrorAction Stop
        Log-Test "Deployed API Connectivity" "PASSED" "Server running: $($response.message)"
        return $API_BASE
    } catch {
        Log-Test "Deployed API Connectivity" "FAILED" "Error: $($_.Exception.Message)"
        
        # Try local server
        Write-Host "🔄 Testing local server at $LOCAL_API..." -ForegroundColor Yellow
        
        try {
            $response = Invoke-RestMethod -Uri $LOCAL_API -Method GET -TimeoutSec $TIMEOUT -ErrorAction Stop
            Log-Test "Local Server Connectivity" "PASSED" "Server running: $($response.message)"
            return $LOCAL_API
        } catch {
            Log-Test "Local Server Connectivity" "FAILED" "Error: $($_.Exception.Message)"
            Write-Host "❌ No accessible API server found. Exiting." -ForegroundColor Red
            exit 1
        }
    }
}

function Test-HealthEndpoint {
    param([string]$ApiUrl)
    
    Log-Section "HEALTH ENDPOINT TESTING"
    
    Write-Host "🔄 Testing health endpoint..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri "$ApiUrl/api/health" -Method GET -TimeoutSec $TIMEOUT -ErrorAction Stop
        
        if ($response.success) {
            Log-Test "Health Endpoint" "PASSED" "Health check: $($response.message)"
        } else {
            Log-Test "Health Endpoint" "FAILED" "Health check returned success: false"
        }
    } catch {
        Log-Test "Health Endpoint" "FAILED" "Error: $($_.Exception.Message)"
    }
}

function Test-UserAuthentication {
    param([string]$ApiUrl)
    
    Log-Section "USER AUTHENTICATION TESTING"
    
    # Generate unique email
    $timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    $testEmail = "test-$timestamp@example.com"
    $authToken = $null
    
    # Test user registration
    Write-Host "🔄 Testing user registration..." -ForegroundColor Yellow
    
    $registerData = @{
        name = "Test User CLI"
        email = $testEmail
        password = "testpassword123"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$ApiUrl/api/users/register" -Method POST -Body ($registerData | ConvertTo-Json) -ContentType "application/json" -TimeoutSec $TIMEOUT -ErrorAction Stop
        
        if ($response.success) {
            Log-Test "User Registration" "PASSED" "User registered successfully"
            $authToken = $response.data.token
        } else {
            Log-Test "User Registration" "FAILED" "Registration returned success: false"
        }
    } catch {
        Log-Test "User Registration" "FAILED" "Error: $($_.Exception.Message)"
    }
    
    # Test user login
    Write-Host "🔄 Testing user login..." -ForegroundColor Yellow
    
    $loginData = @{
        email = $testEmail
        password = "testpassword123"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$ApiUrl/api/users/login" -Method POST -Body ($loginData | ConvertTo-Json) -ContentType "application/json" -TimeoutSec $TIMEOUT -ErrorAction Stop
        
        if ($response.success) {
            Log-Test "User Login" "PASSED" "User logged in successfully"
            if (-not $authToken) {
                $authToken = $response.data.token
            }
        } else {
            Log-Test "User Login" "FAILED" "Login returned success: false"
        }
    } catch {
        Log-Test "User Login" "FAILED" "Error: $($_.Exception.Message)"
    }
    
    # Test authenticated endpoint
    if ($authToken) {
        Write-Host "🔄 Testing authenticated endpoint..." -ForegroundColor Yellow
        
        $headers = @{
            "Authorization" = "Bearer $authToken"
        }
        
        try {
            $response = Invoke-RestMethod -Uri "$ApiUrl/api/users/me" -Method GET -Headers $headers -TimeoutSec $TIMEOUT -ErrorAction Stop
            
            if ($response.success) {
                Log-Test "Authenticated Endpoint" "PASSED" "Profile retrieved successfully"
            } else {
                Log-Test "Authenticated Endpoint" "FAILED" "Profile request returned success: false"
            }
        } catch {
            Log-Test "Authenticated Endpoint" "FAILED" "Error: $($_.Exception.Message)"
        }
    }
    
    return $authToken
}

function Test-KundaliGeneration {
    param([string]$ApiUrl)
    
    Log-Section "KUNDALI GENERATION TESTING"
    
    $testCases = @(
        @{
            name = "Rajesh Kumar"
            birthDate = "1985-03-20"
            birthTime = "08:45"
            birthPlace = "Mumbai, India"
        },
        @{
            name = "Priya Sharma"
            birthDate = "1992-11-08"
            birthTime = "16:20"
            birthPlace = "Jaipur, India"
        },
        @{
            name = "Amit Singh"
            birthDate = "1988-07-12"
            birthTime = "22:15"
            birthPlace = "Kolkata, India"
        }
    )
    
    foreach ($testCase in $testCases) {
        Write-Host "🔄 Testing kundali generation for $($testCase.name)..." -ForegroundColor Yellow
        
        try {
            $response = Invoke-RestMethod -Uri "$ApiUrl/api/kundali/generate" -Method POST -Body ($testCase | ConvertTo-Json) -ContentType "application/json" -TimeoutSec $TIMEOUT -ErrorAction Stop
            
            if ($response.success -and $response.data -and $response.data.planets -and $response.data.ascendant -and $response.data.doshas) {
                $planetCount = $response.data.planets.Count
                $ascendant = if ($response.data.ascendant.rashiName.english) { $response.data.ascendant.rashiName.english } else { $response.data.ascendant.rashiName }
                Log-Test "Kundali Generation - $($testCase.name)" "PASSED" "Generated with $planetCount planets, Ascendant: $ascendant"
            } else {
                Log-Test "Kundali Generation - $($testCase.name)" "FAILED" "Incomplete kundali data structure"
            }
        } catch {
            Log-Test "Kundali Generation - $($testCase.name)" "FAILED" "Error: $($_.Exception.Message)"
        }
    }
}

function Test-ErrorHandling {
    param([string]$ApiUrl)
    
    Log-Section "ERROR HANDLING TESTING"
    
    Write-Host "🔄 Testing error handling with invalid data..." -ForegroundColor Yellow
    
    $errorTestCases = @(
        @{ data = @{}; name = "Empty Request Body" },
        @{ data = @{ name = "Test" }; name = "Missing Required Fields" },
        @{ data = @{ name = "Test"; birthDate = "invalid-date"; birthTime = "10:00"; birthPlace = "Delhi" }; name = "Invalid Date Format" },
        @{ data = @{ name = "Test"; birthDate = "1990-01-01"; birthTime = "25:00"; birthPlace = "Delhi" }; name = "Invalid Time Format" }
    )
    
    foreach ($testCase in $errorTestCases) {
        try {
            $response = Invoke-RestMethod -Uri "$ApiUrl/api/kundali/generate" -Method POST -Body ($testCase.data | ConvertTo-Json) -ContentType "application/json" -TimeoutSec $TIMEOUT -ErrorAction Stop
            
            if (-not $response.success) {
                Log-Test "Error Handling - $($testCase.name)" "PASSED" "Correctly rejected invalid data"
            } else {
                Log-Test "Error Handling - $($testCase.name)" "FAILED" "Should have returned error but succeeded"
            }
        } catch {
            # HTTP errors are expected for invalid data
            Log-Test "Error Handling - $($testCase.name)" "PASSED" "Correctly rejected with error: $($_.Exception.Message)"
        }
    }
    
    # Test authentication error
    Write-Host "🔄 Testing authentication error handling..." -ForegroundColor Yellow
    
    $headers = @{
        "Authorization" = "Bearer invalid-token"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$ApiUrl/api/users/me" -Method GET -Headers $headers -TimeoutSec $TIMEOUT -ErrorAction Stop
        Log-Test "Authentication Error Handling" "FAILED" "Should have returned authentication error"
    } catch {
        Log-Test "Authentication Error Handling" "PASSED" "Correctly rejected invalid token"
    }
}

function Generate-Report {
    Log-Section "COMPREHENSIVE TEST REPORT"

    Write-Host "📊 Test Results Summary:" -ForegroundColor Blue
    Write-Host "   Total Tests: $TOTAL_TESTS"
    Write-Host "   Passed: $PASSED_TESTS ✅" -ForegroundColor Green
    Write-Host "   Failed: $FAILED_TESTS ❌" -ForegroundColor Red

    if ($TOTAL_TESTS -gt 0) {
        $successRate = [math]::Round(($PASSED_TESTS / $TOTAL_TESTS) * 100, 1)
        Write-Host "   Success Rate: $successRate%"
    }

    Write-Host ""
    Write-Host "💡 Recommendations:" -ForegroundColor Magenta

    if ($FAILED_TESTS -eq 0) {
        Write-Host "   🎉 All tests passed! The JyotAIshya application is fully functional." -ForegroundColor Green
    } else {
        Write-Host "   🔧 $FAILED_TESTS test(s) failed. Review the failed tests above." -ForegroundColor Yellow
        Write-Host "   📊 Check server logs and database connectivity for detailed error information." -ForegroundColor Yellow
        Write-Host "   🌐 Ensure all required environment variables are properly configured." -ForegroundColor Yellow
    }

    # Save results to file
    $reportData = @{
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Summary = @{
            Total = $TOTAL_TESTS
            Passed = $PASSED_TESTS
            Failed = $FAILED_TESTS
            SuccessRate = if ($TOTAL_TESTS -gt 0) { [math]::Round(($PASSED_TESTS / $TOTAL_TESTS) * 100, 1) } else { 0 }
        }
        Details = $TEST_RESULTS
    }

    try {
        $reportData | ConvertTo-Json -Depth 3 | Out-File -FilePath "test-results.json" -Encoding UTF8
        Write-Host ""
        Write-Host "📄 Test results saved to: test-results.json" -ForegroundColor Cyan
    } catch {
        Write-Host ""
        Write-Host "⚠️ Could not save test report: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Main execution
function Main {
    Write-Host "🚀 STARTING COMPREHENSIVE JYOTAISHYA API TESTING" -ForegroundColor Cyan
    Write-Host ("=" * 80) -ForegroundColor Cyan
    Write-Host "This will test all API endpoints using PowerShell:"
    Write-Host "• Server connectivity (Local/Deployed API)"
    Write-Host "• Health endpoint"
    Write-Host "• User authentication and registration"
    Write-Host "• Kundali generation"
    Write-Host "• Error handling"
    Write-Host ("=" * 80) -ForegroundColor Cyan

    # Run tests
    $apiUrl = Test-ServerConnectivity
    Write-Host "Using API: $apiUrl" -ForegroundColor Green

    Test-HealthEndpoint -ApiUrl $apiUrl
    $authToken = Test-UserAuthentication -ApiUrl $apiUrl
    Test-KundaliGeneration -ApiUrl $apiUrl
    Test-ErrorHandling -ApiUrl $apiUrl

    # Generate report
    Generate-Report

    # Exit with appropriate code
    if ($FAILED_TESTS -eq 0) {
        Write-Host ""
        Write-Host "🎉 All tests completed successfully!" -ForegroundColor Green
        exit 0
    } else {
        Write-Host ""
        Write-Host "💥 Some tests failed. Check the report above." -ForegroundColor Red
        exit 1
    }
}

# Handle command line arguments
param(
    [switch]$Help,
    [switch]$Local,
    [switch]$Deployed
)

if ($Help) {
    Write-Host "JyotAIshya API Test Suite (PowerShell)"
    Write-Host ""
    Write-Host "Usage: .\test-api-curl.ps1 [options]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Help               Show this help message"
    Write-Host "  -Local              Test only local server"
    Write-Host "  -Deployed           Test only deployed API"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\test-api-curl.ps1                # Test both local and deployed API"
    Write-Host "  .\test-api-curl.ps1 -Local         # Test local server only"
    Write-Host "  .\test-api-curl.ps1 -Deployed      # Test deployed API only"
    exit 0
}

# Modify configuration based on arguments
if ($Local) {
    $API_BASE = $LOCAL_API
} elseif ($Deployed) {
    $LOCAL_API = ""
}

# Run the tests
Main
