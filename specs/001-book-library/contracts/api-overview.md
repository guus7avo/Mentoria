# API Contracts: Personal Book Library Tracker

**Feature**: 001-book-library  
**Date**: 2026-04-11  
**Base URL**: `http://localhost:3000/api` (dev) | `https://mentoria.example.com/api` (production)

## Overview

All API endpoints follow RESTful conventions with standardized response formats. Authentication via existing system (JWT token in Authorization header assumed).

### Standard Response Format

**Success (Status 200-201)**:
```json
{
  "success": true,
  "data": { /* response body */ },
  "error": null
}
```

**Error (Status 400-500)**:
```json
{
  "success": false,
  "data": null,
  "error": "Human-readable error message"
}
```

### HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | GET successful, data returned |
| 201 | POST successful, resource created |
| 204 | DELETE successful, no content returned |
| 400 | Bad request (validation error, missing fields) |
| 401 | Unauthorized (missing/invalid auth token) |
| 404 | Resource not found |
| 409 | Conflict (duplicate book add, invalid status transition) |
| 500 | Server error (log it, return generic message) |
| 503 | Service unavailable (Google Books API down) |

### Authentication

All endpoints require authentication (except `/search` - public endpoint for API discovery).

Header: `Authorization: Bearer {jwt_token}`

---

## API Endpoints Overview

### Book Search (Public)
- `GET /search` - Search books via Google Books API

### Library Management (Authenticated)
- `GET /library` - List user's books with filters/sorting
- `POST /library` - Add book to library
- `PUT /library/{id}` - Update book status/progress/rating
- `DELETE /library/{id}` - Remove book from library

### Dashboard & Statistics (Authenticated)
- `GET /dashboard` - Get reading statistics

---

## Detailed Endpoint Specifications

See individual contract files:
- [book-search.md](./book-search.md) - Search endpoint specification
- [library-management.md](./library-management.md) - Library CRUD operations
- [dash board-stats.md](./dashboard-stats.md) - Analytics and statistics

---

## Pagination Strategy

Library endpoints support pagination for large collections:

**Query Parameters**:
- `page` (default: 1) - Page number, 1-indexed
- `limit` (default: 20, max: 100) - Items per page

**Response**:
```json
{
  "success": true,
  "data": {
    "items": [ /* array of books */ ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

---

## Filtering & Sorting

### Filtering

**Status Filter**:
- Query: `?status=WANT_TO_READ,IN_PROGRESS` (comma-separated)
- Values: `WANT_TO_READ`, `IN_PROGRESS`, `COMPLETED`
- Default: all statuses

### Sorting

**Sort Options**:
- `dateAdded` (default, newest first)
- `dateCompleted` (oldest complete first)
- `title` (A-Z)
- `author` (A-Z)
- `rating` (highest first)

**Query**: `?sort=dateAdded&order=desc`

---

## Error Handling

### Validation Errors (400)
```json
{
  "success": false,
  "error": "Validation failed: pagesRead must be <= pageCount (300)"
}
```

### Duplicate Book (409)
```json
{
  "success": false,
  "error": "This book is already in your library. To restart reading, change its status to IN_PROGRESS."
}
```

### API Service Down (503)
```json
{
  "success": false,
  "error": "Book search service is temporarily unavailable. Please try again later."
}
```

---

## Rate Limiting

**Limits**:
- Search endpoint: 100 requests/minute per user
- Library endpoints: 1000 requests/minute per user
- Header: `X-RateLimit-Remaining` indicates remaining requests

**Exceeded**: Returns 429 (Too Many Requests)

---

## Logging & Observability

All API calls logged with:
- User ID, timestamp, endpoint, method
- Request parameters (sanitized)
- Response status, latency
- Errors/exceptions (full stack trace in debug mode)

Sensitive data (tokens, passwords) never logged.

---

## Authentication & Authorization

**Current Assumption**: Uses existing Booklog authentication (JWT, session, or similar)

**Per-User Isolation**:
- All library endpoints scoped to authenticated user
- Cannot access other users' libraries
- Ratings/reviews returned only for requesting user

---

## Versioning

Currently v1 (no versioning in URLs). If breaking changes needed:
- New endpoints: `/api/v2/library`
- Sunset old endpoints with deprecation warning
- Backward compatibility preferred over versioning

---

## Next Steps

See individual contract files for detailed request/response examples and test scenarios.
