# Quickstart Guide: Personal Book Library Tracker

**Feature**: 001-book-library  
**Date**: 2026-04-11  
**Audience**: Developers implementing the feature

---

## Overview

This guide provides developers with everything needed to understand, build, test, and deploy the Personal Book Library Tracker feature.

---

## Architecture Overview

```
Next.js (Full-Stack)
│
├── Frontend (React Components)
│   ├── Search Page
│   ├── Library View (with filters/sorting)
│   ├── Book Details Page
│   └── Dashboard
│
├── Backend (API Routes)
│   ├── /api/search → SearchService → Google Books API
│   ├── /api/library → LibraryService → Prisma → PostgreSQL
│   ├── /api/dashboard → DashboardService → PostgreSQL
│   └── Middleware (Auth, Validation)
│
└── Database (PostgreSQL with Prisma ORM)
    ├── users (from existing auth)
    ├── books (cached from Google Books)
    └── user_books (user's library entries)
```

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Google Books API key

### 1. Create Feature Branch

```bash
git checkout -b 001-book-library
```

### 2. Install Dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Environment Configuration

Create `.env.local` in project root:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mentoria"

# Google Books API
GOOGLE_BOOKS_API_KEY="your-api-key-here"

# Authentication (existing system)
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Logging
LOG_LEVEL="info"
NODE_ENV="development"
```

### 4. Database Setup

```bash
# Create/migrate database
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# (Optional) Seed test data
npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev

# Runs on http://localhost:3000
```

---

## Key Project Paths

| Path | Purpose |
|------|---------|
| `backend/src/services/` | Business logic (SearchService, LibraryService, etc.) |
| `backend/src/api/` | Next.js API routes (route handlers) |
| `backend/prisma/schema.prisma` | Database schema |
| `frontend/src/components/` | React components (BookCard, SearchBar, etc.) |
| `frontend/src/app/` | Page layouts (search/, library/) |
| `specs/001-book-library/` | Feature documentation |

---

## Core Services

### SearchService
**File**: `backend/src/services/searchService.ts`

Integrates with Google Books API:
```typescript
class SearchService {
  async search(query: string, type: 'title'|'author'|'isbn'|'all'): Promise<BookResult[]>
  // Returns: formatted results from Google Books API
}
```

**Key Methods**:
- `search(query, type)` - Main search method
- Error handling for API failures (graceful degradation)

### LibraryService
**File**: `backend/src/services/libraryService.ts`

Manages user's book collection:
```typescript
class LibraryService {
  async addBook(userId: string, bookId: string, status: BookStatus)
  async getLibrary(userId: string, filters: {status?, sort?})
  async updateBook(userId: string, bookId: string, updates: {status?, pagesRead?, rating?, reviewText?})
  async removeBook(userId: string, bookId: string)
}
```

**Key Business Logic**:
- Duplicate prevention via unique constraint (userId, bookId)
- Status transition with timestamp management
- Progress percentage calculation

### DashboardService
**File**: `backend/src/services/dashboardService.ts`

Calculates statistics:
```typescript
class DashboardService {
  async getStatistics(userId: string): Promise<DashboardData>
}
```

**Key Calculations**:
- Total/grouped book counts
- Average rating
- Recent activity aggregation
- Estimated completion dates

### ProgressService
**File**: `backend/src/services/progressService.ts`

Handles reading progress:
```typescript
class ProgressService {
  calculatePercentage(pagesRead: number, pageCount: number): Decimal
  validatePagesRead(pagesRead: number, pageCount: number): void
}
```

---

## API Route Structure

```
backend/src/api/
├── search/
│   └── route.ts                    # GET /api/search
├── library/
│   ├── route.ts                    # GET /api/library, POST /api/library
│   └── [id]/route.ts               # PUT /api/library/[id], DELETE /api/library/[id]
└── dashboard/
    └── route.ts                    # GET /api/dashboard
