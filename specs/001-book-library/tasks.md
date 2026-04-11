# Tasks: Personal Book Library Tracker

**Input**: Design documents from `/specs/001-book-library/`  
**Prerequisites**: ✅ plan.md, ✅ spec.md, ✅ research.md, ✅ data-model.md, ✅ contracts/

**Tests**: Included with contract testing (TDD approach) and integration tests per user story

**Organization**: Tasks grouped by user story with setup/foundational phases. Each user story (US1-US7) can be implemented independently after foundational work completes.

---

## 🚀 Implementation Status

| Phase | Title | Status | Tasks | Completion |
|-------|-------|--------|-------|-----------|
| **Phase 1** | Setup (Shared Infrastructure) | ✅ **COMPLETE** | T001-T005 | 5/5 |
| **Phase 2** | Foundational (Blocking Prerequisites) | 🔜 In Queue | T006-T019 | 0/14 |
| **Phase 3** | User Story 1: Search & Discover (P1) | 🔜 In Queue | T020-T030 | 0/11 |
| **Phase 4** | User Story 2: Build Library (P1) | 🔜 In Queue | T031-T040 | 0/10 |
| **Phase 5** | User Story 3: Status Organization (P1) | 🔜 In Queue | T041-T055 | 0/15 |
| **Phase 6** | User Story 4: Track Progress (P2) | 🔜 In Queue | T056-T067 | 0/12 |
| **Phase 7** | User Story 5: Rate & Review (P2) | 🔜 In Queue | T068-T079 | 0/12 |
| **Phase 8** | User Story 6: Filter & Sort (P2) | 🔜 In Queue | T080-T091 | 0/12 |
| **Phase 9** | User Story 7: Dashboard (P3) | 🔜 In Queue | T092-T105 | 0/14 |
| **Phase 10** | Polish & Cross-Cutting | 🔜 In Queue | T106-T139 | 0/34 |
| **TOTAL** | | | **T001-T139** | **5/139 (3.6%)** |

---

## ✅ Phase 1 Completed

### Artifacts Created

1. **backend/src/models/types.ts** - Comprehensive TypeScript types for:
   - Entity interfaces (User, Book, UserBook)
   - Enums (BookStatus)
   - API request/response types
   - Service error types (ValidationError, NotFoundError, ConflictError)

2. **backend/src/lib/validators.ts** - Zod validation schemas for:
   - Search queries
   - Book addition and updates
   - Library filters
   - Input sanitization and type coercion

3. **backend/src/lib/response.ts** - Response formatting utilities:
   - successResponse<T>() - Format successful responses
   - errorResponse() - Format error responses
   - HTTP status code helpers
   - Type guards (isSuccess, isError)

4. **frontend/jest.config.ts** - Jest testing configuration:
   - jsdom test environment
   - @ alias path mapping
   - Coverage thresholds (50% minimum)
   - Setup file integration

5. **frontend/jest.setup.ts** - Jest setup with mocks:
   - Testing library initialization
   - next/router mocks
   - next/navigation mocks

6. **README.md** - Comprehensive project documentation:
   - Quick start guide (5 min setup)
   - Project structure overview
   - Development workflow
   - Architecture principles (Booklog Constitution)
   - Testing guidance
   - Deployment instructions
   - Troubleshooting guide

### Dependencies Installed

✅ Backend/Database:
- prisma, @prisma/client - ORM and client
- pg - PostgreSQL driver
- zod - Schema validation and TypeScript type inference

✅ Testing:
- jest, @types/jest - Testing framework and types
- ts-jest - TypeScript support for Jest
- @testing-library/jest-dom - Jest DOM matchers

✅ External APIs:
- @googleapis/books - Google Books API client

### Next: Phase 2 - Foundational Infrastructure

**Phase 2 Tasks (T006-T019)** are now ready to begin. Phase 2 is a **CRITICAL GATE** that blocks all user story work (Phases 3-9). Key focus:

