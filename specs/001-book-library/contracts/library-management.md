# API Contract: Library Management

**Endpoints**: 
- `GET /library` - List user's books
- `POST /library` - Add book to library
- `PUT /library/{id}` - Update book (status/progress/rating)
- `DELETE /library/{id}` - Remove book from library

**Authentication**: Required (JWT token)  
**Purpose**: Manage user's personal book library

---

## GET /library - List Books

### Request

```
GET /api/library?status=WANT_TO_READ,IN_PROGRESS&sort=dateAdded&order=desc&page=1&limit=20&search=gatsby
```

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | all | Filter by status (comma-separated: `WANT_TO_READ`, `IN_PROGRESS`, `COMPLETED`) |
| `sort` | string | `dateAdded` | Sort by: `dateAdded`, `dateCompleted`, `title`, `author`, `rating` |
| `order` | string | `desc` | Sort order: `asc` or `desc` |
| `page` | integer | 1 | Page number (1-indexed) |
| `limit` | integer | 20 | Items per page (max: 100) |
| `search` | string | - | Filter by title or author (partial match) |

### Example

```
GET /api/library?status=IN_PROGRESS&sort=dateStarted&order=asc&limit=10
```

### Response (200)

```json
{
  "success": true,
  "data": {
    "books": [
      {
        "id": "userbook-uuid-1",
        "bookId": "book-uuid-1",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "coverImageUrl": "https://...",
        "status": "IN_PROGRESS",
        "pagesRead": 120,
        "pageCount": 180,
        "completionPercentage": 66.7,
        "rating": null,
        "dateAdded": "2026-04-05T10:30:00Z",
        "dateStarted": "2026-04-06T14:15:00Z",
        "dateCompleted": null
      },
      {
        "id": "userbook-uuid-2",
        "bookId": "book-uuid-2",
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "coverImageUrl": "https://...",
        "status": "COMPLETED",
        "pagesRead": 281,
        "pageCount": 281,
        "completionPercentage": 100.0,
        "rating": 5,
        "reviewText": "Absolutely brilliant. A must-read.",
        "dateAdded": "2026-03-01T08:00:00Z",
        "dateStarted": "2026-03-10T16:45:00Z",
        "dateCompleted": "2026-04-01T20:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 42,
      "pages": 3
    }
  },
  "error": null
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `books[].id` | string | Unique UserBook ID |
| `books[].bookId` | string | Reference to Book (for detail page) |
| `books[].title` | string | Book title |
| `books[].author` | string | Author name |
| `books[].coverImageUrl` | string | Cover image URL |
| `books[].status` | string | `WANT_TO_READ`, `IN_PROGRESS`, or `COMPLETED` |
| `books[].pagesRead` | integer | Pages read (null for WANT_TO_READ) |
| `books[].pageCount` | integer | Total pages (null if unknown) |
| `books[].completionPercentage` | decimal | Calculated percentage (0-100) |
| `books[].rating` | integer\|null | User's rating (1-5, null if unrated) |
| `books[].reviewText` | string\|null | User's review |
| `books[].dateAdded` | ISO 8601 | When added to library |
| `books[].dateStarted` | ISO 8601\|null | When status changed to IN_PROGRESS |
| `books[].dateCompleted` | ISO 8601\|null | When marked COMPLETED |

---

## POST /library - Add Book

### Request

```
POST /api/library
Content-Type: application/json
Authorization: Bearer {token}

{
  "bookId": "google-books-id-or-isbn",
  "initialStatus": "WANT_TO_READ"
}
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bookId` | string | YES | Google Books ID or ISBN (search endpoint result) |
| `initialStatus` | string | YES | `WANT_TO_READ`, `IN_PROGRESS`, or `COMPLETED` |

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "userbook-uuid-new",
    "bookId": "book-uuid-1",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "status": "WANT_TO_READ",
    "pagesRead": null,
    "pageCount": 180,
    "completionPercentage": 0,
    "rating": null,
    "dateAdded": "2026-04-11T14:22:00Z",
    "message": "Book added to your library"
  },
  "error": null
}
```

### Error: Duplicate Book (409)

```json
{
  "success": false,
  "data": null,
  "error": "This book is already in your library. To restart reading, change its status to IN_PROGRESS."
}
```

