# Feature Specification: Book Tracking Application System

**Feature Branch**: `001-core-book-tracking`  
**Created**: 2026-04-04  
**Status**: Draft  
**Input**: Complete system for logging books, rating them, and tracking reading progress

---

## Constitution Alignment

This specification adheres to the **Booklog Constitution v1.0.0**:

✅ **Layered Architecture**: Controllers/Services/Repositories separation enforced  
✅ **REST API-First**: All features exposed via consistent REST endpoints  
✅ **Business Logic in Services**: Complex rules (progress tracking, ratings) in service layer  
✅ **Type Safety**: Full TypeScript typing, shared types between frontend/backend  
✅ **Simplicity First**: Focused on MVP, avoiding over-engineering

---

## User Scenarios & Testing

### User Story 1 - Add Book to Library (Priority: P1)

A user discovers a book and wants to add it to their personal library. They search for the book, select it from results, and it appears in their library. This is the foundational action for all other features.

**Why this priority**: Core functionality—without the ability to add books, users cannot use the application. This is the primary value proposition.

**Independent Test**: User can complete full workflow: search → select book → confirm add → view in library list. Delivers immediate value and enables testing of other features.

**Acceptance Scenarios**:

1. **Given** user is on the home page, **When** they search for "The Great Gatsby", **Then** results show matching books with title, author, and cover image
2. **Given** search results are displayed, **When** user clicks "Add to Library" on a book, **Then** the book is added and a success message appears
3. **Given** a book has been added, **When** user navigates to Library page, **Then** the book appears in their library list
4. **Given** user attempts to add a duplicate book, **When** they click "Add to Library", **Then** system shows "Already in your library" message

---

### User Story 2 - Rate and Review Books (Priority: P1)

After reading a book, users want to rate it (1-5 stars) and optionally add a written review. Ratings help users remember their opinions and guide future reading choices.

**Why this priority**: Core engagement feature; users expect to capture their reading opinions. Enables analytics and personalization in P2.

**Independent Test**: User can rate a book 1-5 stars and optionally write a review. Rating persists and displays on book detail page. Can be fully tested with a single book.

**Acceptance Scenarios**:

1. **Given** user has added a book to library, **When** they open the book detail page, **Then** they see a 5-star rating interface and review text area
2. **Given** user clicks on star rating, **When** they select 4 stars, **Then** the rating is saved and 4 stars are highlighted
3. **Given** user has rated a book, **When** they click to edit the rating, **Then** they can change it to a different value
4. **Given** user has written a review, **When** they save the review text, **Then** it persists and displays on the book detail page

---

### User Story 3 - Track Reading Progress (Priority: P1)

Users want to track their reading progress through a book—they can mark pages read or set a completion percentage. This enables them to resume reading where they left off and see their progress at a glance.

**Why this priority**: Essential for books-in-progress feature; core to the "tracking" aspect of the application. Demonstrates progressive tracking functionality.

**Independent Test**: User can update progress (pages read, percentage), save it, and see it reflected across the library and detail views.

**Acceptance Scenarios**:

1. **Given** user has added a 300-page book, **When** they open the book detail page, **Then** they see a progress input (pages read and/or percentage)
2. **Given** user enters "150" pages read, **When** they save, **Then** the system calculates percentage (50%) and displays it as a progress bar
3. **Given** user is on the library list, **When** they view their books, **Then** each book shows its reading status (Not Started, In Progress, Completed) and a progress bar
4. **Given** user marks a book as "Completed", **When** they confirm, **Then** the book shows 100% progress and a "Completed" badge

---

### User Story 4 - Manage Library Views (Priority: P2)

Users want to organize and filter their library by status (Want to Read, In Progress, Completed) and view books in different formats (list view, grid view). This reduces cognitive load and helps users find what they're looking for.

**Why this priority**: Usability enhancement for libraries with many books; enables discovery and organization patterns. Secondary to core tracking.

**Independent Test**: User can filter library by status and toggle between list/grid views. Works independently of rating/progress features.

**Acceptance Scenarios**:

