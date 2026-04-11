# API Contract: Dashboard & Statistics

**Endpoint**: `GET /dashboard`  
**Authentication**: Required (JWT token)  
**Purpose**: Retrieve reading statistics and activity overview for dashboard

---

## GET /dashboard

### Request

```
GET /api/dashboard
Authorization: Bearer {token}
```

No query parameters required.

### Response (200)

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalBooks": 42,
      "wantToRead": 15,
      "inProgress": 8,
      "completed": 19
    },
    "statistics": {
      "averageRating": 4.2,
      "ratedBooks": 12,
      "unratedCompleted": 7,
      "completionThisMonth": 3,
      "completionThisYear": 18,
      "averagePagesPerBook": 287
    },
    "recentActivity": [
      {
        "id": "userbook-uuid-1",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "action": "COMPLETED",
        "actionDate": "2026-04-10T19:30:00Z",
        "rating": 4,
        "coverImageUrl": "https://..."
      },
      {
        "id": "userbook-uuid-2",
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "action": "ADDED",
        "actionDate": "2026-04-08T14:15:00Z",
        "coverImageUrl": "https://..."
      },
      {
        "id": "userbook-uuid-3",
        "title": "1984",
        "author": "George Orwell",
        "action": "STARTED_READING",
        "actionDate": "2026-04-05T10:45:00Z",
        "coverImageUrl": "https://..."
      }
    ],
    "currentReading": [
      {
        "id": "userbook-uuid-10",
        "title": "Norwegian Wood",
        "author": "Haruki Murakami",
        "pagesRead": 245,
        "pageCount": 608,
        "completionPercentage": 40.3,
        "dateStarted": "2026-03-15T08:00:00Z",
        "estimatedCompletionDate": "2026-05-10"
      },
      {
        "id": "userbook-uuid-11",
        "title": "The Midnight Library",
        "author": "Matt Haig",
        "pagesRead": 180,
        "pageCount": 288,
        "completionPercentage": 62.5,
        "dateStarted": "2026-04-01T16:30:00Z",
        "estimatedCompletionDate": "2026-04-20"
      }
    ]
  },
  "error": null
}
```

### Response Fields

#### `summary` Object
| Field | Type | Description |
|-------|------|-------------|
| `totalBooks` | integer | Total books in user's library |
| `wantToRead` | integer | Count in WANT_TO_READ status |
| `inProgress` | integer | Count in IN_PROGRESS status |
| `completed` | integer | Count in COMPLETED status |

#### `statistics` Object
| Field | Type | Description |
|-------|------|-------------|
| `averageRating` | decimal | Mean of user's ratings (users must have given at least 1 rating) |
| `ratedBooks` | integer | How many books user has rated |
| `unratedCompleted` | integer | Completed books without rating |
| `completionThisMonth` | integer | Books marked COMPLETED in current month |
| `completionThisYear` | integer | Books marked COMPLETED in current year |
| `averagePagesPerBook` | integer | Average page count across all books |

#### `recentActivity` Array
Array of up to 10 most recent actions (add, start, complete, rate). Each item:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | UserBook ID |
| `title` | string | Book title |
| `author` | string | Author name |
| `action` | string | `ADDED`, `STARTED_READING`, `COMPLETED`, `RATED`, `REVIEWED` |
| `actionDate` | ISO 8601 | When action occurred |
| `rating` | integer\|null | Rating if action is RATED or book is rated |
| `coverImageUrl` | string | Book cover for display |

#### `currentReading` Array
Books with status IN_PROGRESS (sorted by recently started). Each item:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | UserBook ID |
| `title` | string | Book title |
| `author` | string | Author name |
| `pagesRead` | integer | Current page progress |
| `pageCount` | integer | Total pages |
| `completionPercentage` | decimal | Calculated percentage |
| `dateStarted` | ISO 8601 | When user started reading |
| `estimatedCompletionDate` | date | Calculated based on reading pace (heuristic) |

---

## Calculations

### Average Rating
```
averageRating = SUM(rating) / COUNT(rating > 0)
```
- Only include books where user has rated (1-5)
- Return null if no ratings exist

### Completion This Month/Year
```
WHERE dateCompleted >= START_OF_PERIOD
```
- Month: UTC month boundaries
- Year: UTC year boundaries

### Estimated Completion Date
```
Heuristic: Based on reading pace
- If reading started < 7 days ago: not estimated
- Otherwise: (pagesRemaining / pagesPerDay) from dateStarted
- pagesPerDay = (pagesRead - 0) / (now - dateStarted) in days
```

---

## Error Responses

### Unauthorized (401)
```json
{
  "success": false,
  "data": null,
  "error": "Unauthorized. Please sign in."
}
```

### Server Error (500)
```json
{
  "success": false,
  "data": null,
  "error": "Failed to load dashboard. Please try again."
}
```

---

## Performance Notes

- **Query Optimization**: Dashboard aggregates from single `user_books` table (no complex joins)
- **Caching Strategy**: Results can be cached for 60 seconds per user (statistics don't need real-time)
- **Typical Latency**: 200-500ms (all data from PostgreSQL, no external API calls)
- **Scalability**: Works efficiently for users with 10,000+ books

---

## Data Freshness

- Statistics updated within 2 seconds of any library change (per FR-005)
- If caching implemented, max 60-second staleness is acceptable
- Recent activity always includes latest 10 state changes

---

## Implementation Notes

1. **Recent Activity Query**:
   - Use UNION of changed timestamps to determine most recent actions
   - Limit to 10 most recent events
   - Order by descending timestamp

2. **Estimated Completion**:
   - Calculate reading velocity: pages/day
   - Only estimate if >7 days of reading history
   - Could be sophisticated (account for weekends) in future

3. **Zero-Book Edge Case**:
   - If user has no books, return all zeros/empty arrays
   - Don't error out

4. **Aggregation**:
   - Use SQL GROUP BY and aggregate functions (SUM, COUNT, AVG)
   - Avoid loading individual books if only totals needed

---

## Test Cases

| Scenario | Expected |
|----------|----------|
| User with 0 books | Empty summary, blank statistics |
| User with 5 books, 0 ratings | averageRating = null, ratedBooks = 0 |
| User completed 3 this month | completionThisMonth = 3 |
| User reading 2 books | currentReading returns both with progress |
| Recent activity with 5 actions | Return all 5 in descending date order |
| Unauthorized request | 401 error |