### Error: Invalid Status (400)

```json
{
  "success": false,
  "data": null,
  "error": "Invalid status. Must be one of: WANT_TO_READ, IN_PROGRESS, COMPLETED"
}
```

---

## PUT /library/{id} - Update Book

### Request

```
PUT /api/library/userbook-uuid-1
Content-Type: application/json
Authorization: Bearer {token}

{
  "status": "IN_PROGRESS",
  "pagesRead": 120,
  "rating": 4,
  "reviewText": "Great so far, can't put it down!"
}
```

### Request Body (all optional, update only what's present)

| Field | Type | Valid Values | Description |
|-------|------|--------------|-------------|
| `status` | string | `WANT_TO_READ`, `IN_PROGRESS`, `COMPLETED` | Change reading status |
| `pagesRead` | integer | 0 to pageCount | Pages read (for IN_PROGRESS/COMPLETED) |
| `rating` | integer | 1-5 or null | User's rating |
| `reviewText` | string | max 5000 chars, or null | User's review |

### Response (200)

```json
{
  "success": true,
  "data": {
    "id": "userbook-uuid-1",
    "bookId": "book-uuid-1",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "status": "IN_PROGRESS",
    "pagesRead": 120,
    "pageCount": 180,
    "completionPercentage": 66.7,
    "rating": 4,
    "reviewText": "Great so far, can't put it down!",
    "dateStarted": "2026-04-06T14:15:00Z",
    "lastModified": "2026-04-11T14:25:00Z",
    "message": "Book updated successfully"
  },
  "error": null
}
```

### Error: Pages Exceed Total (400)

```json
{
  "success": false,
  "data": null,
  "error": "Pages read (350) cannot exceed total pages (180)"
}
```

### Error: Not Found (404)

```json
{
  "success": false,
  "data": null,
  "error": "Book not found in your library"
}
```

---

## DELETE /library/{id} - Remove Book

### Request

```
DELETE /api/library/userbook-uuid-1
Authorization: Bearer {token}
```

### Response (204 No Content)

```
HTTP/1.1 204 No Content
```

Or with body:

```json
{
  "success": true,
  "data": { "message": "Book removed from library" },
  "error": null
}
```

### Error: Not Found (404)

```json
{
  "success": false,
  "data": null,
  "error": "Book not found in your library"
}
```

---

## Status Transition Rules

When updating status, system automatically manages timestamps:

| From | To | Action |
|------|----|----|
| WANT_TO_READ | IN_PROGRESS | Set `dateStarted` = now, clear `pagesRead` to 0 |
| IN_PROGRESS | COMPLETED | Set `dateCompleted` = now |
| COMPLETED | IN_PROGRESS | Clear `dateCompleted`, reset `pagesRead` to 0 |
| Any | Any | Update `lastModified` timestamp |

---

## Business Rules

1. **No Duplicates**: Same book (by ISBN or Google Books ID) cannot appear twice per user
2. **Page Count Validation**: If `pageCount` exists, `pagesRead` ≤ `pageCount`
3. **Rating Constraints**: Rating must be 1-5 or null (no partial ratings)
4. **Review Privacy**: Reviews are user-private only
5. **Immutable Fields**: `dateAdded` cannot be changed after creation

---

## Implementation Notes

1. **Unique Constraint**: Database enforces `UNIQUE(userId, bookId)` to prevent add duplicates
2. **Transaction**: Add book → Fetch/create Book record → Create UserBook in single transaction
3. **Timestamp Logic**: Service layer manages `dateStarted`, `dateCompleted` based on status changes
4. **Calculation**: `completionPercentage` calculated in response layer (not stored)

---

## Test Cases

| Method | Scenario | Expected |
|--------|----------|----------|
| POST | Add new book to library | 201, UserBook created |
| POST | Add duplicate book | 409, error message |
| GET | Fetch library for signed-in user | 200, paginated list |
| GET | Filter by status=IN_PROGRESS | 200, only IN_PROGRESS books |
| GET | Search by author | 200, filtered results |
| PUT | Update status from WANT to IN_PROGRESS | 200, dateStarted set |
| PUT | Update pages with invalid value | 400, validation error |
| DELETE | Remove book from library | 204 or 200 with message |