1. **Given** user has books in multiple statuses, **When** they click "In Progress" filter, **Then** only books marked as in-progress appear
2. **Given** user is viewing the library, **When** they toggle to grid view, **Then** books display as cards in a grid layout
3. **Given** user has applied a filter, **When** they click "Reset Filters", **Then** all books in all statuses appear again

---

### User Story 5 - Search and Discover Books (Priority: P2)

Users want to search across all available books in the system (not just their library) to discover new titles. Search includes books they haven't added yet, with details like synopsis and user ratings.

**Why this priority**: Enables book discovery workflow; complements the "Add Book" feature. Secondary to core library management.

**Independent Test**: User can search for books by title/author, view book details including synopsis, and proceed to add to library.

**Acceptance Scenarios**:

1. **Given** user is on the Search page, **When** they type "horror" in the search box, **Then** books matching that genre or title appear with at least title, author, and cover
2. **Given** search results are displayed, **When** user clicks on a book card, **Then** a detail modal/page shows synopsis, average rating, and "Add to Library" button
3. **Given** user has already added a book to their library, **When** they see it in search results, **Then** it shows "Already Added" instead of "Add to Library"

---

### User Story 6 - Dashboard Overview (Priority: P2)

Users want a dashboard that shows their reading statistics and recent activity at a glance—total books read, books in progress, average rating, and recent additions.

**Why this priority**: Motivational and engagement feature; provides a sense of progress. Nice-to-have for MVP, valuable for retention.

**Independent Test**: Dashboard displays correct aggregated statistics based on user's current library state. Can be tested independently.

**Acceptance Scenarios**:

1. **Given** user has logged in, **When** they navigate to Dashboard, **Then** they see cards showing: books read, books in progress, average rating, recent activity
2. **Given** user has read 5 books and is reading 2, **When** they view the dashboard, **Then** the statistics cards display "5" and "2" respectively
3. **Given** user has recently added a book, **When** they view the dashboard, **Then** a "Recent Additions" section shows the book with timestamp

---

### Edge Cases

- What happens when user attempts to add a book that doesn't exist in the system? **System shows "Book not found" and offers option to request it.**
- How does system handle invalid progress values (e.g., pages > total pages)? **Backend validation rejects invalid data; frontend shows error message.**
- What if user deletes a book from their library? **Book is removed, ratings/progress are deleted, can be re-added later.**
- How does system handle books without exact page counts? **Page input is optional; users can track by percentage only.**
- What if network fails during save? **Frontend persists to localStorage; sync on reconnection.**

---

## Requirements

### Functional Requirements

**Core Book Management**:
- **FR-001**: System MUST allow authenticated users to search and add books to their personal library
- **FR-002**: System MUST store book metadata including title, author, ISBN, cover image, synopsis, and total page count
- **FR-003**: System MUST support adding books from an external source (e.g., Open Library API, Google Books API) or manual entry
- **FR-004**: System MUST allow users to view their complete library with filtering (status) and sorting options

**Rating & Review**:
- **FR-005**: System MUST allow users to rate books on a 1-5 star scale, incrementally (half-stars optional for P2)
- **FR-006**: System MUST allow users to write and edit optional text reviews for books
- **FR-007**: System MUST display average user rating for each book (aggregate of all user ratings)
- **FR-008**: System MUST allow users to edit or delete their own ratings and reviews

**Progress Tracking**:
- **FR-009**: System MUST allow users to track reading progress by pages read (if available) or percentage
- **FR-010**: System MUST automatically calculate percentage when pages are entered (percentage = (pages_read / total_pages) * 100)
- **FR-011**: System MUST display reading status: Not Started (0%), In Progress (1-99%), Completed (100%)
- **FR-012**: System MUST allow users to mark books as "Want to Read", "In Progress", or "Completed"
- **FR-013**: System MUST persist progress updates and reflect them across all views (library list, detail page, dashboard)

**Dashboard & Analytics**:
- **FR-014**: System MUST display user statistics: total books added, books completed, books in progress, average rating
- **FR-015**: System MUST display recent activity feed (added books, completed books, recent ratings)
- **FR-016**: System MUST calculate and display reading statistics (total pages read, books per month, average rating)

