✅ 2xx – Success
200 OK → Request successful (GET, PUT, PATCH)
201 Created → Resource successfully created (POST)
204 No Content → Success but no response body (DELETE)

⚠️ 4xx – Client Errors
400 Bad Request → Invalid input / validation failed
401 Unauthorized → Authentication required / invalid token
403 Forbidden → Authenticated but no permission
404 Not Found → Resource not found (ID wrong / null)
409 Conflict → Duplicate data (e.g., email already exists)
422 Unprocessable Entity → Validation error (semantic issue in data)

❌ 5xx – Server Errors
500 Internal Server Error → Unexpected error (catch block)
502 Bad Gateway → Upstream server error
503 Service Unavailable → Server down / overloaded