1. **Data Layer (T006-T008)**: Prisma migrations, TypeScript model exports
2. **Auth (T009-T010)**: Authentication middleware, JWT utilities
3. **Validation (T011-T013)**: Request validation, error handling, response formatting
4. **External APIs (T014-T015)**: Google Books API client, environment setup
5. **Logging (T016-T017)**: Structured logging service (FR-017)
6. **API Structure (T018-T019)**: Route handler scaffolding, CORS middleware

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, ..., US7) or foundational marker
- **File paths**: Exact paths from planning phase (backend/src/, frontend/src/)

## Path Conventions

**Web app structure** (from plan.md):
- `backend/src/` - TypeScript API routes, services, models
- `frontend/src/` - React components, pages, services
- `backend/prisma/` - Database schema and migrations

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

**Status**: ✅ COMPLETE

- [x] T001 Initialize Next.js project with TypeScript 5.x strict mode and TailwindCSS per constitution
  - ✅ Dependencies installed: prisma, zod, jest, @types/jest, ts-jest, @googleapis/books
  - ✅ TypeScript strict mode enabled in tsconfig.json
  - ✅ Next.js 16 and React 19 configured
  - ✅ TailwindCSS 4 installed
- [x] T002 Setup Prisma ORM with PostgreSQL connection and migration framework
  - ✅ Prisma schema defined with User, Book, UserBook, Rating models
  - ✅ Enum BookStatus configured (WANT_TO_READ, IN_PROGRESS, COMPLETED)
  - ✅ Indexes and unique constraints set up for performance
- [x] T003 [P] Configure ESLint and Prettier for code style enforcement
  - ✅ ESLint 9 installed and configured
  - ✅ Prettier integration ready (in dependencies)
- [x] T004 [P] Setup Jest for unit and integration testing
  - ✅ Jest configuration created (jest.config.ts)
  - ✅ Jest setup file created (jest.setup.ts) with Next.js mocks
  - ✅ Test environment configured for jsdom
  - ✅ Coverage thresholds set (50% branches, functions, lines, statements)
- [x] T005 Create project documentation structure (README, setup guides)
  - ✅ Comprehensive README.md created with:
    - Quick start guide
    - Project structure documentation
    - Development workflow
    - Architecture overview (Booklog Constitution alignment)
    - Testing guide
    - Deployment instructions
    - Troubleshooting section

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: Setup + Foundational phases MUST complete before user story work begins

### Data Layer

- [ ] T006 Create Prisma schema with User, Book, UserBook models in `backend/prisma/schema.prisma` (per data-model.md)
- [ ] T007 Run Prisma migration to create users, books, user_books tables with unique constraints and indexes
- [ ] T008 Create TypeScript models/types in `backend/src/models/types.ts` (User, Book, UserBook, BookStatus enums)

### Authentication & Authorization Middleware

- [ ] T009 [P] Implement auth middleware in `backend/src/middleware/auth.ts` (verify JWT token, extract user context)
- [ ] T010 [P] Create auth utilities in `backend/src/lib/authUtils.ts` (token validation, user context helpers)

### Validation & Error Handling

- [ ] T011 [P] Create Zod schemas for request validation in `backend/src/lib/validators.ts` (search queries, library updates, rating inputs)
- [ ] T012 [P] Implement error handling middleware in `backend/src/middleware/errorHandler.ts` (standardized error responses)
- [ ] T013 [P] Create response formatter in `backend/src/lib/response.ts` (standardized success/error response format)

### External API Integration

- [ ] T014 Create Google Books API client wrapper in `backend/src/lib/googleBooksClient.ts` (search, error handling, rate limiting)
- [ ] T015 [P] Setup environment variables (.env.local) for Google Books API key, database URL, log level

### Logging Infrastructure

- [ ] T016 Create logging service in `backend/src/services/loggingService.ts` implementing FR-017 (state changes, errors, timing)
- [ ] T017 [P] Configure logging output (Winston/Pino) in `backend/src/lib/logger.ts`