**Data Validation & Integrity**:
- **FR-017**: System MUST validate all inputs on the backend before persistence (backend-driven validation per Constitution Principle IV)
- **FR-018**: System MUST prevent duplicate entries of the same book in a user's library
- **FR-019**: System MUST ensure progress percentage never exceeds 100%
- **FR-020**: System MUST ensure ratings are within the 1-5 star range

**User Experience**:
- **FR-021**: System MUST display error messages for failed operations (add, update, delete)
- **FR-022**: System MUST provide success confirmations for all state-changing operations
- **FR-023**: System MUST support pagination/infinite scroll for large library lists
- **FR-024**: System MUST support filtering library by status (Want to Read, In Progress, Completed)

### Key Entities

- **User**: Represents an authenticated user. Attributes: id, email, name, createdAt, updatedAt
- **Book**: Represents a book in the catalog (shared across users). Attributes: id, title, author, isbn, coverImageUrl, synopsis, totalPages, externalId (from book API), createdAt
- **UserBook**: Join entity representing a user's copy of a book in their library. Attributes: id, userId, bookId, status (WANT_TO_READ, IN_PROGRESS, COMPLETED), pagesRead (nullable), addedAt
- **Rating**: Represents a user's rating and review of a book. Attributes: id, userId, bookId, stars (1-5), review (text, nullable), createdAt, updatedAt
- **Statistics**: Aggregate data for dashboard. Calculated from UserBook and Rating entities (queryable, not stored).

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can add a book from search to their library in under 3 clicks
- **SC-002**: Dashboard loads and displays statistics within 1 second
- **SC-003**: Library list with 100+ books renders smoothly with pagination
- **SC-004**: Backend API response times are consistently under 200ms (p95) for all endpoints
- **SC-005**: 95% of data validation errors are caught on the backend before database operations
- **SC-006**: Duplicate book detection prevents >99% of accidental duplicates in user libraries
- **SC-007**: Progress updates persist and reflect across all views within 1 second
- **SC-008**: Users can complete their first reading session (add book, rate, track progress) in under 5 minutes

---

## Assumptions

- Users have stable internet connectivity for seamless read/write operations
- Book metadata will be sourced from OpenLibrary or Google Books API and cached locally
- Authentication is handled by NextAuth or similar provider (per Constitution Technology Stack)
- Mobile support is out of scope for MVP (responsive design for tablet/desktop minimum required)
- Multi-language support is out of scope for v1 (English only)
- Users will not have more than 10,000 books in a library (pagination strategy assumes <100k records)
- External book APIs are reliable and provide sufficient metadata (title, author, ISBN, cover)
- User libraries are private (no social features, sharing, or collaborative lists in v1)

---

## Database Schema

### PostgreSQL Tables

```sql
-- Users table (authentication handled by NextAuth, basic profile storage)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table (central catalog, shared across all users)
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(20) UNIQUE,
  cover_image_url TEXT,
  synopsis TEXT,
  total_pages INT,
  external_id VARCHAR(255), -- OpenLibrary or Google Books ID
  external_source VARCHAR(50), -- 'openlibrary', 'google_books', 'manual'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User library entries (join table: user ↔ book with status and progress)
CREATE TABLE user_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id),
  status VARCHAR(50) NOT NULL DEFAULT 'WANT_TO_READ', -- WANT_TO_READ, IN_PROGRESS, COMPLETED
  pages_read INT,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  UNIQUE(user_id, book_id),
  CONSTRAINT pages_not_negative CHECK (pages_read >= 0)
);

-- Ratings & reviews table
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  stars INT NOT NULL,
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, book_id),
  CONSTRAINT valid_stars CHECK (stars >= 1 AND stars <= 5)
);

-- Indexes for common queries
CREATE INDEX idx_user_books_user_id ON user_books(user_id);
CREATE INDEX idx_user_books_status ON user_books(user_id, status);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_book_id ON ratings(book_id);
CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_books_external_id ON books(external_id);
```

