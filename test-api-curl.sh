#!/bin/bash

# Comprehensive API Testing Script using curl
# Tests JyotAIshya API endpoints with curl commands

# Configuration
API_BASE="https://jyotaishya-nabtzaeyk-ranveer-singh-rajputs-projects.vercel.app"
LOCAL_API="http://localhost:3000"
TIMEOUT=30

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Utility functions
log_test() {
    local test_name="$1"
    local status="$2"
    local details="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$status" = "PASSED" ]; then
        echo -e "${GREEN}✅ $test_name: PASSED${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ $test_name: FAILED${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    if [ -n "$details" ]; then
        echo -e "   $details"
    fi
}

log_section() {
    echo -e "\n${CYAN}$(printf '=%.0s' {1..80})${NC}"
    echo -e "${CYAN}🔍 $1${NC}"
    echo -e "${CYAN}$(printf '=%.0s' {1..80})${NC}"
}

# Test functions
test_server_connectivity() {
    log_section "SERVER CONNECTIVITY TESTING"
    
    # Test deployed API first
    echo -e "${YELLOW}🔄 Testing deployed API at $API_BASE...${NC}"
    
    response=$(curl -s -w "%{http_code}" -o /tmp/api_response.json --connect-timeout $TIMEOUT "$API_BASE" 2>/dev/null)
    http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        message=$(cat /tmp/api_response.json | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
        log_test "Deployed API Connectivity" "PASSED" "Server running: $message"
        API_URL="$API_BASE"
    else
        log_test "Deployed API Connectivity" "FAILED" "HTTP $http_code or connection failed"
        
        # Try local server
        echo -e "${YELLOW}🔄 Testing local server at $LOCAL_API...${NC}"
        response=$(curl -s -w "%{http_code}" -o /tmp/api_response.json --connect-timeout $TIMEOUT "$LOCAL_API" 2>/dev/null)
        http_code="${response: -3}"
        
        if [ "$http_code" = "200" ]; then
            message=$(cat /tmp/api_response.json | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
            log_test "Local Server Connectivity" "PASSED" "Server running: $message"
            API_URL="$LOCAL_API"
        else
            log_test "Local Server Connectivity" "FAILED" "HTTP $http_code or connection failed"
            echo -e "${RED}❌ No accessible API server found. Exiting.${NC}"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}Using API: $API_URL${NC}"
}

test_health_endpoint() {
    log_section "HEALTH ENDPOINT TESTING"
    
    echo -e "${YELLOW}🔄 Testing health endpoint...${NC}"
    
    response=$(curl -s -w "%{http_code}" -o /tmp/health_response.json --connect-timeout $TIMEOUT "$API_URL/api/health" 2>/dev/null)
    http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        success=$(cat /tmp/health_response.json | grep -o '"success":[^,}]*' | cut -d':' -f2)
        message=$(cat /tmp/health_response.json | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
        
        if [ "$success" = "true" ]; then
            log_test "Health Endpoint" "PASSED" "Health check: $message"
        else
            log_test "Health Endpoint" "FAILED" "Health check returned success: false"
        fi
    else
        log_test "Health Endpoint" "FAILED" "HTTP $http_code"
    fi
}

test_user_registration() {
    log_section "USER AUTHENTICATION TESTING"
    
    # Generate unique email
    timestamp=$(date +%s)
    test_email="test-$timestamp@example.com"
    
    echo -e "${YELLOW}🔄 Testing user registration...${NC}"
    
    # Test user registration
    response=$(curl -s -w "%{http_code}" -o /tmp/register_response.json \
        --connect-timeout $TIMEOUT \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"Test User CLI\",\"email\":\"$test_email\",\"password\":\"testpassword123\"}" \
        "$API_URL/api/users/register" 2>/dev/null)
    
    http_code="${response: -3}"
    
    if [ "$http_code" = "201" ]; then
        success=$(cat /tmp/register_response.json | grep -o '"success":[^,}]*' | cut -d':' -f2)
        if [ "$success" = "true" ]; then
            # Extract token for later use
            AUTH_TOKEN=$(cat /tmp/register_response.json | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
            log_test "User Registration" "PASSED" "User registered successfully"
        else
            log_test "User Registration" "FAILED" "Registration returned success: false"
        fi
    else
        log_test "User Registration" "FAILED" "HTTP $http_code"
    fi
    
    # Test user login
    echo -e "${YELLOW}🔄 Testing user login...${NC}"
    
    response=$(curl -s -w "%{http_code}" -o /tmp/login_response.json \
        --connect-timeout $TIMEOUT \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$test_email\",\"password\":\"testpassword123\"}" \
        "$API_URL/api/users/login" 2>/dev/null)
    
    http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        success=$(cat /tmp/login_response.json | grep -o '"success":[^,}]*' | cut -d':' -f2)
        if [ "$success" = "true" ]; then
            if [ -z "$AUTH_TOKEN" ]; then
                AUTH_TOKEN=$(cat /tmp/login_response.json | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
            fi
            log_test "User Login" "PASSED" "User logged in successfully"
        else
            log_test "User Login" "FAILED" "Login returned success: false"
        fi
    else
        log_test "User Login" "FAILED" "HTTP $http_code"
    fi
    
    # Test authenticated endpoint
    if [ -n "$AUTH_TOKEN" ]; then
        echo -e "${YELLOW}🔄 Testing authenticated endpoint...${NC}"
        
        response=$(curl -s -w "%{http_code}" -o /tmp/me_response.json \
            --connect-timeout $TIMEOUT \
            -H "Authorization: Bearer $AUTH_TOKEN" \
            "$API_URL/api/users/me" 2>/dev/null)
        
        http_code="${response: -3}"
        
        if [ "$http_code" = "200" ]; then
            success=$(cat /tmp/me_response.json | grep -o '"success":[^,}]*' | cut -d':' -f2)
            if [ "$success" = "true" ]; then
                log_test "Authenticated Endpoint" "PASSED" "Profile retrieved successfully"
            else
                log_test "Authenticated Endpoint" "FAILED" "Profile request returned success: false"
            fi
        else
            log_test "Authenticated Endpoint" "FAILED" "HTTP $http_code"
        fi
    fi
}

test_kundali_generation() {
    log_section "KUNDALI GENERATION TESTING"
    
    # Test data
    test_cases=(
        '{"name":"Rajesh Kumar","birthDate":"1985-03-20","birthTime":"08:45","birthPlace":"Mumbai, India"}'
        '{"name":"Priya Sharma","birthDate":"1992-11-08","birthTime":"16:20","birthPlace":"Jaipur, India"}'
        '{"name":"Amit Singh","birthDate":"1988-07-12","birthTime":"22:15","birthPlace":"Kolkata, India"}'
    )
    
    for i in "${!test_cases[@]}"; do
        test_data="${test_cases[$i]}"
        name=$(echo "$test_data" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
        
        echo -e "${YELLOW}🔄 Testing kundali generation for $name...${NC}"
        
        response=$(curl -s -w "%{http_code}" -o /tmp/kundali_response.json \
            --connect-timeout $TIMEOUT \
            -H "Content-Type: application/json" \
            -d "$test_data" \
            "$API_URL/api/kundali/generate" 2>/dev/null)
        
        http_code="${response: -3}"
        
        if [ "$http_code" = "200" ]; then
            success=$(cat /tmp/kundali_response.json | grep -o '"success":[^,}]*' | cut -d':' -f2)
            if [ "$success" = "true" ]; then
                # Check for essential kundali data
                has_planets=$(cat /tmp/kundali_response.json | grep -o '"planets":\[' | wc -l)
                has_ascendant=$(cat /tmp/kundali_response.json | grep -o '"ascendant":{' | wc -l)
                has_doshas=$(cat /tmp/kundali_response.json | grep -o '"doshas":{' | wc -l)
                
                if [ "$has_planets" -gt 0 ] && [ "$has_ascendant" -gt 0 ] && [ "$has_doshas" -gt 0 ]; then
                    log_test "Kundali Generation - $name" "PASSED" "Complete kundali data generated"
                else
                    log_test "Kundali Generation - $name" "FAILED" "Incomplete kundali data structure"
                fi
            else
                log_test "Kundali Generation - $name" "FAILED" "Generation returned success: false"
            fi
        else
            log_test "Kundali Generation - $name" "FAILED" "HTTP $http_code"
        fi
    done
}

test_error_handling() {
    log_section "ERROR HANDLING TESTING"

    echo -e "${YELLOW}🔄 Testing error handling with invalid data...${NC}"

    # Test cases for error handling
    error_test_cases=(
        '{}|Empty Request Body'
        '{"name":"Test"}|Missing Required Fields'
        '{"name":"Test","birthDate":"invalid-date","birthTime":"10:00","birthPlace":"Delhi"}|Invalid Date Format'
        '{"name":"Test","birthDate":"1990-01-01","birthTime":"25:00","birthPlace":"Delhi"}|Invalid Time Format'
    )

    for test_case in "${error_test_cases[@]}"; do
        IFS='|' read -r test_data test_name <<< "$test_case"

        response=$(curl -s -w "%{http_code}" -o /tmp/error_response.json \
            --connect-timeout $TIMEOUT \
            -H "Content-Type: application/json" \
            -d "$test_data" \
            "$API_URL/api/kundali/generate" 2>/dev/null)

        http_code="${response: -3}"

        if [ "$http_code" != "200" ]; then
            success=$(cat /tmp/error_response.json | grep -o '"success":[^,}]*' | cut -d':' -f2 2>/dev/null)
            if [ "$success" = "false" ] || [ "$http_code" = "400" ]; then
                log_test "Error Handling - $test_name" "PASSED" "Correctly rejected with HTTP $http_code"
            else
                log_test "Error Handling - $test_name" "FAILED" "Should have returned error but got HTTP $http_code"
            fi
        else
            log_test "Error Handling - $test_name" "FAILED" "Should have returned error but got HTTP 200"
        fi
    done

    # Test authentication error
    echo -e "${YELLOW}🔄 Testing authentication error handling...${NC}"

    response=$(curl -s -w "%{http_code}" -o /tmp/auth_error_response.json \
        --connect-timeout $TIMEOUT \
        -H "Authorization: Bearer invalid-token" \
        "$API_URL/api/users/me" 2>/dev/null)

    http_code="${response: -3}"

    if [ "$http_code" = "401" ] || [ "$http_code" = "403" ]; then
        log_test "Authentication Error Handling" "PASSED" "Correctly rejected invalid token with HTTP $http_code"
    else
        log_test "Authentication Error Handling" "FAILED" "Should have returned 401/403 but got HTTP $http_code"
    fi
}

generate_report() {
    log_section "COMPREHENSIVE TEST REPORT"

    echo -e "${BLUE}📊 Test Results Summary:${NC}"
    echo -e "   Total Tests: $TOTAL_TESTS"
    echo -e "   ${GREEN}Passed: $PASSED_TESTS ✅${NC}"
    echo -e "   ${RED}Failed: $FAILED_TESTS ❌${NC}"

    if [ $TOTAL_TESTS -gt 0 ]; then
        success_rate=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
        echo -e "   Success Rate: ${success_rate}%"
    fi

    echo -e "\n${PURPLE}💡 Recommendations:${NC}"

    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "   ${GREEN}🎉 All tests passed! The JyotAIshya application is fully functional.${NC}"
    else
        echo -e "   ${YELLOW}🔧 $FAILED_TESTS test(s) failed. Review the failed tests above.${NC}"
        echo -e "   ${YELLOW}📊 Check server logs and database connectivity for detailed error information.${NC}"
        echo -e "   ${YELLOW}🌐 Ensure all required environment variables are properly configured.${NC}"
    fi

    # Save results to file
    {
        echo "JyotAIshya API Test Results - $(date)"
        echo "=================================="
        echo "Total Tests: $TOTAL_TESTS"
        echo "Passed: $PASSED_TESTS"
        echo "Failed: $FAILED_TESTS"
        echo "Success Rate: $(( (PASSED_TESTS * 100) / TOTAL_TESTS ))%"
        echo ""
        echo "API Tested: $API_URL"
        echo "Test Timestamp: $(date -Iseconds)"
    } > test-results.txt

    echo -e "\n${CYAN}📄 Test results saved to: test-results.txt${NC}"
}

# Main execution
main() {
    echo -e "${CYAN}🚀 STARTING COMPREHENSIVE JYOTAISHYA API TESTING${NC}"
    echo -e "${CYAN}$(printf '=%.0s' {1..80})${NC}"
    echo -e "This will test all API endpoints using curl commands:"
    echo -e "• Server connectivity (Local/Deployed API)"
    echo -e "• Health endpoint"
    echo -e "• User authentication and registration"
    echo -e "• Kundali generation"
    echo -e "• Error handling"
    echo -e "${CYAN}$(printf '=%.0s' {1..80})${NC}"

    # Create temp directory for responses
    mkdir -p /tmp

    # Run tests
    test_server_connectivity
    test_health_endpoint
    test_user_registration
    test_kundali_generation
    test_error_handling

    # Generate report
    generate_report

    # Cleanup
    rm -f /tmp/*_response.json 2>/dev/null

    # Exit with appropriate code
    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "\n${GREEN}🎉 All tests completed successfully!${NC}"
        exit 0
    else
        echo -e "\n${RED}💥 Some tests failed. Check the report above.${NC}"
        exit 1
    fi
}

# Handle command line arguments
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "JyotAIshya API Test Suite (curl-based)"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --help, -h          Show this help message"
    echo "  --local             Test only local server"
    echo "  --deployed          Test only deployed API"
    echo ""
    echo "Examples:"
    echo "  $0                  # Test both local and deployed API"
    echo "  $0 --local          # Test local server only"
    echo "  $0 --deployed       # Test deployed API only"
    exit 0
fi

# Modify configuration based on arguments
if [ "$1" = "--local" ]; then
    API_BASE="$LOCAL_API"
elif [ "$1" = "--deployed" ]; then
    LOCAL_API=""
fi

# Run the tests
main