### API Structure

- [ ] T018 Create base API route handlers structure in `backend/src/api/` directories (search/, library/, dashboard/)
- [ ] T019 [P] Setup CORS middleware for frontend origin in `backend/src/middleware/cors.ts`

**Checkpoint**: Foundation complete - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Search and Discover Books (Priority: P1) 🎯 MVP

**Goal**: Enable users to search Google Books API and discover books with titles, authors, covers, and details

**Independent Test**: User → enters search query → receives book results with details → can view book info independently

### Contract Tests for User Story 1

> **Test-Driven Development**: Write these tests FIRST, verify they FAIL, then implement

- [ ] T020 [P] [US1] Create contract test for GET /search endpoint in `backend/tests/integration/search.test.ts` (valid query, empty results, API error scenarios)
- [ ] T021 [P] [US1] Create integration test for search flow in `backend/tests/integration/searchFlow.test.ts` (search → receive results validation)

### Implementation for User Story 1

- [ ] T022 [P] [US1] Implement SearchService in `backend/src/services/searchService.ts` (query Google Books API, handle errors per FR-001, FR-002)
- [ ] T023 [P] [US1] Create GET /search route handler in `backend/src/api/search/route.ts` (validate query, call SearchService, return standardized response)
- [ ] T024 [P] [US1] Implement search query builder with title/author/ISBN support in `backend/src/lib/googleBooksClient.ts`
- [ ] T025 [P] [US1] Create search error handling (API down, rate limit, timeout) per FR-016
- [ ] T026 [US1] Create Search page component in `frontend/src/app/search/page.tsx` (search form, result display)
- [ ] T027 [P] [US1] Create SearchBar component in `frontend/src/components/SearchBar.tsx` (input, debounce, submit)
- [ ] T028 [P] [US1] Create BookCard component (reusable) in `frontend/src/components/BookCard.tsx` (display book info, cover, rating)
- [ ] T029 [P] [US1] Create API client method in `frontend/src/services/apiClient.ts` (GET /search wrapper)
- [ ] T030 [US1] Add logging for search operations (state changes, latency) using LoggingService

**Checkpoint**: User Story 1 functional - search working independently, testable without library features

---

## Phase 4: User Story 2 - Build Personal Library (Priority: P1) 🎯 MVP

**Goal**: Enable users to add discovered books to personal library with initial status selection, prevent duplicates (FR-003, FR-004)

**Independent Test**: User → searches book → clicks "Add to Library" → selects status (WANT_TO_READ) → book appears in library

### Contract Tests for User Story 2

- [ ] T031 [P] [US2] Create contract test for POST /library endpoint in `backend/tests/integration/addBook.test.ts` (successful add, duplicate prevention, invalid status)
- [ ] T032 [P] [US2] Create integration test for add-to-library flow in `backend/tests/integration/addBookFlow.test.ts`

### Implementation for User Story 2

- [ ] T033 [P] [US2] Implement LibraryService.addBook() in `backend/src/services/libraryService.ts` (prevent duplicates via unique constraint, create UserBook)
- [ ] T034 [P] [US2] Create Book record caching logic in LibraryService (fetch from DB if exists, create if new)
- [ ] T035 [P] [US2] Implement POST /library route handler in `backend/src/api/library/route.ts` (validate inputs, call LibraryService.addBook)
- [ ] T036 [P] [US2] Create "Add to Library" button on BookCard component `frontend/src/components/BookCard.tsx` with status selector
- [ ] T037 [P] [US2] Implement status selector dialog/form component in `frontend/src/components/StatusSelector.tsx` (WANT_TO_READ, IN_PROGRESS, COMPLETED)
- [ ] T038 [US2] Create API method in apiClient for POST /library
- [ ] T039 [US2] Handle duplicate book error in frontend (show user-friendly message)
- [ ] T040 [US2] Add logging for library additions (state change: book added, with status) using LoggingService

**Checkpoint**: User Stories 1 + 2 functional - search → add to library working independently

