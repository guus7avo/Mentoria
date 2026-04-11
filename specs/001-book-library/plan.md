# Implementation Plan: Personal Book Library Tracker

**Branch**: `001-book-library` | **Date**: 2026-04-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-book-library/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a personal book tracking application where readers can search for books via Google Books API, add them to a personal library organized by status (Want to Read, In Progress, Completed), track reading progress and manage ratings/reviews within the personal library. MVP focuses on core tracking functionality with responsive web design, leveraging Next.js for full-stack development and PostgreSQL for reliable data persistence. System enforces layered architecture with business logic in services, type-safe API endpoints, and proper validation at all layers.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode enabled, per constitution)  
**Primary Dependencies**: Next.js 14+ (App Router), React 18+, Prisma ORM 5.x, TailwindCSS, Google Books API client  
**Storage**: PostgreSQL 14+ with Prisma ORM (per project constitution)  
**Testing**: Jest (unit/integration tests); focus on service layer validation  
**Target Platform**: Web (Next.js, responsive design; no mobile apps in v1)  
**Project Type**: Web application (Next.js frontend + Node.js backend)
**Performance Goals**: 
  - Search results in <2 seconds
  - Library filtering/sorting in <2 seconds
  - Dashboard statistics update within 2 seconds
  - Support 10,000 concurrent users without degradation
  - Progress calculation accuracy: ±0.1% precision

**Constraints**:
  - Internet connectivity required (no offline support in v1)
  - Google Books API rate limiting must be respected
  - Page counts optional; fallback to percentage input
  - Rating/reviews are user-private (no social features in v1)
  
**Scale/Scope**:
  - Target: Individual readers with libraries up to 10,000 books per user
  - 7 user stories (3 P1, 3 P2, 1 P3); P1 + P2 required for MVP
  - Estimated: 8-12 main entities/models, ~15 API endpoints, ~15-20 React components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Booklog Constitution Alignment

| Principle | Requirement | Design Approach | Status |
|-----------|-------------|-----------------|--------|
| **I. Layered Architecture** | Separate Controller/Service/Repository | API routes (route handlers) → Service layer (business logic) → Prisma (repository/ORM) | ✅ **ALIGNED** |
| **II. REST API-First** | All features via REST endpoints | Book search, library management, ratings, dashboard all exposed via REST endpoints with standardized JSON responses | ✅ **ALIGNED** |
| **III. Business Logic in Services** | Services contain all business rules; no logic in controllers/components | Services: SearchService (Google Books), LibraryService (manages UserBook: add/update status, progress, ratings), DashboardService (statistics aggregation) | ✅ **ALIGNED** |
| **IV. Type Safety & Validation** | Strict TypeScript; backend input validation | TypeScript strict mode; Zod/custom validators for all inputs at API layer before service processing; shared types between frontend and backend | ✅ **ALIGNED** |
| **V. Simplicity First** | Prioritize simple solutions; no premature optimization | Skip caching layer in v1; defer social features (recommendations, sharing); keep dashboard simple (aggregation, no ML); direct API calls vs. message queues | ✅ **ALIGNED** |

**Constitution Check Result**: ✅ **PASS** - No violations detected. Design aligns with all 5 core principles and code quality standards.

**Complexity Justification**: None required. Project adheres to constitution with no deviations.

## Project Structure

### Documentation (this feature)

