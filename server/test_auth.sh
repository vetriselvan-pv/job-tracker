
#!/bin/bash

BASE_URL="http://localhost:3000/auth"

echo "Testing Auth API..."

# 1. Create User
echo "1. Creating User..."
RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}')
echo "Response: $RESPONSE"

USER_ID=$(echo $RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$USER_ID" ]; then
  echo "Failed to create user or extract ID. Exiting."
  exit 1
fi

echo "Created User ID: $USER_ID"

# 2. Update User
echo "2. Updating User..."
curl -s -X PUT "$BASE_URL/users/$USER_ID" \
  -H "Content-Type: application/json" \
  -d '{"email": "updated@example.com"}'
echo ""

# 3. Delete User
echo "3. Deleting User..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE_URL/users/$USER_ID")

if [ "$STATUS_CODE" -eq 204 ]; then
  echo "User deleted successfully (204)."
else
  echo "Failed to delete user. Status code: $STATUS_CODE"
fi
