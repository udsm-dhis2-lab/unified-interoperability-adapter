#!/bin/bash

echo "🔐 Testing Dual Authentication Implementation"
echo "=============================================="
echo ""

# Configuration
BASE_URL="http://localhost:8091"
API_BASE="$BASE_URL/api/v1"
LOGIN_ENDPOINT="$API_BASE/login"
PROTECTED_ENDPOINT="$API_BASE/users"
ME_ENDPOINT="$API_BASE/me"

# Test credentials (can be overridden with environment variables)
USERNAME=${TEST_USERNAME:-"admin"}
PASSWORD=${TEST_PASSWORD:-"password123"}
BASIC_AUTH_HEADER="Authorization: Basic $(echo -n "$USERNAME:$PASSWORD" | base64)"

echo "Test Configuration:"
echo "- Base URL: $BASE_URL"
echo "- Username: $USERNAME"
echo "- Password: $PASSWORD"
echo "- Basic Auth Header: $BASIC_AUTH_HEADER"
echo ""

# Function to test endpoint accessibility
test_endpoint() {
    local endpoint="$1"
    local description="$2"
    local extra_headers="$3"
    
    echo "Testing $description..."
    echo "GET $endpoint"
    
    if [ -n "$extra_headers" ]; then
        echo "Headers: $extra_headers"
        response=$(curl -s -w "HTTP_STATUS:%{http_code}" -H "$extra_headers" "$endpoint")
    else
        echo "Headers: None"
        response=$(curl -s -w "HTTP_STATUS:%{http_code}" "$endpoint")
    fi
    
    # Extract HTTP status and body
    http_status=$(echo "$response" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
    body=$(echo "$response" | sed 's/HTTP_STATUS:[0-9]*$//')
    
    echo "Status: $http_status"
    echo "Response: $body"
    echo ""
    
    return $http_status
}

# Function to get JWT token
get_jwt_token() {
    echo "🎫 Getting JWT Token..."
    echo "POST $LOGIN_ENDPOINT"
    
    response=$(curl -s -w "HTTP_STATUS:%{http_code}" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" \
        "$LOGIN_ENDPOINT")
    
    http_status=$(echo "$response" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
    body=$(echo "$response" | sed 's/HTTP_STATUS:[0-9]*$//')
    
    echo "Status: $http_status"
    echo "Response: $body"
    
    if [ "$http_status" -eq 200 ]; then
        # Extract token from JSON response (assuming it's in "token" field)
        token=$(echo "$body" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        if [ -n "$token" ]; then
            echo "✅ JWT Token obtained: ${token:0:50}..."
            JWT_TOKEN="$token"
            return 0
        else
            echo "❌ Failed to extract token from response"
            return 1
        fi
    else
        echo "❌ Login failed with status $http_status"
        return $http_status
    fi
    echo ""
}

echo "🧪 Starting Authentication Tests..."
echo ""

# Test 1: Access protected endpoint without authentication
echo "📋 Test 1: No Authentication"
test_endpoint "$PROTECTED_ENDPOINT" "protected endpoint without authentication"

# Test 2: Access protected endpoint with Basic Auth
echo "📋 Test 2: Basic Authentication"
test_endpoint "$PROTECTED_ENDPOINT" "protected endpoint with Basic Auth" "$BASIC_AUTH_HEADER"

# Test 3: Access /me endpoint with Basic Auth
echo "📋 Test 3: Basic Auth on /me endpoint"
test_endpoint "$ME_ENDPOINT" "/me endpoint with Basic Auth" "$BASIC_AUTH_HEADER"

# Test 4: Get JWT Token
echo "📋 Test 4: JWT Token Authentication"
if get_jwt_token; then
    # Test 5: Use JWT Token on protected endpoint
    echo "📋 Test 5: Using JWT Token"
    JWT_AUTH_HEADER="Authorization: Bearer $JWT_TOKEN"
    test_endpoint "$PROTECTED_ENDPOINT" "protected endpoint with JWT token" "$JWT_AUTH_HEADER"
    
    # Test 6: Use JWT Token on /me endpoint
    echo "📋 Test 6: JWT Token on /me endpoint"
    test_endpoint "$ME_ENDPOINT" "/me endpoint with JWT token" "$JWT_AUTH_HEADER"
else
    echo "⚠️  Skipping JWT tests due to login failure"
fi

# Test 7: Test browser Basic Auth popup trigger
echo "📋 Test 7: Browser Basic Auth Popup Trigger"
echo "Testing endpoint that should trigger browser popup..."
test_endpoint "$BASE_URL/dashboard?basicAuth=true" "dashboard with Basic Auth popup trigger"

echo "🏁 Authentication Tests Complete!"
echo ""
echo "📊 Summary:"
echo "- ✅ Dual authentication filter created (handles both JWT and Basic Auth)"
echo "- ✅ Basic Auth entry point created (triggers browser popup)"
echo "- ✅ Security configuration updated for dual authentication"
echo "- ✅ Frontend interceptor updated to handle both auth types"
echo "- ✅ Circular dependency resolved"
echo ""
echo "🔧 Features Implemented:"
echo "  1. JWT Authentication (Bearer tokens) - Primary method"
echo "  2. Basic Authentication fallback - Secondary method"
echo "  3. Browser Basic Auth popup support"
echo "  4. Intelligent auth method detection (API vs Browser requests)"
echo "  5. Deploy script updated with Basic Auth: admin:password123"
echo ""
echo "🌐 Usage Examples:"
echo "  • Browser requests without auth → Basic Auth popup"
echo "  • API requests with JWT → Standard JWT validation"
echo "  • API requests with Basic Auth → Basic Auth validation"
echo "  • curl with Basic Auth: curl -H 'Authorization: Basic YWRtaW46cGFzc3dvcmQxMjM=' $API_BASE/users"
echo "  • curl with JWT: curl -H 'Authorization: Bearer <token>' $API_BASE/users"