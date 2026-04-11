# Data Model: Personal Book Library Tracker

**Feature**: 001-book-library  
**Date**: 2026-04-11  
**Status**: Phase 1 - Design

## Domain Model Overview

The system manages three core entities and their relationships:
1. **User** - Reader account (managed by existing auth system)
2. **Book** - Book metadata (cached from Google Books API)
3. **UserBook** - User's personal library entry (status, progress, ratings)

```
User
  ├─ UserBook (1:N relationship)
  │   ├─ Book (N:1 relationship)
  │   ├─ Status (enum: WANT_TO_READ, IN_PROGRESS, COMPLETED)
  │   ├─ Pages Read (optional, for progress tracking)
  │   ├─ Rating (optional, 1-5 stars)
  │   └─ Review (optional, text)
  
Book
  ├─ External ID (Google Books API ID/ISBN)
  ├─ Metadata (title, author, page count, cover image, etc.)
  └─ UserBook references (for users who added this book)
```

---

## Entity Definitions

### User

**Source**: Existing authentication system (out of scope for this feature)

**Attributes**:
- `id` (UUID, primary key)
- `email` (string, unique)
- `name` (string)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

**Relationships**:
- 1:N with UserBook (user owns multiple UserBooks)

**Notes**:
- Assumed to exist and be authenticated before accessing library features
- No user profile management in this feature

---

### Book

**Source**: Google Books API (cached in database after first search)

**Attributes**:
- `id` (UUID, primary key - database ID)
- `googleBooksId` (string, unique, external API ID)
- `isbn` (string, unique nullable - ISBN-10 or ISBN-13)
- `title` (string, required)
- `author` (string, required - primary author, full name)
- `publishedDate` (date, nullable)
- `pageCount` (integer, nullable - may be missing from API)
- `description` (text, nullable)
- `coverImageUrl` (string, nullable - Google Books thumbnail URL)
- `googleRating` (decimal, nullable, 0-5 - ratings from Google Books ecosystem)
- `googleRatingCount` (integer, nullable - how many ratings from Google)
- `language` (string, default: "en")
- `cachedAt` (timestamp - when this book data was last synced from API)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

**Relationships**:
- 1:N with UserBook (book can appear in multiple users' libraries)

**Validation Rules**:
- Either `googleBooksId` or `isbn` must be present
- `title` and `author` are required (from API)
- `pageCount` is optional but improves progress tracking UX
- `coverImageUrl` must link to valid image

**Notes**:
- Cache book data after first search to reduce Google Books API calls
- ISBN is kept for offline reference and duplicate detection
- Google ratings are read-only (user ratings kept separately in UserBook)

---

### UserBook

**Source**: User action (add book, update status/progress/rating)

**Attributes**:
- `id` (UUID, primary key)
- `userId` (UUID, foreign key → User)
- `bookId` (UUID, foreign key → Book)
- `status` (enum, required)
  - `WANT_TO_READ` - User plans to read this book
  - `IN_PROGRESS` - Currently reading
  - `COMPLETED` - Finished reading
- `pagesRead` (integer, nullable)
  - Only meaningful when `status` = `IN_PROGRESS` or `COMPLETED`
  - When completed: should ≤ `Book.pageCount` (if available)
- `rating` (integer, nullable, range: 1-5)
  - User's personal rating (different from `Book.googleRating`)
  - Only shown to the rating user (private)
- `reviewText` (text, nullable, max: 5000 characters)
  - User's written review (optional, private)
- `dateAdded` (timestamp, required, auto-set on creation)
- `dateStarted` (timestamp, nullable - when user moved to IN_PROGRESS)
- `dateCompleted` (timestamp, nullable - when status changed to COMPLETED)
- `lastModified` (timestamp, auto-update on any change)

**Relationships**:
- N:1 with User (many UserBooks per user)
- N:1 with Book (many users can have same book)
- Composite unique constraint: (userId, bookId) - No duplicate books per user

**Validation Rules**:
- `status` must be one of three enum values
- `pagesRead` must be >= 0
- `pagesRead` ≤ `Book.pageCount` (if pageCount available)
- `pagesRead` should be 0 if status = `WANT_TO_READ`
- `rating` must be 1-5 or null
- `reviewText` must be under 5000 characters
- `dateStarted` must be after `dateAdded`
- `dateCompleted` must be after `dateStarted` (if both set)
- No editing `dateAdded` after creation (immutable)

**Transition Rules** (status changes):
- `WANT_TO_READ` → `IN_PROGRESS` sets `dateStarted` to now
- `IN_PROGRESS` → `COMPLETED` sets `dateCompleted` to now
- `COMPLETED` → `IN_PROGRESS` clears `dateCompleted` (can resume reading)
- `WANT_TO_READ` ← `IN_PROGRESS` clears `dateStarted`
- Status changes are logged (FR-017)

**Notes**:
- Single source of truth for `pagesRead` (not stored elsewhere)
- Completion percentage calculated as: `(pagesRead / Book.pageCount × 100)%`
- If `Book.pageCount` is null, use UI to input percentage directly
- Rating and review visibility limited to the book owner (privacy)

---

## Calculated/Derived Fields

### UserBook Completion Percentage

**Formula**: `(pages_read / book.pageCount) × 100` (when pageCount available)

**Precision**: 0.1% (to 1 decimal place)

**Edge Cases**:
- If `pageCount` is null: Show percentage input instead of pages
- If `pagesRead` > `pageCount`: Validate in API layer, prevent save
- If `pagesRead` = 0 and status = WANT_TO_READ: Show 0%

---

## Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  userBooks UserBook[]

  @@map("users")
}