---

## Phase 5: User Story 3 - Organize Library by Reading Status (Priority: P1) 🎯 MVP

**Goal**: Display library organized by status, enable status filtering, status transitions with timestamp management (FR-005, FR-006)

**Independent Test**: User → adds multiple books with different statuses → views library organized by sections → filters by status → sees only matching books

### Contract Tests for User Story 3

- [ ] T041 [P] [US3] Create contract test for GET /library with status filter in `backend/tests/integration/libraryFilter.test.ts` (all statuses, mixed filters, no matches)
- [ ] T042 [P] [US3] Create contract test for PUT /library/[id] status update in `backend/tests/integration/statusUpdate.test.ts` (valid transitions, timestamp management)
- [ ] T043 [P] [US3] Create integration test for library view + filtering flow in `backend/tests/integration/libraryViewFlow.test.ts`

### Implementation for User Story 3

- [ ] T044 [P] [US3] Implement LibraryService.getLibrary() in `backend/src/services/libraryService.ts` (filter by status, sorting, pagination per FR-012)
- [ ] T045 [P] [US3] Implement LibraryService.updateBookStatus() in LibraryService (status transitions, timestamp management: dateStarted, dateCompleted)
- [ ] T046 [P] [US3] Create GET /library route handler in `backend/src/api/library/route.ts` (query params: status filter, sort order, pagination)
- [ ] T047 [P] [US3] Create PUT /library/[id] route handler in `backend/src/api/library/[id]/route.ts` (update status via LibraryService.updateBookStatus)
- [ ] T048 [US3] Create Library page component in `frontend/src/app/library/page.tsx` (load library, display books organized by status)
- [ ] T049 [P] [US3] Create LibraryGrid component in `frontend/src/components/LibraryGrid.tsx` (display books in grid/list, status badges)
- [ ] T050 [P] [US3] Create StatusFilter component in `frontend/src/components/StatusFilter.tsx` (WANT_TO_READ, IN_PROGRESS, COMPLETED filters)
- [ ] T051 [P] [US3] Create StatusBadge component in `frontend/src/components/StatusBadge.tsx` (visual indicator for each status)
- [ ] T052 [P] [US3] Implement status section view (organize books by Want/In Progress/Completed)
- [ ] T053 [US3] Add status transition UI (move book between statuses, confirm changes)
- [ ] T054 [US3] Create LibraryStore/Context in `frontend/src/stores/libraryStore.ts` (manage library state, filters)
- [ ] T055 [US3] Add logging for status changes (state change: status updated from X to Y, with timestamp) using LoggingService

**Checkpoint**: User Stories 1 + 2 + 3 functional - MVP core features complete (search → add → organize)

---

## Phase 6: User Story 4 - Track Reading Progress (Priority: P2)

**Goal**: Log pages read, calculate completion percentage accurately (FR-007, FR-008), flexible page/percentage input

**Independent Test**: User → marks book IN_PROGRESS → logs pages read → system calculates and displays percentage → updates on card

### Contract Tests for User Story 4

- [ ] T056 [P] [US4] Create contract test for progress update in PUT /library/[id] in `backend/tests/integration/progressUpdate.test.ts` (valid pages, exceeds total, null pageCount)
- [ ] T057 [P] [US4] Create test for percentage calculation accuracy (within 0.1% precision per SC-004) in `backend/tests/unit/progressService.test.ts`
- [ ] T058 [P] [US4] Create integration test for progress tracking flow in `backend/tests/integration/progressFlow.test.ts`

### Implementation for User Story 4

