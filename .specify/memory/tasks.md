---
description: "Task list for Book Tracking Application implementation"
---

# Tasks: Booklog Core Feature

**Input**: `booklog-spec.md`  
**Feature Branch**: `001-core-book-tracking`  
**Status**: Planning → Execution  
**Constitution Alignment**: Layered Architecture, API-First, Business Logic in Services, Type Safety, Simplicity

---

## Task Format

- **[ID]**: Task identifier (T001, T002, etc.)
- **[P]**: Can run in Parallel (prerequisites met, no file conflicts)
- **[US#]**: User Story (US1, US2, etc. or INFRA for infrastructure)
- **Description**: What, where, and acceptance criteria

**Path Conventions**: `backend/src/`, `frontend/src/` (full-stack web app)

---

## Phase 0: Database Schema & Shared Types ⚛️

**Purpose**: Foundation layer - database structure and type definitions shared across frontend/backend

**⚠️ CRITICAL**: Must complete before any service/API work begins

### T001 [INFRA] Create Prisma schema with all models

Setup local PostgreSQL via Docker

Create `backend/prisma/schema.prisma` with:
- User model (id, email, name, createdAt, updatedAt)
- Book model (id, title, author, isbn, coverImageUrl, synopsis, totalPages, externalId, externalSource)
- UserBook model (join table with status, pagesRead, addedAt, completedAt)
- Rating model (stars, review, user/book relations)
- All indexes for common queries (userId, bookId, status filters)
- Constraints (stars 1-5, unique user-book combinations)

**Acceptance**: Prisma schema is valid, no type errors, all relationships defined

---

### T002 [P] [INFRA] Create shared TypeScript types

Create shared type definitions at `shared/types/index.ts` with exports for:
- Book (id, title, author, isbn, coverImageUrl, synopsis, totalPages, externalId, externalSource)
- UserBook (id, userId, bookId, status enum, pagesRead, percentageRead calculated field, addedAt, completedAt)
- Rating (id, userId, bookId, stars 1-5 type, review optional, timestamps)
- BookStatus enum ('WANT_TO_READ' | 'IN_PROGRESS' | 'COMPLETED')
- API Response wrapper { success: boolean, data: T, error: string | null }

**Acceptance**: TS strict mode compiles without errors; frontend and backend both import from shared path

---

### T003 [P] [INFRA] Setup PostgreSQL database and run migrations

- Create PostgreSQL database named `booklog_dev`
- Run `prisma migrate dev --name init` to create tables from schema
- Verify all tables exist with correct columns and indexes
- Test database connection from backend

**Acceptance**: `prisma db push` succeeds; Prisma Studio can display tables

---

### T004 [P] [INFRA] Create environment configuration

Create `.env.local` and `.env.example` with:
- DATABASE_URL
- NEXT_PUBLIC_API_URL (backend base URL)
- NODE_ENV
- NEXTAUTH_URL (for authentication)
- NEXTAUTH_SECRET

**Acceptance**: Backend connects to DB via DATABASE_URL; frontend can fetch from NEXT_PUBLIC_API_URL

---

## Phase 1: Repository & Service Layer Infrastructure 🏗️

**Purpose**: Data access layer and business logic foundation (Constitution: Layered Architecture, Business Logic in Services)

**Prerequisite**: Phase 0 complete

### T005 [INFRA] Create repository base class and user repository

Create `backend/src/repositories/BaseRepository.ts` with common methods (findById, create, update, delete)

Create `backend/src/repositories/UserRepository.ts` extending BaseRepository:
- `findById(id: string): Promise<User | null>`
- `findByEmail(email: string): Promise<User | null>`
- `create(data: { email, name }): Promise<User>`
- `update(id: string, data: Partial<User>): Promise<User>`

**Acceptance**: TypeScript compiles; repository methods properly typed; no database queries yet

---

### T006 [P] [INFRA] Create book repository

Create `backend/src/repositories/BookRepository.ts`:
- `search(query: string): Promise<Book[]>` (searches title/author)
- `findById(id: string): Promise<Book | null>`
- `findByIsbn(isbn: string): Promise<Book | null>`
- `findByExternalId(source: string, id: string): Promise<Book | null>`
- `create(data: BookInput): Promise<Book>`
- `upsert(data: BookInput, uniqueField: 'isbn' | 'externalId'): Promise<Book>` (prevent duplicates)

**Acceptance**: All methods typed correctly; upsert logic handles ISBN/externalId conflicts

---

### T007 [P] [INFRA] Create UserBook and Rating repositories

Create `backend/src/repositories/UserBookRepository.ts`:
- `findByUserId(userId: string, filters?: { status }): Promise<UserBook[]>`
- `findByUserAndBook(userId: string, bookId: string): Promise<UserBook | null>`
- `create(data: { userId, bookId, status? }): Promise<UserBook>`
- `update(id: string, data: Partial<UserBook>): Promise<UserBook>`
- `delete(id: string): Promise<void>`
- `countByStatus(userId: string): Promise<{ wantToRead, inProgress, completed }>`

Create `backend/src/repositories/RatingRepository.ts`:
- `findByUserAndBook(userId: string, bookId: string): Promise<Rating | null>`
- `findByBook(bookId: string): Promise<Rating[]>` (for aggregation)
- `create(data: { userId, bookId, stars, review? }): Promise<Rating>`
- `update(id: string, data: Partial<Rating>): Promise<Rating>`
- `delete(id: string): Promise<void>`

**Acceptance**: CRUD operations type-safe; queries ready for implementation

---

### T008 [INFRA] Create BookService with core business logic

Create `backend/src/services/BookService.ts`:
- `searchBooks(query: string): Promise<Book[]>` (search local DB, no external API yet)
- `createOrGetBook(data: BookInput): Promise<Book>` (upsert, prevent duplicates via ISBN/externalId)
- `getBookDetails(bookId: string): Promise<BookWithMetadata>` (include cover, synopsis, etc.)
- Constructor takes BookRepository as dependency injection

Validation logic: title/author required, ISBN format if provided, totalPages positive if provided

**Acceptance**: Service has unit test structure; validation catches invalid inputs

---

### T009 [P] [INFRA] Create UserBookService with progress logic

Create `backend/src/services/UserBookService.ts`:
- `addBookToLibrary(userId: string, bookId: string): Promise<UserBook>` (no duplicates)
- `updateProgress(userId: string, bookId: string, data: { pagesRead?, status? }): Promise<UserBook>` 
  - Validate: pagesRead ≤ totalPages (or error)
  - Calculate: percentageRead = (pagesRead / totalPages) * 100
  - Auto-set status: 0% → WANT_TO_READ, 1-99% → IN_PROGRESS, 100% → COMPLETED
- `completeBook(userId: string, bookId: string): Promise<UserBook>` (set pagesRead = totalPages, completedAt = now)
- `removeFromLibrary(userId: string, bookId: string): Promise<void>`
- `getUserLibrary(userId: string, filters?: { status }, limit: number, offset: number): Promise<{ books: UserBook[], total }>`
- Constructor takes UserBookRepository, BookRepository as dependencies

**Acceptance**: Progress calculation tested; validation rejects pages > total_pages; completion sets 100%

---

### T010 [P] [INFRA] Create RatingService

Create `backend/src/services/RatingService.ts`:
- `rateBook(userId: string, bookId: string, stars: 1|2|3|4|5, review?: string): Promise<Rating>` (create or update)
- `getAverageRating(bookId: string): Promise<{ average: number, count: number }>`
- `getUserRating(userId: string, bookId: string): Promise<Rating | null>`
- `deleteRating(userId: string, bookId: string): Promise<void>`
- Constructor takes RatingRepository as dependency

Validation: stars must be 1-5; review limited to 5000 chars

**Acceptance**: Type-safe star validation; upsert replaces old rating

---

### T011 [P] [INFRA] Create StatisticsService

Create `backend/src/services/StatisticsService.ts`:
- `getUserStatistics(userId: string): Promise<UserStatistics>` (calculated, not stored)
  - totalBooksAdded (count of all UserBooks)
  - booksCompleted (count with status = COMPLETED)
  - booksInProgress (count with status = IN_PROGRESS)
  - averageRating (avg of user's ratings)
  - totalPagesRead (sum of pagesRead for completed books)
  - readings: { thisMonth, lastMonth, allTime }
- `getRecentActivity(userId: string, limit: number): Promise<Activity[]>` (last 10 actions: added, completed, rated)
- Constructor takes UserBookRepository, RatingRepository as dependencies

Aggregation logic: no complex queries; straightforward SQL aggregations

**Acceptance**: Statistics calculated correctly; recent activity ordered by timestamp DESC

---

## Phase 2: API Controllers & REST Endpoints 🔌

**Purpose**: HTTP request/response handlers that delegate to services (Constitution: REST API-First, thin controllers)

**Prerequisite**: Phase 1 complete

### T012 [INFRA] Create middleware: authentication, error handling

Create `backend/src/middleware/auth.ts`:
- Middleware to extract userId from NextAuth session (or JWT)
- Attach userId to `req.userId` for controllers to access

Create `backend/src/middleware/errorHandler.ts`:
- Catch all errors and format as { success: false, data: null, error: "message" }
- Handle validation errors (400), not found (404), auth errors (401), server errors (500)
- Log errors for debugging

Create `backend/src/middleware/validation.ts`:
- Common validation directives for input sanitization (trim strings, escape HTML)

**Acceptance**: Error responses have consistent format; validation prevents XSS

---

### T013 [P] [US1] Create BookController with search and create endpoints

Create `backend/src/controllers/BookController.ts`:
- `getSearchResults(req, res)` → calls `BookService.searchBooks(query)`
  - Returns { success: true, data: Book[], error: null }
- `createOrGetBook(req, res)` → calls `BookService.createOrGetBook(data)`
  - Returns Book object or error if validation fails
- Constructor takes BookService as dependency

**Acceptance**: Endpoints return standardized JSON responses; validation errors return 400

---

### T014 [P] [INFRA] Create API routes structure

Create `backend/src/routes/` folder with modular route handlers:
- `backend/src/routes/books.ts` → GET /api/books/search, POST /api/books
- `backend/src/routes/userBooks.ts` → GET/POST/PATCH/DELETE /api/users/me/books
- `backend/src/routes/ratings.ts` → POST/DELETE /api/books/:bookId/ratings, GET /api/books/:bookId/ratings
- `backend/src/routes/statistics.ts` → GET /api/users/me/statistics

All routes wire up controllers and apply middleware (auth, error handler)

**Acceptance**: Routes are organized; middleware is applied consistently

---

### T015 [US1, US3] Create UserBookController with add/update/delete endpoints

Create `backend/src/controllers/UserBookController.ts`:
- `addBook(req, res)` → `UserBookService.addBookToLibrary(userId, bookId)`
- `updateProgress(req, res)` → `UserBookService.updateProgress(userId, bookId, data)` (handles pages, status)
- `getUserLibrary(req, res)` → `UserBookService.getUserLibrary(userId, filters, pagination)`
- `removeBook(req, res)` → `UserBookService.removeFromLibrary(userId, bookId)`
- `completeBook(req, res)` → `UserBookService.completeBook(userId, bookId)`

All endpoint responses follow { success, data, error } format

**Acceptance**: Validation errors return 400; auth errors return 401; success returns 200

---

### T016 [P] [US2] Create RatingController with rate/update/delete endpoints

Create `backend/src/controllers/RatingController.ts`:
- `rateBook(req, res)` → `RatingService.rateBook(userId, bookId, stars, review)`
- `getBookRatings(req, res)` → aggregates all ratings for a book plus user's own rating
- `deleteRating(req, res)` → `RatingService.deleteRating(userId, bookId)`

**Acceptance**: Star validation in controller; review text sanitized

---

### T017 [P] [US6] Create StatisticsController

Create `backend/src/controllers/StatisticsController.ts`:
- `getUserStatistics(req, res)` → `StatisticsService.getUserStatistics(userId)`
  - Returns dashboard statistics

**Acceptance**: Response includes all required fields (totalBooksAdded, completed, etc.)

---

### T018 [INFRA] Register all routes in main API handler

Create `backend/src/api/route.ts` (or main app handler):
- Import and register all route modules
- Apply global middleware (auth, error handler)
- Serve API at `/api/` prefix

**Acceptance**: All endpoints registered; test endpoint returns correct responses

---

## Phase 3: Frontend Setup & Shared Components 🎨

**Purpose**: UI foundation and reusable components (thin presentation layer per Constitution)

**Prerequisite**: Phase 2 complete (API endpoints available)

### T019 [INFRA] Create frontend API client layer

Create `frontend/src/shared/api/bookClient.ts`:
- HTTP client with fetch/axios wrapper
- `searchBooks(query: string): Promise<Book[]>`
- `createBook(data): Promise<Book>`
- Handles errors, auto-formats requests/responses

Create similar clients for:
- `frontend/src/shared/api/userBookClient.ts` (add, update, removeBook, getUserLibrary)
- `frontend/src/shared/api/ratingClient.ts` (rateBook, getBookRatings, deleteRating)
- `frontend/src/shared/api/statisticsClient.ts` (getUserStatistics)

All clients consume backend API with standardized response format

**Acceptance**: Clients type-safe; error responses caught and propagated

---

### T020 [P] [INFRA] Create shared UI components

Create reusable components in `frontend/src/shared/ui/`:
- `Button.tsx` (primary, secondary variants)
- `Modal.tsx` (generic modal for details, confirmations)
- `Toast.tsx` (success/error notifications)
- `ProgressBar.tsx` (visual progress indicator 0-100%)
- `Input.tsx` (text, number inputs with error feedback)
- `Card.tsx` (generic card container)

All components follow design consistency; support dark/light theme

**Acceptance**: Components render without errors; props are typed

---

### T021 [P] [INFRA] Create layout components

Create `frontend/src/shared/ui/`:
- `Navbar.tsx` (sticky header with logo, search shortcut, user menu)
- `Sidebar.tsx` (collapsible navigation for desktop, links to Dashboard/Library/Search/Settings)
- `Layout.tsx` (wrapper that combines Navbar + Sidebar + content)

**Acceptance**: Layout renders; navigation links work (route changes)

---

### T022 [P] [INFRA] Create custom React hooks for API calls

Create `frontend/src/hooks/`:
- `useBooks.ts` → useQuery/useMutation hooks for book search
- `useUserLibrary.ts` → hooks for getUserLibrary, addBook, updateProgress, removeBook
- `useRatings.ts` → hooks for rateBook, getBookRatings, deleteRating
- `useStatistics.ts` → hook for getUserStatistics

All hooks use React Query (@tanstack/react-query) for state management

**Acceptance**: Hooks return { data, isLoading, error, mutate } structure

---

## Phase 4: User Story 1 - Add Book to Library 📚 P1

**Goal**: Users can search for books and add them to their personal library (core MVP feature)

**Independent Test**: Complete workflow: search → select book → add to library → view in library list

**Prerequisite**: Phase 3 complete (API, components, hooks ready)

### T023 [US1] Create Search page layout

Create `frontend/src/app/search/page.tsx`:
- Displays large search input (debounced)
- Shows search results grid/list (books with cover, title, author)
- "Add to Library" button for each book (or "Already Added" if in library)

**Acceptance**: Search input renders; results grid displays

---

### T024 [US1] Implement Search functionality component

Create `frontend/src/features/search/ui/Search.tsx`:
- `SearchInput` component with debounced onChange (500ms delay before API call)
- `ResultsGrid` component displays books from `useBooks` hook
- Click on book → calls `addBook` or shows "already added"

Connect to `bookClient.searchBooks()` API endpoint

**Acceptance**: Typing in search bar calls API after debounce; results update

---

### T025 [US1] Create book add modal/detail view

Create `frontend/src/features/search/ui/BookPreviewModal.tsx`:
- Shows book details (cover, title, author, ISBN, synopsis)
- "Add to Library" button triggers `useUserLibrary.addBook(bookId)`
- Success toast on add

**Acceptance**: Modal opens on book click; "Add to Library" triggers mutation; success message appears

---

### T026 [US1] Implement add book API endpoint (backend)

Ensure `POST /api/users/me/books` endpoint works:
- Call `UserBookService.addBookToLibrary(userId, bookId)`
- Validation: user and book exist, no duplicate in library
- Return UserBook object or error { success: false, error: "Already in library" }

**Acceptance**: Endpoint tested with duplicate prevention; returns standardized response

---

### T027 [US1] Create Library page with initial book list

Create `frontend/src/app/library/page.tsx`:
- Displays user's books fetched from `useUserLibrary().data`
- Shows list/grid view toggle (state-driven)
- Each book card shows: cover, title, author, status badge

**Acceptance**: Page renders; books load on mount; list/grid toggle works

---

### T028 [US1] Implement LibraryList and BookCard components

Create `frontend/src/features/library/ui/`:
- `Library.tsx` (main container, manages view toggle state)
- `BookCard.tsx` (grid view: cover, title, author, status badge, quick actions)
- `BookRow.tsx` (list view: more compact, status and actions inline)
- Both components accept `onRemove`, `onComplete` callbacks

**Acceptance**: Cards render with all info; actions are clickable

---

### T029 [US1] Test P1 User Story 1 complete

End-to-end test:
1. Search for "The Great Gatsby" on Search page
2. Click "Add to Library"
3. Navigate to Library page
4. Book appears in library list
5. Attempt to add same book again → shows "Already Added"

**Acceptance**: All steps work; no console errors; data persists

---

## Phase 5: User Stories 2 & 3 - Rate & Track Progress 📖 P1

**Goal**: Users can rate books (1-5 stars) and track reading progress (pages, percentage)

**Independent Test**: Can rate a book and see rating persist; can update progress and see status change

**Prerequisite**: Phase 4 complete (add book working)

### T030 [US2, US3] Create Book Detail page

Create `frontend/src/app/library/[bookId]/page.tsx`:
- Fetch book and user's rating from API
- Display book metadata (cover, title, author, ISBN, synopsis)
- Show progress tracking section (pages input, progress bar)
- Show rating section (5-star picker, review textarea)

**Acceptance**: Page renders with all sections; data loads on mount

---

### T031 [US3] Implement progress tracking component

Create `frontend/src/features/library/ui/ProgressTracker.tsx`:
- Input for pages read (number, max = totalPages)
- Displays percentage bar (calculated)
- Status selector (Want to Read, In Progress, Completed)
- Save button triggers `useUserLibrary.updateProgress(bookId, { pagesRead, status })`

Validation: frontend shows error if pages > totalPages; backend enforces

**Acceptance**: Input values update state; save button calls API; progress bar updates

---

### T032 [US3] Implement update progress API endpoint (backend)

Ensure `PATCH /api/users/me/books/:bookId` endpoint works:
- Call `UserBookService.updateProgress(userId, bookId, data)`
- Validate: pagesRead ≤ totalPages (reject if invalid)
- Calculate: percentageRead = (pagesRead / totalPages) * 100
- Auto-set status based on percentage (0% → WANT_TO_READ, 1-99% → IN_PROGRESS, 100% → COMPLETED)
- Return updated UserBook with calculated fields

**Acceptance**: Backend validates pages; calculates percentage; auto-sets status

---

### T033 [US2] Implement rating component

Create `frontend/src/features/library/ui/RatingEditor.tsx`:
- 5-star picker (click star to select rating)
- Review textarea (optional, max 5000 chars)
- Save button triggers `useRatings.rateBook(bookId, stars, review)`
- Shows current user rating if exists

**Acceptance**: Star selection works; review text input works; save calls API

---

### T034 [US2] Implement rating creation/update API endpoint (backend)

Ensure `POST /api/books/:bookId/ratings` endpoint works:
- Call `RatingService.rateBook(userId, bookId, stars, review)`
- Validation: stars 1-5; review ≤ 5000 chars
- Return Rating object (create if new, update if exists)

**Acceptance**: Validation catches invalid stars; review sanitized; upsert works

---

### T035 [US2] Display average book rating

Create `frontend/src/features/library/ui/BookRatings.tsx`:
- Fetches ratings for book via `useRatings.getBookRatings(bookId)`
- Displays: average rating (e.g., 4.2/5), total ratings count
- Shows user's own rating if exists

**Acceptance**: Average calculated correctly; displays with user rating indicator

---

### T036 [US2] Implement get book ratings API endpoint (backend)

Ensure `GET /api/books/:bookId/ratings` endpoint works:
- Call `RatingService.getAverageRating(bookId)` → returns { average, count }
- Also return user's own rating if authenticated user has rated this book
- Response: { averageRating: 4.2, totalRatings: 145, userRating: { stars, review } }

**Acceptance**: Average calculation correct; includes user rating

---

### T037 [US3] Display reading status badge on library cards

Update `BookCard.tsx` and `BookRow.tsx`:
- Show status badge (Want to Read, In Progress, Completed)
- Show progress bar (filled % matches percentageRead)
- Badge color changes: gray (want), blue (in progress), green (completed)

**Acceptance**: Status displayed; progress bar accurate

---

### T038 [US2, US3] Test P1 User Stories 2 & 3 complete

End-to-end test:
1. Open book detail page
2. Enter progress: 150 pages for a 300-page book
3. Verify percentage shows 50% and status auto-sets to "In Progress"
4. Navigate to Library page
5. Verify progress bar shows 50%
6. Go back to detail page
7. Rate book 4 stars with review "Great read!"
8. Verify rating displays and persists
9. Edit rating to 5 stars
10. Verify update works

**Acceptance**: All steps work; data persists across pages

---

## Phase 6: User Story 4 - Manage Library Views 📂 P2

**Goal**: Users can filter library by status and toggle view formats (list vs. grid)

**Independent Test**: Filter by status, toggle view, see correct books displayed

**Prerequisite**: Phase 5 complete (library basic features)

### T039 [US4] Create FilterBar component

Create `frontend/src/features/library/ui/FilterBar.tsx`:
- Status tabs: All, Want to Read, In Progress, Completed
- Click tab to filter
- Reset Filters button
- Sort options (dropdown: by added date, by title, etc.)
- Pass selected filters to parent as state

**Acceptance**: Tabs clickable; filter state changes UI

---

### T040 [US4] Implement library filtering logic

Update `Library.tsx`:
- Manage filter state (status, sort)
- Pass filters to `useUserLibrary.getUserLibrary(userId, { status }, limit, offset)`
- API endpoint already supports `?status=IN_PROGRESS` parameter

**Acceptance**: Filtering works; API called with correct query params

---

### T041 [US4] Add view toggle (list/grid)

Create `frontend/src/features/library/ui/ViewToggle.tsx`:
- Toggle button: List view / Grid view
- Manage state, render appropriate component (BookRow vs BookCard)

**Acceptance**: Toggle switches views; books display correctly in each view

---

### T042 [US4] Test User Story 4 complete

End-to-end test:
1. Library page shows all books
2. Click "In Progress" filter
3. Only in-progress books display
4. Toggle to list view
5. Books show in list format
6. Click "Reset Filters"
7. All books reappear in list view
8. Toggle to grid view
9. Books display as grid

**Acceptance**: Filtering works; view toggle works; combinations work

---

## Phase 7: User Story 5 - Search & Discover Books 🔍 P2

**Goal**: Users can search available books and discover new titles (already partially built in P4, enhance here)

**Independent Test**: Search for books not yet in library, view details, add to library

**Prerequisite**: Phase 6 complete

### T043 [US5] Enhance search to show external API results (optional in MVP)

Update `BookService.searchBooks(query)`:
- Search local DB first
- If few results, optionally fetch from OpenLibrary API (external_source = 'openlibrary')
- Create Book records for new books from external API
- Return combined results

**Acceptance**: Search includes books not yet in system (if external API integrated)

---

### T044 [US5] Test User Story 5 complete

Test already covered in Phase 4 (search → add workflow)

End-to-end test:
1. Search page finds books
2. Click book to see full details (title, author, synopsis, average rating)
3. "Add to Library" button works
4. If already added, shows "Already Added"

**Acceptance**: All search features functional

---

## Phase 8: User Story 6 - Dashboard Overview 📊 P2

**Goal**: Users see reading statistics and recent activity at a glance

**Independent Test**: Dashboard displays correct statistics based on user's library

**Prerequisite**: Phase 7 complete (all core features functional)

### T045 [US6] Create Dashboard page layout

Create `frontend/src/app/dashboard/page.tsx`:
- Hero section: "Welcome, [User Name]"
- Statistics cards: total books, completed, in progress, average rating
- Recent activity feed (last 10 actions)
- Monthly reading chart (P2 enhancement)

**Acceptance**: Page renders; sections visible

---

### T046 [US6] Implement StatsCard component

Create `frontend/src/features/dashboard/ui/StatsCard.tsx`:
- Displays single metric (icon, label, value)
- Reusable for different stats: books, completed, in progress, rating

**Acceptance**: Component renders with correct data passed as props

---

### T047 [US6] Implement ActivityFeed component

Create `frontend/src/features/dashboard/ui/ActivityFeed.tsx`:
- Fetches from `useStatistics().recentActivity`
- Displays list of recent actions (added book, completed book, rated book)
- Shows book cover, action type, timestamp

**Acceptance**: Feed renders; timestamps display correctly

---

### T048 [US6] Implement Dashboard data fetching

Create `frontend/src/features/dashboard/ui/Dashboard.tsx`:
- Calls `useStatistics.getUserStatistics()` on mount
- Displays all stats in cards
- Shows recent activity feed

**Acceptance**: Data loads; stats display correctly

---

### T049 [INFRA] Verify statistics API endpoint performance

Test `GET /api/users/me/statistics`:
- Loads within 1 second (P95)
- Calculations are efficient (no N+1 queries)
- Returns all required fields

**Acceptance**: Performance meets SC-002 requirement

---

### T050 [US6] Test User Story 6 complete

End-to-end test:
1. Dashboard page loads
2. Verify statistics cards show correct numbers (correlate with library)
3. Verify recent activity shows last actions in correct order
4. Add a new book
5. Return to dashboard
6. Verify stats updated and new book appears in activity

**Acceptance**: All dashboard features work; stats are accurate

---

## Phase 9: Pagination & Performance 🚀

**Goal**: Handle large libraries efficiently; support pagination for lists

**Prerequisite**: Phase 8 complete (all features functional)

### T051 [INFRA] Implement pagination for user library

Update `UserBookRepository.findByUserId()`:
- Add limit/offset parameters
- Return { books: [], total: number }

Update `UserBookController.getUserLibrary()`:
- Parse limit/offset from query params (default: limit=20, offset=0)
- Return paginated response

Update frontend `useUserLibrary.getUserLibrary()`:
- Support pagination hooks
- Implement "Load More" button or page numbers

**Acceptance**: Library endpoint paginated; frontend supports pagination UI

---

### T052 [INFRA] Optimize database queries

Add database indexes (should be from schema, verify they exist):
- idx_user_books_user_id (for getUserLibrary)
- idx_user_books_status (for filtering by status)
- idx_ratings_user_id (for user stats)
- idx_ratings_book_id (for book average rating)

Verify no N+1 queries in:
- getUserLibrary with joined book data
- Statistics calculation
- Recent activity query

**Acceptance**: Queries optimized; explain plan shows index usage; response times < 200ms (p95)

---

### T053 [INFRA] Add caching for book metadata

Implement simple caching:
- Cache book details for 1 hour in memory or Redis
- Cache average ratings for books (invalidate on new rating)

Reduces database load on repeated searches/views

**Acceptance**: Book detail requests cached; average rating updates propagate correctly

---

## Phase 10: Testing & Validation 🧪

**Goal**: Ensure reliability; catch regressions

**Prerequisite**: Phase 9 complete (all features built)

### T054 [INFRA] Add unit tests for services

Create `backend/tests/services/`:
- `BookService.test.ts` (test search, createOrGetBook, duplicate prevention)
- `UserBookService.test.ts` (test progress calculation, status auto-set, validation)
- `RatingService.test.ts` (test rateBook, average rating, validation)
- `StatisticsService.test.ts` (test calculations)

Use Jest or similar; mock repositories

**Acceptance**: 80%+ test coverage for business logic; all tests passing

---

### T055 [INFRA] Add integration tests for API endpoints

Create `backend/tests/api/`:
- Test each endpoint with mock database
- Verify error responses (400, 401, 404, 500)
- Verify validation errors
- Verify response format consistency

**Acceptance**: All endpoints have 2-3 test cases; integration tests passing

---

### T056 [INFRA] Add frontend component tests

Create `frontend/src/features/**/**.test.tsx`:
- Test BookCard, FilterBar, RatingEditor components
- Test form validation, event handlers
- Use React Testing Library

**Acceptance**: Major components have snapshot + behavior tests

---

### T057 [INFRA] Run full end-to-end tests

Verify complete user workflows:
1. Register/login
2. Search and add book
3. Track progress
4. Rate book
5. View library with filters
6. View dashboard statistics

**Acceptance**: All workflows succeed; no console errors

---

## Phase 11: Polish & Documentation 📝

**Goal**: Clean up code; document decisions; prepare for deployment

**Prerequisite**: Phase 10 complete (all tests passing)

### T058 [INFRA] Code cleanup and linting

Run `eslint` and `prettier` across backend and frontend:
- Fix all linting warnings
- Format code consistently
- Remove unused imports/variables

Create `.eslintrc.json` and `.prettierrc` if not present (per Constitution: Code Quality Standards)

**Acceptance**: eslint --max-warnings=0 passes; prettier --check passes

---

### T059 [INFRA] API documentation

Create `backend/docs/API.md` (or use Swagger):
- List all endpoints with method, path, params, response examples
- Use standardized response format documentation
- Include error codes and meanings

**Acceptance**: Documentation updated for all endpoints

---

### T060 [INFRA] Environment setup documentation

Create `SETUP.md`:
- Database setup instructions
- Environment variables needed
- How to run migrations
- How to start backend and frontend dev servers
- How to run tests

**Acceptance**: New developer can follow instructions to get running

---

### T061 [INFRA] Commit structure and PR readiness

Ensure git history is clean:
- Commit messages follow conventions: type(scope): description (e.g., feat(books): add search endpoint)
- No merge conflicts
- All tests passing on main branch

**Acceptance**: Main branch is deployable; PR reviews clean

---

## Phase 12: Deployment & Monitoring 🚀

**Goal**: Prepare for production; monitor performance

**Prerequisite**: Phase 11 complete (code clean, documented, tested)

### T062 [INFRA] Setup production database

- Create PostgreSQL database on production environment
- Run migrations
- Configure backup strategy

**Acceptance**: Production DB created and accessible

---

### T063 [INFRA] Configure environment for production

- Setup .env production values (DATABASE_URL, API domains, secrets)
- Configure CORS properly
- Setup HTTPS

**Acceptance**: Production configuration tested locally with env vars

---

### T064 [INFRA] Deploy backend and frontend

- Deploy backend API to production (e.g., Vercel, Railway, or traditional server)
- Deploy frontend to production
- Verify endpoints accessible

**Acceptance**: App live; user can access via production URL

---

### T065 [INFRA] Monitor and collect feedback

- Setup error logging (Sentry or similar)
- Monitor API performance logs
- Collect user feedback
- Plan P2 enhancements (recommendations, social features, etc.)

**Acceptance**: Monitoring in place; feedback collection started

---

## Success Criteria Validation

Before considering project complete, verify:

- **SC-001**: Add book in 3 clicks ✅ (Phases 4, 8)
- **SC-002**: Dashboard loads in <1s ✅ (Phase 9, optimized)
- **SC-003**: Library with 100+ books renders smoothly ✅ (Phase 9, pagination)
- **SC-004**: API response times <200ms p95 ✅ (Phase 9, optimization)
- **SC-005**: 95% validation errors caught on backend ✅ (Phase 2, services)
- **SC-006**: >99% duplicate prevention ✅ (Phase 1, unique constraints)
- **SC-007**: Progress updates reflect within 1s ✅ (Phase 5, real-time)
- **SC-008**: First session in <5 minutes ✅ (Phases 4-6, UX)

All Phase 10 tests passing before production deployment.

---

## Implementation Notes

### Constitution Alignment Throughout
- **Layered Architecture**: Repositories → Services → Controllers (strict separation)
- **API-First**: Every feature exposed via REST endpoint
- **Business Logic in Services**: No logic in controllers or frontend components
- **Type Safety**: All types defined in shared types file; TypeScript strict mode
- **Simplicity First**: No event sourcing, no complex patterns; straightforward design

### Parallel Task Opportunities
- Phase 0 tasks (T001-T004): All can run in parallel
- Phase 1 tasks (T005-T011): Repositories [P], Services [P] after repos done
- Phase 2 tasks (T012-T018): Controllers [P] after services; routes after controllers
- Phase 3 tasks (T019-T022): API clients [P], UI components [P], Hooks [P]
- Phase 10 tasks (T054-T056): All test tasks [P]

### Dependency Summary
```
Phases 0-3: Foundation (sequential, blocking)
  ↓
Phases 4-8: Features (can parallelize frontend/backend work)
  ↓
Phase 9: Performance (after features complete)
  ↓
Phase 10: Testing (after Phase 9)
  ↓
Phase 11: Polish (before deployment)
  ↓
Phase 12: Deploy (production ready)
```

### Estimated Timeline
- Phase 0-3: 1-2 weeks (foundation)
- Phase 4-6: 2-3 weeks (P1 features)
- Phase 7-8: 1 week (P2 light features)
- Phase 9-12: 1-2 weeks (polish, deploy)
- **Total**: 5-8 weeks for MVP

---

## Checkpoint: Deployment Ready

✅ All tests passing  
✅ Code linted and formatted  
✅ Documentation complete  
✅ Environment configured  
✅ Database migrated  
✅ API endpoints verified  
✅ Frontend pages functional  
✅ Success criteria met  

🚀 **Ready for production deployment**