```text
specs/001-book-library/
├── plan.md              # This file (Implementation Plan)
├── research.md          # Phase 0 output (PENDING)
├── data-model.md        # Phase 1 output (PENDING)
├── quickstart.md        # Phase 1 output (PENDING)
├── contracts/           # Phase 1 output (PENDING)
│   ├── api-overview.md
│   ├── book-search.md
│   ├── library-management.md
│   └── dashboard-stats.md
└── tasks.md             # Phase 2 output (PENDING)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── user.ts
│   │   ├── book.ts
│   │   ├── userBook.ts
│   │   └── types.ts              # Shared types with frontend
│   ├── services/
│   │   ├── searchService.ts       # Google Books API integration
│   │   ├── libraryService.ts      # Manages UserBook: add/update/delete, progress, ratings, duplicate prevention
│   │   ├── dashboardService.ts    # Statistics aggregation
│   │   └── loggingService.ts      # Standard logging (FR-017)
│   ├── api/
│   │   ├── books/
│   │   │   └── [id]/route.ts
│   │   ├── search/
│   │   │   └── route.ts
│   │   ├── library/
│   │   │   ├── route.ts           # GET (list), POST (add)
│   │   │   └── [id]/route.ts      # PUT (status/progress), DELETE
│   │   ├── dashboard/
│   │   │   └── route.ts
│   └── middleware/
│       ├── auth.ts                # Verify user authentication
│       └── validation.ts           # Input validation
│   └── lib/
│       ├── googleBooksClient.ts   # Google API wrapper
│       ├── validators.ts          # Zod schemas
│       └── logger.ts              # Logging utility
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/
└── tests/
    ├── unit/
    │   ├── services/              # Service logic tests
    │   └── utils/
    └── integration/
        └── api/                   # API endpoint tests

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Landing/Dashboard
│   │   ├── search/
│   │   │   └── page.tsx
│   │   └── library/
│   │       ├── page.tsx           # Library view with filters
│   │       └── [id]/
│   │           └── page.tsx       # Book details
│   ├── components/
│   │   ├── BookCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── LibraryGrid.tsx
│   │   ├── BookDetails.tsx
│   │   ├── RatingForm.tsx
│   │   ├── ProgressTracker.tsx
│   │   ├── Dashboard.tsx
│   │   └── StatusFilter.tsx
│   ├── services/
│   │   ├── apiClient.ts           # HTTP wrapper for backend API
│   │   └── bookService.ts         # Frontend-specific book operations
│   ├── types/
│   │   └── index.ts               # Shared types from backend
│   └── stores/ (or hooks/)
│       └── libraryStore.ts        # State management (React Context or Zustand)
└── tests/
    ├── unit/
    │   └── components/
    └── integration/
        └── flows/
```

**Structure Decision**: 
- **Selected**: Option 2 (Web application with frontend + backend)
- **Rationale**: Project is a full-stack Next.js application with:
  - Existing `backend/` and `frontend/` directories in workspace
  - Frontend needs React components, pages, and state
  - Backend needs services, API routes, and Prisma ORM
  - Shared TypeScript types bridge both layers per constitution
  - This aligns with Booklog Constitution's REST API-First and Layered Architecture principles

### Key Implementation Patterns

1. **API Layer** (REST Controllers / Route Handlers)
   - All endpoints follow RESTful conventions
   - Standard response format: `{ success: boolean, data: any, error?: string }`
   - Input validation at route level before service processing
   - Authentication check via middleware

2. **Service Layer**
   - `SearchService`: Wraps Google Books API, handles errors gracefully
   - `LibraryService`: Manages UserBook lifecycle (add, update, delete), acts as single source of truth for progress (pagesRead and percentage calculation), handles ratings and reviews (private to user), enforces duplicate prevention
   - `DashboardService`: Aggregates statistics from UserBook records
   - `LoggingService`: Logs state changes, errors, performance timing per FR-017

3. **Data Access (Prisma)**
   - QueryBuilder pattern for complex queries (library filters, sorting)
   - Avoid N+1 queries via `select` and `include` optimizations
   - Transaction handling for multi-step operations (add book + initial status)

4. **Frontend State**
   - React Context or Zustand for global state (current user, search results)
   - Server-side rendering (SSR) for library view (performance)
   - Client-side filtering/sorting for responsiveness

5. **Testing Strategy**
   - Unit tests: Service layer business logic (SearchService, LibraryService calculations)
   - Integration tests: API endpoints (add book, filter, update progress)
   - Skip component tests in v1 (focus on user acceptance testing)

---

**Next Steps**: Proceed to Phase 0 (Research) to clarify unknowns and confirm technical dependencies.