```

Each route handler:
1. Validates authentication (middleware)
2. Parses/validates request
3. Calls appropriate Service
4. Returns standardized response

---

## Frontend Components

### Key Components

| Component | Purpose |
|-----------|---------|
| `BookCard` | Displays book with cover, progress bar, rating |
| `SearchBar` | Input for book search with debounce |
| `LibraryGrid` | Grid/list view with filter/sort controls |
| `BookDetails` | Full book page with progress, rating forms |
| `Dashboard` | Statistics and recent activity |
| `ProgressTracker` | Input for pages read or percentage |

### State Management

Using React Context (or Zustand):
```typescript
LibraryContext {
  books: UserBook[]
  filters: { status: BookStatus[] }
  sort: 'dateAdded' | 'title' | 'author' | 'rating'
  setBooks(), applyFilter(), updateSort()
}
```

---

## Testing Strategy

### Unit Tests (Services)

```bash
npm run test -- searchService.test.ts
```

Focus on:
- SearchService query formatting
- ProgressService calculations
- LibraryService duplicate prevention

### Integration Tests (API Routes)

```bash
npm run test -- api/library.test.ts
```

Test complete request/response flows:
- POST /library (add book, check duplicate prevention)
- PUT /library/:id (update status, verify timestamps)
- GET /library (filtering, sorting, pagination)

### E2E Tests (Optional for MVP)

Use Playwright or Cypress for critical user flows:
- Search → Add book → View in library
- Update progress → See on dashboard

---

## Database Schema (Quick Reference)

```sql
-- Users (from existing auth system)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Books (cached from Google Books)
CREATE TABLE books (
  id UUID PRIMARY KEY,
  google_books_id VARCHAR(255) UNIQUE NOT NULL,
  isbn VARCHAR(20) UNIQUE,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  page_count INT,
  description TEXT,
  cover_image_url VARCHAR(512),
  google_rating DECIMAL(3,1),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User's Personal Library
CREATE TABLE user_books (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'WANT_TO_READ',
  pages_read INT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  date_added TIMESTAMP DEFAULT NOW(),
  date_started TIMESTAMP,
  date_completed TIMESTAMP,
  last_modified TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, book_id),
  INDEX idx_user_books_user_id (user_id),
  INDEX idx_user_books_status (status)
);
```

---

## Common Development Tasks

### Add a New API Endpoint

1. Create route handler in `backend/src/api/[path]/route.ts`
2. Import/call appropriate Service
3. Add validation via Zod schema
4. Return standardized response
5. Write integration test in `tests/integration/`

### Update Service Logic

1. Modify method in `backend/src/services/[service].ts`
2. Add business logic validation
3. Call Prisma for data access
4. Write unit test in `tests/unit/`

### Add Frontend Component

1. Create component in `frontend/src/components/`
2. Import TypeScript types from backend
3. Call API via `frontend/src/services/apiClient.ts`
4. Subscribe to library context for data

---

## Deployment Checklist

- [ ] Environment variables set (production database, API keys)
- [ ] Prisma migrations run on production
- [ ] Google Books API key tested with production URL
- [ ] Unit & integration tests passing
- [ ] Type checking: `tsc --noEmit`
- [ ] Linting: `eslint .`
- [ ] All API responses follow standard format
- [ ] Rate limiting configured
- [ ] Logging configured (Winston/Pino)
- [ ] CORS configured for frontend origin
- [ ] Database backups scheduled

---

## Troubleshooting

### Google Books API Returns 403
- Check API key is valid and enabled
- Verify key has Books API enabled in Google Cloud Console
- Check rate limit (100 req/min per user, 1000/min globally)

### Prisma Migration Issues
```bash
# Reset database (dev only!)
npx prisma migrate reset --force

# Check schema differences
npx prisma migrate diff
```

### Duplicate Book Error
- Check database unique constraint: `UNIQUE(user_id, book_id)`
- Verify bookId matching logic (ISBN vs Google Books ID)

### Frontend State Out of Sync
- Refresh page to reload from API
- Check React Context is updating correctly
- Verify useEffect dependencies

---

## Performance Tips

1. **Caching**: Book search results (Google API) cached for 24 hours
2. **Pagination**: Max 100 books per page load
3. **Indexes**: Database has indexes on (user_id, status) for quick filtering
4. **Batch Queries**: Use Prisma `include` to avoid N+1 queries

---

## Next Steps

1. Start with Phase 2: Task Generation (`/speckit.tasks`)
2. Break down into implementation tasks per user story
3. Assign P1 stories first (MVP: search, add, status, progress)
4. P2 stories follow (rating, filtering, dashboard UI)
5. P3 dashboards last (nice-to-have enhancements)

---

## References

- [Specification](./spec.md) - Full requirements and user stories
- [Data Model](./data-model.md) - Entity definitions and relationships
- [API Contracts](./contracts/) - Detailed endpoint specifications
- [Booklog Constitution](../../.specify/memory/constitution.md) - Architectural principles

