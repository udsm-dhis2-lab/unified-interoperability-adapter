#!/bin/bash

# Test script to find working admin password
API_BASE="http://localhost:8091/api/v1"

# List of common passwords to try
PASSWORDS=(
    "AdminUser"
    "password123"
    "admin"
    "password"
    "AdminUser123"
    "admin123"
    "Password"
    "Password123"
    "root"
    "test"
    "123456"
    "Admin"
)

echo "🔍 Testing admin passwords..."
echo "================================"

for password in "${PASSWORDS[@]}"; do
    echo -n "Testing password: '$password' ... "
    
    RESPONSE=$(curl -s -X POST $API_BASE/login \
        -H "Content-Type: application/json" \
        -d "{\"username\": \"admin\", \"password\": \"$password\"}")
    
    if echo "$RESPONSE" | jq -e '.authenticated == true' > /dev/null 2>&1; then
        TOKEN=$(echo "$RESPONSE" | jq -r '.token')
        echo "✅ SUCCESS! Password found: '$password'"
        echo "Token: ${TOKEN:0:50}..."
        
        echo ""
        echo "🧪 Testing user creation with found password..."
        USER_RESPONSE=$(curl -s -X POST $API_BASE/users \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -d '{
                "username": "testuser_'$(date +%s)'",
                "password": "TestPassword123!",
                "firstName": "Test",
                "surname": "User",
                "email": "test@example.com"
            }')
        
        echo "User creation response: $USER_RESPONSE"
        
        if echo "$USER_RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
            echo "🎉 SUCCESS! User creation works!"
            USERNAME=$(echo "$USER_RESPONSE" | jq -r '.user.username')
            echo "Created user: $USERNAME"
        else
            echo "❌ User creation failed, but login works"
        fi
        exit 0
    else
        echo "❌ Failed"
    fi
done

echo ""
echo "🚨 No working password found from common list."
echo "📋 Next steps:"
echo "  1. Restart the backend server to apply UserInitializer changes"
echo "  2. Or manually update the database password"
echo "  3. Or check the backend logs for any clues"