### Prisma Schema (TypeScript-first approach, shared types)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  books     UserBook[]
  ratings   Rating[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Book {
  id              String   @id @default(cuid())
  title           String
  author          String
  isbn            String?  @unique
  coverImageUrl   String?  @map("cover_image_url")
  synopsis        String?
  totalPages      Int?     @map("total_pages")
  externalId      String?  @map("external_id")
  externalSource  String?  @map("external_source") // 'openlibrary', 'google_books', 'manual'
  userBooks       UserBook[]
  ratings         Rating[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([externalSource, externalId])
}

model UserBook {
  id          String   @id @default(cuid())
  userId      String   @map("user_id")
  bookId      String   @map("book_id")
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  book        Book     @relation(fields: [bookId], references: [id], onDelete: Cascade)
  status      String   @default("WANT_TO_READ") // WANT_TO_READ, IN_PROGRESS, COMPLETED
  pagesRead   Int?     @map("pages_read")
  addedAt     DateTime @default(now()) @map("added_at")
  completedAt DateTime? @map("completed_at")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([userId, bookId])
  @@index([userId])
  @@index([userId, status])
}

model Rating {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  bookId    String   @map("book_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  book      Book     @relation(fields: [bookId], references: [id], onDelete: Cascade)
  stars     Int
  review    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, bookId])
  @@index([userId])
  @@index([bookId])
}
```

---

## API Endpoints

All endpoints follow **REST API-First Design** (Constitution Principle II) and return standardized JSON responses:

```typescript
// Shared response type (backend validation, strict TypeScript)
{
  "success": boolean,
  "data": T | null,
  "error": string | null
}
```

### Book Management

#### GET `/api/books/search?q=query&limit=20&offset=0`
Search books by title/author. Hits local database first, then external API if needed.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "978-0743273565",
      "coverImageUrl": "https://...",
      "synopsis": "...",
      "totalPages": 180,
      "inUserLibrary": false
    }
  ],
  "error": null
}
```

#### POST `/api/books`
Create or retrieve a book. If ISBN/externalId exists, return existing. Business logic: prevent duplicates.

**Request**:
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0743273565",
  "coverImageUrl": "https://...",
  "synopsis": "...",
  "totalPages": 180,
  "externalId": "openlibrary:OL45883W",
  "externalSource": "openlibrary"
}
```

**Response**: Book object (existing or newly created)

---

### User Library Management

#### GET `/api/users/me/books?status=IN_PROGRESS&limit=20&offset=0`
Get user's library with optional filtering by status.

**Response**:
```json
{
  "success": true,
  "data": {
    "books": [
      {
        "id": "uuid",
        "book": { /* Book object */ },
        "status": "IN_PROGRESS",
        "pagesRead": 150,
        "totalPages": 300,
        "percentageRead": 50,
        "addedAt": "2026-04-01T10:00:00Z",
        "completedAt": null,
        "rating": { /* Rating object or null */ }
      }
    ],
    "total": 42,
    "limit": 20,
    "offset": 0
  },
  "error": null
}
```

#### POST `/api/users/me/books`
Add a book to user's library.

**Request**:
```json
{
  "bookId": "uuid"
}
```

**Response**: UserBook object

#### PATCH `/api/users/me/books/:bookId`
Update book status, progress, or completion.

**Request**:
```json
{
  "status": "IN_PROGRESS",
  "pagesRead": 150
}
```

**Response**: Updated UserBook object with calculated percentageRead

#### DELETE `/api/users/me/books/:bookId`
Remove a book from user's library.

**Response**:
```json
{
  "success": true,
  "data": null,
  "error": null
}
```

---

### Ratings & Reviews

#### POST `/api/books/:bookId/ratings`
Create or update a rating for a book.

**Request**:
```json
{
  "stars": 4,
  "review": "Absolutely loved this book!"
}
```

**Response**: Rating object

#### GET `/api/books/:bookId/ratings`
Get all ratings for a book (for aggregated stats).

**Response**:
```json
{
  "success": true,
  "data": {
    "ratings": [ /* Array of Rating objects */ ],
    "averageRating": 4.2,
    "totalRatings": 145,
    "userRating": { /* User's own rating if exists */ }
  },
  "error": null
}
```

#### DELETE `/api/books/:bookId/ratings`
Delete user's rating for a book.

**Response**: Success confirmation

---

### Dashboard & Statistics

#### GET `/api/users/me/statistics`
Get user's reading statistics for dashboard.

**Response** (calculated by Statistics Service, not stored):
```json
{
  "success": true,
  "data": {
    "totalBooksAdded": 47,
    "booksCompleted": 12,
    "booksInProgress": 5,
    "averageRating": 4.1,
    "totalPagesRead": 4200,
    "readings": {
      "thisMonth": 2,
      "lastMonth": 3,
      "allTime": 12
    },
    "recentActivity": [
      {
        "type": "BOOK_ADDED",
        "book": { /* Book object */ },
        "timestamp": "2026-04-04T14:30:00Z"
      },
      {
        "type": "BOOK_COMPLETED",
        "book": { /* Book object */ },
        "timestamp": "2026-04-03T10:15:00Z"
      }
    ]
  },
  "error": null
}
```

---

## Application Pages & UI Structure

### Layout Components
- **Header**: Logo, search bar, navigation links, user menu
- **Sidebar**: Navigation (Library, Dashboard, Search, Settings), filter controls
- **Footer**: Links, version info (optional)

### Pages

#### 1. Dashboard (`/dashboard`)
- **Hero section**: Welcome message with user's name
- **Statistics Cards**: Total books, completed, in progress, average rating
- **Recent Activity Feed**: Last 10 actions (added books, completed books, ratings)
- **Quick Stats Chart**: Books read per month (last 6 months)
- **New to Reading**: Personalized recommendations based on ratings (P2)

**Components**:
- `StatsCard` (displays one metric)
- `ActivityFeed` (recent actions list)
- `LineChart` (books per month)

---

#### 2. Library (`/library`)
- **Filter Bar**: Status tabs (All, Want to Read, In Progress, Completed), sort options
- **View Toggle**: List view vs. Grid view
- **Book List/Grid**: Shows each book with:
  - Cover image
  - Title, author
  - Reading status badge
  - Progress bar (if in progress)
  - User's rating (if rated)
  - Quick actions (Open, Mark Complete, Delete)
- **Pagination**: Show 20 books per page, load more button

**Components**:
- `FilterBar` (status filters, sort dropdown)
- `ViewToggle` (list/grid buttons)
- `BookCard` (grid) / `BookRow` (list)
- `Pagination` (load more or page numbers)

---

#### 3. Book Detail (`/library/:bookId`)
Modal or dedicated page showing:
- Large cover image
- Book metadata: title, author, ISBN, synopsis
- **Rating Section**: 5-star picker, review text area (editable)
- **Progress Section**: Pages read input, percentage bar, status selector
- **Book Info**: Total pages, external links (GoodReads, Amazon)
- **User Actions**: Edit, Delete from library, Mark as complete
- **Other Users**: Show average rating, number of ratings (if not sensitive)

**Components**:
- `BookHeader` (cover, title, author)
- `RatingEditor` (5-star picker, review text field)
- `ProgressTracker` (pages input, percentage bar)
- `BookMetadata` (synopsis, ISBN, etc.)
- `ActionButtons` (edit, delete, complete)

---

#### 4. Search (`/search`)
- **Search Bar**: Large, prominent input with icon
- **Search Results**: Grid/list of books with:
  - Cover, title, author
  - "Add to Library" button (or "Already Added" if in library)
  - Quick preview (hover/click shows modal with synopsis)
- **Filters** (P2): Genre, publication year, language
- **Filter Tags**: Show active filters, allow removal

**Components**:
- `SearchInput` (search field, debounced)
- `ResultsGrid` / `ResultsList`
- `BookPreviewCard` (with hover/click preview)
- `BookPreviewModal` (modal detail view)
- `FilterPanel` (P2 enhancement)

---

#### 5. Settings (`/settings`)
- **Profile Tab**: Display name, email (read-only), profile picture (P2)
- **Preferences Tab**: Theme (light/dark), notifications, privacy
- **Data Management Tab**: Export library as CSV, bulk import (P2), delete account
- **About Tab**: Version, links, credits

**Components**:
- `SettingsTabs` (tab navigation)
- `ProfileForm` (display name, picture)
- `PreferencesForm` (theme, notifications)
- `DataManagement` (export, import, delete buttons)

---

### Shared Components
- **Navbar**: Sticky header with logo, search shortcut, user menu
- **Sidebar**: (on desktop) collapsible navigation
- **BookCard**: Reusable book display (multiple variants)
- **Modal**: Generic modal for details, confirmations
- **Toast**: Success/error notifications
- **Button**: Primary, secondary variants
- **Input**: Text, number inputs with validation feedback
- **ProgressBar**: Visual progress indicator

---

## Technical Architecture

### Service Layer (Business Logic - per Constitution Principle III)

**BookService**:
- `searchBooks(query)`: Search local DB first, fallback to external API
- `createOrGetBook(data)`: Upsert logic, prevent duplicates via ISBN/externalId
- `getBookDetails(bookId)`: Fetch full book info with user's rating if applicable

**UserBookService**:
- `addBookToLibrary(userId, bookId)`: Add book, handle duplicates, emit activity event
- `updateBookProgress(userId, bookId, pagesRead)`: Validate progress, calculate percentage, persist
- `completeBook(userId, bookId)`: Mark complete, set completion timestamp, emit event
- `removeFromLibrary(userId, bookId)`: Soft or hard delete, handle cascade considerations
- `getUserLibrary(userId, filters, pagination)`: Query with filters and pagination, calculate computed fields

**RatingService**:
- `rateBook(userId, bookId, stars, review)`: Create/update rating, validate stars 1-5
- `getAverageRating(bookId)`: Calculate aggregate rating
- `deleteRating(userId, bookId)`: Remove user's rating

**StatisticsService**:
- `getUserStatistics(userId)`: Calculate stats from UserBook and Rating tables
- `getRecentActivity(userId, limit)`: Fetch recent user actions (added, completed, rated)

### Repository Layer (Data Access)

- `UserRepository`: `findById(id)`, `create(data)`, `update(id, data)`
- `BookRepository`: `search(query)`, `findById(id)`, `findByIsbn(isbn)`, `findByExternalId(source, id)`, `create(data)`, `upsert(data)`
- `UserBookRepository`: `findByUserId(userId, filters)`, `findByUserAndBook(userId, bookId)`, `create(data)`, `update(id, data)`, `delete(id)`
- `RatingRepository`: `findByUserAndBook(userId, bookId)`, `findByBook(bookId)`, `create(data)`, `update(id, data)`, `delete(id)`

### Frontend Layer (UI/Presentation - thin, no business logic)

- Next.js App Router pages under `/app/`
- React components under `/features/`
- API integration via `@tanstack/react-query` or similar
- Shared types in `/types/` (frontend and backend share)
- Environment-specific API clients

### API Controllers (Request/Response handling)

- Thin controllers that delegate to services
- Unified error handling and response formatting
- Input validation directives
- All business logic forbidden in controllers (per Constitution)

---

## Type Safety (Shared Types - Constitution Principle IV)

```typescript
// shared/types/book.ts (used by frontend and backend)
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  coverImageUrl?: string;
  synopsis?: string;
  totalPages?: number;
  externalId?: string;
  externalSource?: 'openlibrary' | 'google_books' | 'manual';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserBook {
  id: string;
  userId: string;
  bookId: string;
  book: Book;
  status: 'WANT_TO_READ' | 'IN_PROGRESS' | 'COMPLETED';
  pagesRead?: number;
  percentageRead?: number; // Calculated
  addedAt: Date;
  completedAt?: Date;
}