- [ ] T059 [P] [US4] Implement ProgressService in `backend/src/services/progressService.ts` (calculatePercentage, validatePagesRead per data-model.md)
- [ ] T060 [P] [US4] Update LibraryService.updateBook() to accept pagesRead, call ProgressService.calculatePercentage
- [ ] T061 [P] [US4] Update PUT /library/[id] handler to validate and update pagesRead (prevent > pageCount)
- [ ] T062 [P] [US4] Create ProgressTracker component in `frontend/src/components/ProgressTracker.tsx` (pages input or percentage input based on pageCount availability)
- [ ] T063 [P] [US4] Create ProgressBar component in `frontend/src/components/ProgressBar.tsx` (visual progress indicator)
- [ ] T064 [P] [US4] Implement flexible progress input (pages if available, else percentage) in ProgressTracker
- [ ] T065 [US4] Create BookDetails page in `frontend/src/app/library/[id]/page.tsx` (show book + progress tracker)
- [ ] T066 [US4] Update BookCard to show progress bar when IN_PROGRESS
- [ ] T067 [US4] Add logging for progress updates (state change: pages updated, percentage calculated) using LoggingService

**Checkpoint**: Reading progress tracking functional

---

## Phase 7: User Story 5 - Rate and Review Books (Priority: P2)

**Goal**: Enable ratings (1-5 stars) and optional reviews, keep private per FR-010, FR-011, FR-011a

**Independent Test**: User → completes book → adds rating + review → views book details → sees saved rating/review (private)

### Contract Tests for User Story 5

- [ ] T068 [P] [US5] Create contract test for rating/review update in PUT /library/[id] in `backend/tests/integration/ratingUpdate.test.ts` (valid 1-5, null, update, privacy)
- [ ] T069 [P] [US5] Create integration test for rating flow in `backend/tests/integration/ratingFlow.test.ts` (only user can see their rating)
- [ ] T070 [P] [US5] Create test verifying ratings are user-private in `backend/tests/integration/ratingPrivacy.test.ts`

### Implementation for User Story 5

