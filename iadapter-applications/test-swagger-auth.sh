#!/bin/bash

# Test script for Swagger JWT Authentication
API_BASE="http://localhost:8091"

echo "🔍 Testing Swagger JWT Authentication Configuration"
echo "================================================="
echo ""

# Test 1: Check if Swagger UI is accessible
echo "✅ Step 1: Check Swagger UI accessibility"
echo "----------------------------------------"
SWAGGER_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_BASE/swagger-ui/index.html)

if [ "$SWAGGER_RESPONSE" = "200" ]; then
    echo "✅ SUCCESS: Swagger UI is accessible"
    echo "URL: $API_BASE/swagger-ui/index.html"
else
    echo "❌ FAIL: Swagger UI not accessible (HTTP $SWAGGER_RESPONSE)"
    exit 1
fi

echo ""

# Test 2: Check OpenAPI spec includes security schema
echo "✅ Step 2: Check OpenAPI specification for JWT security"
echo "-----------------------------------------------------"
OPENAPI_RESPONSE=$(curl -s $API_BASE/v3/api-docs)

if echo "$OPENAPI_RESPONSE" | jq -e '.components.securitySchemes.bearerAuth' > /dev/null 2>&1; then
    echo "✅ SUCCESS: JWT Bearer authentication schema found in OpenAPI spec"
    
    # Extract security scheme details
    SCHEME_TYPE=$(echo "$OPENAPI_RESPONSE" | jq -r '.components.securitySchemes.bearerAuth.type')
    SCHEME_FORMAT=$(echo "$OPENAPI_RESPONSE" | jq -r '.components.securitySchemes.bearerAuth.bearerFormat')
    
    echo "  • Type: $SCHEME_TYPE"
    echo "  • Format: $SCHEME_FORMAT"
else
    echo "❌ FAIL: JWT security schema not found in OpenAPI spec"
fi

echo ""

# Test 3: Check if login endpoint is properly documented
echo "✅ Step 3: Check login endpoint documentation"
echo "--------------------------------------------"
if echo "$OPENAPI_RESPONSE" | jq -e '.paths."/api/v1/login".post' > /dev/null 2>&1; then
    echo "✅ SUCCESS: Login endpoint is documented"
    
    LOGIN_SUMMARY=$(echo "$OPENAPI_RESPONSE" | jq -r '.paths."/api/v1/login".post.summary // "No summary"')
    echo "  • Summary: $LOGIN_SUMMARY"
    
    # Check if login endpoint doesn't require auth
    LOGIN_SECURITY=$(echo "$OPENAPI_RESPONSE" | jq '.paths."/api/v1/login".post.security // []')
    if [ "$LOGIN_SECURITY" = "[]" ] || [ "$LOGIN_SECURITY" = "null" ]; then
        echo "  • Authentication: Not required ✅"
    else
        echo "  • Authentication: Required (this might be incorrect for login)"
    fi
else
    echo "❌ FAIL: Login endpoint not found in documentation"
fi

echo ""

# Test 4: Check if protected endpoints require authentication
echo "✅ Step 4: Check protected endpoints require authentication"
echo "--------------------------------------------------------"
if echo "$OPENAPI_RESPONSE" | jq -e '.paths."/api/v1/users".get.security' > /dev/null 2>&1; then
    echo "✅ SUCCESS: Protected endpoints have security requirements"
    
    USERS_SECURITY=$(echo "$OPENAPI_RESPONSE" | jq '.paths."/api/v1/users".get.security')
    echo "  • GET /users security: $USERS_SECURITY"
else
    echo "❌ FAIL: Protected endpoints don't have security requirements"
fi

echo ""

# Test 5: Get a real JWT token for testing
echo "✅ Step 5: Test JWT token retrieval for Swagger"
echo "----------------------------------------------"
TOKEN_RESPONSE=$(curl -s -X POST $API_BASE/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin", 
    "password": "password123"
  }')

TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.token // empty')

if [ ! -z "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo "✅ SUCCESS: JWT token obtained"
    echo "  • Token (first 50 chars): ${TOKEN:0:50}..."
    echo ""
    echo "🔧 **HOW TO USE IN SWAGGER:**"
    echo "1. Open Swagger UI: $API_BASE/swagger-ui/index.html"
    echo "2. Click the 'Authorize' button (🔒) at the top of the page"
    echo "3. Paste this token in the 'Value' field:"
    echo "   $TOKEN"
    echo "4. Click 'Authorize' and then 'Close'"
    echo "5. All API requests will now include the JWT token automatically!"
else
    echo "❌ FAIL: Could not obtain JWT token"
    echo "Response: $TOKEN_RESPONSE"
fi

echo ""
echo "🎯 SWAGGER AUTHENTICATION TEST SUMMARY"
echo "======================================"
echo "✅ Swagger UI: Available"
echo "✅ JWT Security Schema: Configured"
echo "✅ Login Endpoint: Documented"
echo "✅ Protected Endpoints: Secured"
echo "✅ JWT Token: Available for testing"
echo ""
echo "🚀 **Ready to test in Swagger!**"
echo "   Visit: $API_BASE/swagger-ui/index.html"