export interface Rating {
  id: string;
  userId: string;
  bookId: string;
  stars: 1 | 2 | 3 | 4 | 5;
  review?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStatistics {
  totalBooksAdded: number;
  booksCompleted: number;
  booksInProgress: number;
  averageRating: number;
  totalPagesRead: number;
  readings: {
    thisMonth: number;
    lastMonth: number;
    allTime: number;
  };
  recentActivity: Activity[];
}
```

---

## Validation Rules (Backend-Driven, per Constitution Principle IV)

All validation occurs on the backend; frontend provides UX feedback only.

- **Book Creation**: Title and author required; ISBN must be valid format if provided; totalPages must be positive if provided
- **UserBook Progress**: `pagesRead` must be ≤ `totalPages` (or rejected if pages exceed total)
- **Rating**: `stars` must be in range 1-5; review is optional but limited to 5000 characters
- **User Input**: All strings trimmed and sanitized for XSS
- **Duplicate Prevention**: Unique constraints on (userId, bookId) for UserBook and Rating

---

## Data Validation Errors Return 400 Bad Request

```json
{
  "success": false,
  "data": null,
  "error": "Pages read cannot exceed total pages (provided: 310, total: 300)"
}
```

---

## Implementation Notes (Aligned to Constitution)

1. **Layered Architecture**: Strict separation enforced. Controllers → Services → Repositories → Database
2. **API-First**: All business operations exposed via REST; frontend must not bypass APIs
3. **Service Logic**: Progress calculation, aggregation, business rules live in services, never in controllers or frontend
4. **Type Safety**: All types defined in shared module, imported by frontend and backend
5. **Simplicity**: No event sourcing, no complex caching patterns—simple SQL queries, straightforward business logic
6. **Error Handling**: Unified error responses, meaningful messages, validation failures return 400
7. **Testing**: Service layer should have unit tests covering core logic (progress calc, validation, deduplication)

---

## Files to Create

```plaintext
backend/
├── src/
│   ├── controllers/
│   │   ├── bookController.ts
│   │   ├── userBookController.ts
│   │   ├── ratingController.ts
│   │   └── statisticsController.ts
│   ├── services/
│   │   ├── BookService.ts
│   │   ├── UserBookService.ts
│   │   ├── RatingService.ts
│   │   └── StatisticsService.ts
│   ├── repositories/
│   │   ├── UserRepository.ts
│   │   ├── BookRepository.ts
│   │   ├── UserBookRepository.ts
│   │   └── RatingRepository.ts
│   ├── routes/
│   │   ├── books.ts
│   │   ├── userBooks.ts
│   │   ├── ratings.ts
│   │   └── statistics.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   └── types/
│       └── shared.ts
├── prisma/
│   └── schema.prisma
└── tests/
    ├── services/
    │   ├── BookService.test.ts
    │   ├── UserBookService.test.ts
    │   ├── RatingService.test.ts
    │   └── StatisticsService.test.ts
    └── repositories/

frontend/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── library/
│   │   │   ├── page.tsx
│   │   │   └── [bookId]/
│   │   │       └── page.tsx
│   │   ├── search/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── features/
│   │   ├── dashboard/
│   │   │   └── ui/
│   │   │       ├── Dashboard.tsx
│   │   │       ├── StatsCard.tsx
│   │   │       ├── ActivityFeed.tsx
│   │   │       └── ReadingChart.tsx
│   │   ├── library/
│   │   │   └── ui/
│   │   │       ├── Library.tsx
│   │   │       ├── FilterBar.tsx
│   │   │       ├── BookCard.tsx
│   │   │       ├── BookRow.tsx
│   │   │       └── BookDetail.tsx
│   │   ├── search/
│   │   │   └── ui/
│   │   │       ├── Search.tsx
│   │   │       ├── SearchInput.tsx
│   │   │       ├── ResultsGrid.tsx
│   │   │       └── BookPreviewModal.tsx
│   │   └── settings/
│   │       └── ui/
│   │           └── Settings.tsx
│   ├── shared/
│   │   ├── types/
│   │   │   ├── book.ts
│   │   │   ├── user.ts
│   │   │   └── api.ts
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── ProgressBar.tsx
│   │   └── api/
│   │       ├── bookClient.ts
│   │       ├── userBookClient.ts
│   │       ├── ratingClient.ts
│   │       └── statisticsClient.ts
    └── hooks/
        ├── useBooks.ts
        ├── useUserLibrary.ts
        └── useStatistics.ts
```

---

## Next Steps

1. **Create database schema** via Prisma migrations (prisma migrate dev --name init)
2. **Implement service layer** with validation and business logic
3. **Implement repository layer** with database queries
4. **Create API endpoints** following the REST contract defined above
5. **Build frontend pages and components** consuming the API
6. **Add integration tests** for service layer (core business logic)
7. **Deploy and iterate** based on user feedback