- [ ] T071 [P] [US5] Implement RatingService in `backend/src/services/ratingService.ts` (validate rating 1-5, persist, user-scoped query)
- [ ] T072 [P] [US5] Update LibraryService.updateBook() to accept rating, reviewText, call RatingService.updateRating
- [ ] T073 [P] [US5] Update PUT /library/[id] handler to validate rating (1-5 or null) and reviewText
- [ ] T074 [P] [US5] Ensure API returns ratings/reviews only for authenticated user (private, FR-011a)
- [ ] T075 [P] [US5] Create RatingForm component in `frontend/src/components/RatingForm.tsx` (star picker 1-5, review textarea)
- [ ] T076 [P] [US5] Create StarRating component in `frontend/src/components/StarRating.tsx` (visual star selector)
- [ ] T077 [US5] Add rating display on BookCard (show user's rating if present)
- [ ] T078 [US5] Integrate RatingForm into BookDetails page
- [ ] T079 [US5] Add logging for rating changes (state change: rating updated, review created/updated) using LoggingService

**Checkpoint**: Rating and review system functional with privacy enforced

---

## Phase 8: User Story 6 - View and Filter Library (Priority: P2)

**Goal**: Display library with filtering, sorting, search; responsive design per FR-012

**Independent Test**: User → has 20+ books across statuses → applies status filter → sees only matches; tries different sorts → sees reordered results

### Contract Tests for User Story 6

- [ ] T080 [P] [US6] Create contract test for GET /library with all filter/sort params in `backend/tests/integration/libraryAdvanced.test.ts` (combinations: status + sort + search + pagination)
- [ ] T081 [P] [US6] Create integration test for filtering and sorting flows in `backend/tests/integration/filterSortFlow.test.ts`
- [ ] T082 [P] [US6] Create pagination test in `backend/tests/integration/pagination.test.ts` (limit, page params)

### Implementation for User Story 6

- [ ] T083 [P] [US6] Enhance LibraryService.getLibrary() with sort options (dateAdded, dateCompleted, title, author, rating)
- [ ] T084 [P] [US6] Add search/filter by title/author in LibraryService.getLibrary() with partial-match SQL queries
- [ ] T085 [P] [US6] Update GET /library handler with q, sort, order, page, limit query params
- [ ] T086 [P] [US6] Create SortSelector component in `frontend/src/components/SortSelector.tsx` (Recent Added, Last Completed, Title, Author, Rating)
- [ ] T087 [P] [US6] Create SearchWithinLibrary component in `frontend/src/components/SearchWithinLibrary.tsx` (local search field)
- [ ] T088 [P] [US6] Update LibraryGrid to display pagination controls
- [ ] T089 [US6] Implement responsive design for Library page (mobile-first per constitution)
- [ ] T090 [US6] Update LibraryStore to manage filters, sort, search state
- [ ] T091 [US6] Add logging for filter/search operations (action: library filtered, search executed, with parameters) using LoggingService

**Checkpoint**: Full library view, filtering, and sorting functional

---

## Phase 9: User Story 7 - Reading Dashboard and Statistics (Priority: P3)

**Goal**: Display reading statistics and recent activity (FR-013), aggregate accurate metrics per SC-005

**Independent Test**: User → has books in all statuses with ratings → opens dashboard → sees total count, in-progress count, completed count, average rating, recent activity (all accurate)

### Contract Tests for User Story 7

- [ ] T092 [P] [US7] Create contract test for GET /dashboard in `backend/tests/integration/dashboard.test.ts` (aggregate metrics accuracy, recent activity order)
- [ ] T093 [P] [US7] Create test for statistics calculations in `backend/tests/unit/dashboardService.test.ts` (total, average, completions this month/year)
- [ ] T094 [P] [US7] Create integration test for dashboard flow in `backend/tests/integration/dashboardFlow.test.ts`

### Implementation for User Story 7

- [ ] T095 [P] [US7] Implement DashboardService.getStatistics() in `backend/src/services/dashboardService.ts` (aggregate totals, counts, average rating, recent activity per data-model.md)
- [ ] T096 [P] [US7] Create GET /dashboard route handler in `backend/src/api/dashboard/route.ts` (call DashboardService, return standardized response)
- [ ] T097 [P] [US7] Implement calculations: total books, in-progress, completed, average rating, completion counts by month/year
- [ ] T098 [P] [US7] Implement recent activity aggregation (10 most recent actions: added, started, completed, rated)
- [ ] T099 [P] [US7] Create Dashboard component in `frontend/src/app/page.tsx` (summary card, stats display, recent activity list)
- [ ] T100 [P] [US7] Create StatCard component in `frontend/src/components/StatCard.tsx` (display individual metric: total, in progress, etc.)
- [ ] T101 [P] [US7] Create RecentActivityList component in `frontend/src/components/RecentActivityList.tsx` (show recent book actions)
- [ ] T102 [P] [US7] Create AverageRatingDisplay component in `frontend/src/components/AverageRatingDisplay.tsx` (show average rating with count)
- [ ] T103 [US7] Add estimated completion date calculation in ProgressService (heuristic based on reading pace)
- [ ] T104 [US7] Display estimated completion dates on currentReading cards
- [ ] T105 [US7] Add logging for dashboard stats calculations (action: statistics calculated, timing) using LoggingService

**Checkpoint**: Dashboard fully functional with all statistics and recent activity

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and validation across all user stories

### Documentation & Quality

- [ ] T106 [P] Update README with setup instructions, architecture overview
- [ ] T107 [P] Create developer guide for running tests, building, deploying
- [ ] T108 Run quickstart.md validation (all setup steps, commands work)
- [ ] T109 Update CHANGELOG with feature summary

### Testing & Coverage

- [ ] T110 [P] Run all unit tests: `npm test -- --testPathPattern=services` (ProgressService, RatingService, etc.)
- [ ] T111 [P] Run all integration tests: `npm test -- --testPathPattern=integration` (all API flows)
- [ ] T112 [P] Verify test coverage meets 80% threshold for services layer
- [ ] T113 [P] Fix any flaky or failing tests

### Code Quality & Type Safety

- [ ] T114 [P] Run TypeScript type checking: `tsc --noEmit` (strict mode per constitution)
- [ ] T115 [P] Run linting: `eslint . --fix` (enforce Booklog Constitution code standards)
- [ ] T116 [P] Run code formatter: `prettier --write .`
- [ ] T117 Code review for architectural compliance (layered architecture, REST API-First, etc.)

### Performance & Monitoring

- [ ] T118 [P] Verify search latency <2 seconds (per SC-008) - profile SearchService
- [ ] T119 [P] Verify library filtering <2 seconds (per SC-008) - check DB indexes and queries
- [ ] T120 [P] Verify dashboard update <2 seconds (per SC-005) - test DashboardService latency
- [ ] T121 [P] Test with 10000+ books per user (scalability per plan.md constraints)
- [ ] T122 Load test with 100 concurrent users (baseline per performance goals)

### Database & Deployment

- [ ] T123 [P] Verify Prisma migrations are repeatable: `prisma migrate reset` on fresh DB
- [ ] T124 [P] Create production database backup strategy
- [ ] T125 [P] Test deployment to staging environment
- [ ] T126 Environment configuration validation (.env.local, secrets management)

### Security & Compliance

- [ ] T127 [P] Verify authentication middleware blocks unauthenticated requests
- [ ] T128 [P] Verify user isolation (users cannot access other users' books/ratings)
- [ ] T129 [P] Verify input validation prevents SQL injection, XSS
- [ ] T130 [P] Review Google Books API key security (not exposed in frontend, used server-side only)
- [ ] T131 [P] Verify rating/review privacy enforced at API layer

### Documentation & Training

- [ ] T132 Create API documentation (Swagger/OpenAPI or manual)
- [ ] T133 Create frontend architecture documentation
- [ ] T134 Create database schema documentation
- [ ] T135 Record walkthrough video of core features

### Launch Preparation

- [ ] T136 Feature flag setup for gradual rollout (optional, based on deployment strategy)
- [ ] T137 Monitoring and alerting configuration (error rates, latency, API failures)
- [ ] T138 Create rollback plan for production incidents
- [ ] T139 Schedule launch date and communication plan

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Phase 1 (Setup)**: No dependencies - start immediately
   - Status: ✅ Ready to start
   
2. **Phase 2 (Foundational)**: Depends on Phase 1 completion
   - Status: ✅ BLOCKS all user story work until complete
   
3. **Phases 3-9 (User Stories)**: All depend on Phase 2 completion
   - After Phase 2, all stories can proceed in parallel OR sequentially in priority order
   - Stories are independent and can be deployed individually
   
4. **Phase 10 (Polish)**: Depends on desired user stories completion
   - Can run some checks in parallel with final stories

### User Story Dependencies

```
Phase 1 (Setup)
↓
Phase 2 (Foundational) ← CRITICAL GATE
↓
┌─ US1 (P1): Search & Discover     [Independent]
├─ US2 (P1): Build Library         [Independent, searches from US1]
├─ US3 (P1): Organize by Status    [Independent, uses Library from US2]
├─ US4 (P2): Track Progress        [Independent, enhances US3]
├─ US5 (P2): Rate & Review         [Independent, enhances US3]
├─ US6 (P2): View & Filter         [Independent, enhances US3]
└─ US7 (P3): Dashboard & Stats     [Depends on US1-US6 data]

After all stories → Phase 10 (Polish & Cross-Cutting)
```

### MVP Completion Path (Minimum Viable Product)

1. ✅ Phase 1: Setup (T001-T005)
2. ✅ Phase 2: Foundational (T006-T019)
3. ✅ Phase 3: US1 - Search (T020-T030)
4. ✅ Phase 4: US2 - Add to Library (T031-T040)
5. ✅ Phase 5: US3 - Status Organization (T041-T055)

**At this point: MVP COMPLETE** ✅
- Users can search, add books, organize by status
- Ready for initial user testing/demo

Continue with:
6. Phase 6: US4 - Progress Tracking (T056-T067)
7. Phase 7: US5 - Ratings & Reviews (T068-T079)
8. Phase 8: US6 - Advanced Filtering (T080-T091)
9. Phase 9: US7 - Dashboard (T092-T105)
10. Phase 10: Polish (T106-T139)

### Parallel Opportunities per Story

**Within Phase 2 (Foundational)**:
- All [P] tasks can run in parallel: T003, T004, T009, T010, T011, T012, T013, T015, T017, T019
- Sequential: T006 → T007 (migration depends on schema)

**Within Phase 3 (US1: Search)**:
- All [P] tasks can run in parallel: T020, T021, T022, T023, T024, T025, T027, T028, T029
- Sequential: T022 → T023 (route needs service)

**Within Phase 4 (US2: Add to Library)**:
- All [P] tasks can run in parallel: T031, T032, T033, T034, T036, T037, T038
- Sequential: T033 → both T035 and libraryService dependencies

**Within Phase 5 (US3: Status)**:
- All [P] tasks can run in parallel: T041, T042, T043, T044, T045, T046, T047, T049, T050, T051, T052
- Sequential: Backend services before handlers

**Cross-Story Parallelism** (after Phase 2):
- Developer A: Phase 3 + Phase 4 (US1 + US2)
- Developer B: Phase 6 (US4 - Progress)
- Developer C: Phase 7 (US5 - Ratings)
- Developer D: Phase 8 (US6 - Filtering)
- All: Phase 10 (Polish) together

---

## Implementation Strategy

### MVP First (Recommended)

```
Week 1: Phases 1-2 (Setup + Foundational)
Week 2: Phases 3-5 (P1 stories: Search, Add, Status)
→ PAUSE & VALIDATE: Feature gate to test with real users
Week 3: Phases 6-8 (P2 stories: Progress, Ratings, Filtering)
Week 4: Phase 9 (P3: Dashboard) + Polish
```

### Incremental Delivery Strategy

- **Increment 1** (MVP): Complete Phases 1-5 → Search, Add, Organize working
- **Increment 2** (Tracking): Add Phase 6 (US4) → Progress tracking
- **Increment 3** (Feedback): Add Phase 7 (US5) → Ratings & reviews
- **Increment 4** (Browsing): Add Phase 8 (US6) → Advanced filtering
- **Increment 5** (Insights): Add Phase 9 (US7) → Dashboard & stats

Each increment can be deployed independently and provides value.

### Team Parallelization

With 4 developers:

```
Dev 1 → Phase 1-2 (Setup + Foundational foundation)
Dev 2 → Phase 3-4 (US1 + US2: Search & Library)
Dev 3 → Phase 6 (US4: Progress Tracking)
Dev 4 → Phase 7-8 (US5 + US6: Ratings & Filtering)

After Phase 2 → All 4 can work in parallel once foundation is ready
```

---

## Notes

- All tasks with [P] marker can be parallelized within their phase
- Verify tests FAIL before implementing (TDD approach)
- Commit after each task or logical grouping
- Run test suite frequently: `npm test`
- Constitution compliance verified at Phase 10: T117  (Layered Architecture, REST API-First, Business Logic in Services, Type Safety, Simplicity)
- Each user story independently testable and deployable
- Stop at any checkpoint to validate story and deploy if needed
- Estimated effort: 50-70 development hours for MVP (Phases 1-5)

---

## Next Steps

1. ✅ Tasks generated (this file)
2. →  Assign tasks to team members
3. →  Start Phase 1: Setup (T001-T005)
4. →  After Phase 1 complete, start Phase 2: Foundational (T006-T019)
5. →  After Phase 2 complete, start User Story phases in parallel (T020+)
6. →  Commit code after each significant task
7. →  Run tests frequently: `npm test`
8. →  Validate MVP completion at end of Phase 5

**Estimated Delivery**:
- MVP (Phases 1-5): 2-3 weeks
- Full Feature (Phases 1-9): 4-5 weeks
- Production Ready (+ Phase 10): 5-6 weeks