model Book {
  id               String   @id @default(cuid())
  googleBooksId    String   @unique
  isbn             String?  @unique
  title            String
  author           String
  publishedDate    DateTime?
  pageCount        Int?
  description      String?
  coverImageUrl    String?
  googleRating     Decimal?
  googleRatingCount Int?
  language         String   @default("en")
  cachedAt         DateTime @default(now())
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  userBooks UserBook[]

  @@map("books")
}

model UserBook {
  id             String   @id @default(cuid())
  userId         String   @db.VarChar(255)
  bookId         String   @db.VarChar(255)
  status         String   @default("WANT_TO_READ") // Enum-like: WANT_TO_READ, IN_PROGRESS, COMPLETED
  pagesRead      Int?
  rating         Int?     // 1-5, nullable
  reviewText     String?  @db.Text
  dateAdded      DateTime @default(now())
  dateStarted    DateTime?
  dateCompleted  DateTime?
  lastModified   DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  book   Book   @relation(fields: [bookId], references: [id], onDelete: Cascade)

  @@unique([userId, bookId])  // Prevent duplicate books per user
  @@index([userId])
  @@index([status])
  @@map("user_books")
}
```

**Index Strategy**:
- `(userId)` - Fast lookup of user's library
- `(status)` - Fast filtering by status
- `(userId, status)` - Combined for library views with status filters
- Unique constraint on (userId, bookId) enforces no duplicates

---

## Enum Definitions

### BookStatus

Values (stored as strings in database):
- `WANT_TO_READ` - Initial status when added
- `IN_PROGRESS` - User is reading
- `COMPLETED` - User finished reading

Frontend/Backend share this enum (TypeScript):
```typescript
enum BookStatus {
  WANT_TO_READ = "WANT_TO_READ",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED"
}
```

---

## Data Integrity Rules

### Referential Integrity
- Deleting a User cascades to delete their UserBooks
- Deleting a Book cascades to delete all UserBook references (book removed from all users' libraries)

### Uniqueness Constraints
- One User record per email
- One Book record per googleBooksId
- One UserBook record per (userId, bookId) pair - **No duplicate books per user**

### Not-Null Constraints
- UserBook.userId, bookId, status are required
- Book.title, author, googleBooksId are required
- User.email, name are required

---

## Data Lifecycle

### Book Data Lifecycle
1. User searches for book → Google Books API
2. Book not in database → Create Book record (cache API response)
3. Book exists in database → Use cached data (update `cachedAt` timestamp)
4. Periodic cleanup: Books not referenced by any UserBook for 6+ months can be archived (future optimization)

### UserBook Lifecycle
1. User adds book to library from search → Create UserBook with status={WANT_TO_READ}
2. User updates status → Modify status, update timestamps
3. User adds progress/rating → Update pagesRead, rating, reviewText
4. User deletes from library → Delete UserBook record (soft delete optional for audit trail)

---

## Migration Path

**Initial Schema**:
- Create User, Book, UserBook tables
- Create unique/index constraints

**Future Enhancements** (out of scope for v1):
- ReadingGoals table (track goals per year/month)
- BookShelf table (for organizing books into custom collections)
- UserPreferences table (storing notification settings, theme)
- AuditLog table (for compliance/audit trail)

---

## Assumptions & Constraints

- **Page Count**: Optional but recommended for better UX
- **ISBN**: Not all books have ISBN in Google Books API; fallback to googleBooksId
- **User Account**: Assumed to exist and be authenticated via existing system
- **No Soft Deletes**: Hard delete UserBooks (no retention requirement per constitution)
- **Language**: Default to English; support international books in future

---

## Next Steps

Phase 1 Completion:
- ✅ Data model defined
- ⏳ API contracts (required endpoints, payloads)
- ⏳ Quickstart guide (how to run/test)
