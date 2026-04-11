# API Contract: Book Search

**Endpoint**: `GET /search`  
**Authentication**: Not required (public endpoint)  
**Purpose**: Search for books using Google Books API

---

## Request

### Method & URL
```
GET /api/search?q={query}&type={searchType}&limit={limit}
```

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | YES | - | Search query (title, author, ISBN) |
| `type` | string | NO | `all` | Search type: `title`, `author`, `isbn`, `all` |
| `limit` | integer | NO | `10` | Number of results (max: 40) |

### Examples

**Search by Title**:
```
GET /api/search?q=The%20Great%20Gatsby&type=title&limit=20
```

**Search by Author**:
```
GET /api/search?q=F%20Scott%20Fitzgerald&type=author&limit=10
```

**Search by ISBN**:
```
GET /api/search?q=9780743273565&type=isbn
```

**Search All Fields**:
```
GET /api/search?q=gatsby&limit=5
```

---

## Response

### Success (200)

```json
{
  "success": true,
  "data": {
    "query": "The Great Gatsby",
    "totalResults": 127,
    "results": [
      {
        "id": "google-books-id-1",
        "isbn": "9780743273565",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "publishedDate": "1925-04-10",
        "pageCount": 180,
        "description": "A classic American novel set in the Jazz Age...",
        "coverImageUrl": "https://books.google.com/books/content?id=...",
        "googleRating": 3.9,
        "googleRatingCount": 12345
      },
      {
        "id": "google-books-id-2",
        "isbn": null,
        "title": "The Great Gatsby (Annotated Version)",
        "author": "F. Scott Fitzgerald, Matthew J. Bruccoli (ed.)",
        "publishedDate": "2004-09-27",
        "pageCount": 304,
        "description": "An annotated critical edition...",
        "coverImageUrl": "https://books.google.com/books/content?id=...",
        "googleRating": 4.1,
        "googleRatingCount": 345
      }
    ]
  },
  "error": null
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `query` | string | The search query that was executed |
| `totalResults` | integer | Total matching books (not all returned) |
| `results[].id` | string | Google Books API ID (unique identifier) |
| `results[].isbn` | string\|null | ISBN-10 or ISBN-13 (may be null) |
| `results[].title` | string | Book title |
| `results[].author` | string | Primary author name |
| `results[].publishedDate` | date | Publication date (YYYY-MM-DD) |
| `results[].pageCount` | integer\|null | Total pages (may be missing from API) |
| `results[].description` | string | Book description (truncated if lengthy) |
| `results[].coverImageUrl` | string | URL to book cover image |
| `results[].googleRating` | decimal | Rating from Google Books (0-5, null if no ratings) |
| `results[].googleRatingCount` | integer | Number of ratings |

---

## Error Responses

### Bad Request (400)
**Cause**: Missing required parameter or invalid input

```json
{
  "success": false,
  "data": null,
  "error": "Search query (q) is required"
}
```

### Invalid Limit (400)
```json
{
  "success": false,
  "data": null,
  "error": "Limit must be between 1 and 40"
}
```

### No Results (200 with empty array)
```json
{
  "success": true,
  "data": {
    "query": "xyzabc123notreal",
    "totalResults": 0,
    "results": []
  },
  "error": null
}
```

### Google Books API Down (503)
**Cause**: Google Books API is unreachable or returning errors

```json
{
  "success": false,
  "data": null,
  "error": "Book search service is temporarily unavailable. Please try again in a few moments."
}
```

### Rate Limited (429)
**Cause**: Too many searches from this user/IP

```json
{
  "success": false,
  "data": null,
  "error": "Too many search requests. Please wait before searching again."
}
```

---

## Performance

- **Typical latency**: 500-1500ms (includes Google API call)
- **Timeout**: 10 seconds (user-friendly error if exceeded)
- **Caching**: Results not cached (fresh searches always hit Google API)

---

## Implementation Notes

1. **Query Building**: Convert `type` parameter to Google Books query format
   - `title:` prefix for title search
   - `author:` prefix for author search
   - Direct ISBN search for ISBN type

2. **Error Handling**:
   - Catch Google API timeouts, return 503 with user-friendly message
   - Validate query length (max 256 characters)
   - Strip special characters that confuse Google API

3. **Response Transformation**:
   - Map Google Books API response to our standard format
   - Handle missing fields gracefully (null instead of omit)
   - Truncate long descriptions to 500 characters

4. **Rate Limiting**:
   - Implement per-user rate limit (100 req/min)
   - Use Redis or in-memory store for tracking

---

## Test Cases

| Scenario | Query | Expected |
|----------|-------|----------|
| Valid title search | `q=The%20Great%20Gatsby` | 200 with results |
| Empty query | `q=` | 400 error |
| No results | `q=xyz123notreal` | 200 with empty array |
| API down simulation | (mock Google timeout) | 503 error |
| Limit too high | `limit=50` | 400 error |
| Valid ISBN | `q=9780743273565` | 200 with results |

