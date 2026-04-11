# Research: Personal Book Library Tracker

**Feature**: 001-book-library  
**Date**: 2026-04-11  
**Status**: Phase 0 Complete (All clarifications resolved during spec session)

## Overview

This document summarizes the technical research and decisions made for the Personal Book Library Tracker feature. All key unknowns have been resolved through the specification clarification process.

## Key Research Findings

### 1. External Book Data Provider ✅

**Question**: Which book API to use?

**Decision**: **Google Books API**
- Provides comprehensive book coverage with metadata (title, author, ISBN, page count, description, cover images)
- Includes user ratings from Google Play Books ecosystem
- Supports title, author, and ISBN search queries
- Standard REST API with rate limiting (per quota purchased)
- No special setup required beyond API key configuration

**Rationale**: 
- Better coverage than OpenLibrary for popular books
- Ratings support helps users evaluate books
- Stable API with good documentation
- Aligns with MVP scope

**Integration Approach**:
- Wrap Google Books API calls in `SearchService`
- Cache API responses in database (Book table) after first search for performance
- Handle API failures gracefully with user-friendly error messages
- Respect API rate limits with exponential backoff retry logic

**Implementation Notes**:
- API key managed via environment variable
- Implement timeout (5-10 seconds) for search requests
- Log API calls (count, latency) for monitoring

---

### 2. Data Model Structure ✅

**Question**: How to handle pages_read and completion percentage data?

**Decision**: **Single Source of Truth - Pages Read in UserBook**
- UserBook stores `pages_read` (numeric, nullable for "Completed" books)
- Completion percentage calculated on-the-fly: `(pages_read / Book.pageCount) × 100`
- No redundant storage in separate ReadingProgress table
- Eliminates data sync issues and keeps model simple

**Schema Implications**:
```
UserBook {
  id, userId, bookId, status, pagesRead, rating, reviewText, dateAdded, dateCompleted, lastModified
}

(Percentage calculated in service layer, not stored)
```

**Rationale**: 
- Avoids denormalization problems
- Simpler queries for filtering/sorting
- Consistent with simplicity principle

---

### 3. Progress Tracking Flexibility ✅

**Question**: What if page count is missing?

**Decision**: **Flexible Progress Tracking**
- If page count from Google Books API: Show "X of Y pages" format with percentage
- If page count missing: Allow users to input completion percentage directly (0-100%)
- Both modes handled in ProgressService with conditional logic
- Frontend adapts UI based on available information

**Implementation**: 
- ProgressService.calculateProgress() method handles both cases
- FrontendProgressTracker component conditionally shows pages or percentage
- Validation: Prevent percentage >100% or negative values

**Rationale**: 
- Maximizes compatibility with books lacking metadata
- User experience remains smooth regardless of data quality
- Service layer abstracts complexity from API/UI layers

---

### 4. Logging & Observability ✅

**Question**: What logging level for the application?

**Decision**: **Standard Logging (Option B)**
- Log all state changes: status updates, rating/review creation, library additions, completions
- Log all errors and failures (API errors, validation failures, database errors)
- Log user action timing (for performance monitoring): search duration, filter time, dashboard load time
- Use structured logging format for easy parsing

**Implementation**:
- LoggingService utility handles all logging
- Winston or Pino logger configured for production
- Log levels: ERROR (failures), INFO (state changes), DEBUG (timing data)
- Log destination: Console (dev), Files/Cloud (production)

**Rationale**:
- Enables troubleshooting when users report issues
- Provides usage metrics for dashboard updates latency
- Supports performance optimization in future versions
- No analytics tracking in v1 (deferred to v2)

---

### 5. Data Privacy & Visibility ✅

**Question**: Are ratings/reviews public or private?

**Decision**: **Private to User (Option A)**
- Ratings and reviews visible only to the user who created them
- No public library profiles or discovery features in v1
- Social features (see friends' ratings, recommendations) deferred to v2
- Database enforces privacy via query filters (always join on user_id)

**Implementation**:
- API returns ratings only for authenticated user
- RatingService.getRatings(userId) always filters by user_id
- Cannot see other users' ratings even with direct ID lookup
- Frontend components assume private data

**Rationale**:
- Keeps v1 focused on core tracking functionality
- Reduces security/privacy review scope
- Simpler codebase without visibility rules
- Foundation for social features in future versions

---

### 6. Performance & Scalability ✅

**Question**: What are the performance targets and scaling assumptions?

**Targets** (from spec):
- Search results returned in <2 seconds
- Library filtering/sorting <2 seconds
- Dashboard statistics update within 2 seconds
- API response time <500ms for most operations
- Support 10,000 concurrent users

**Scalability Assumptions**:
- Individual users with libraries up to 10,000 books
- Google Books API handles large user load with rate limiting
- PostgreSQL connection pooling via Prisma (default 5 connections)
- No caching layer in v1 (simple approach)
- No API pagination needed for <10k books per user

**Future Optimization** (out of scope for v1):
- Redis caching for popular book searches
- Elasticsearch for full-text search in personal library
- Background jobs for batch statistics calculation

---

### 7. Technology Choices ✅

**Confirmed Stack**:
- **Language**: TypeScript 5.x (strict mode)
- **Frontend**: Next.js 14+ (App Router), React 18+, TailwindCSS
- **Backend**: Next.js API Routes (Route Handlers)
- **Database**: PostgreSQL 14+ with Prisma ORM 5.x
- **External API**: Google Books API
- **Testing**: Jest for backend services and integration tests
- **Validation**: Zod for schema validation
- **Logging**: Winston or Pino

**Rationale**: 
- All choices align with Booklog Constitution (Type Safety, Simplicity, REST API-First)
- TypeScript strict mode mandatory per constitution
- Existing project uses Next.js/PostgreSQL/Prisma
- Zod validates inputs per FR-014
- Jest standard for Next.js projects

---

## Unknowns Resolved

| Unknown | Resolution | Spec Impact |
|---------|-----------|------------|
| Which book API? | Google Books API | Assumption updated |
| Pages read redundancy? | Single source in UserBook | Entity definitions clarified |
| Missing page counts? | Flexible percentage input | Progress tracking method defined |
| Logging strategy? | Standard logging (FR-017) | New requirement added |
| Rating visibility? | Private to user (FR-011a) | Privacy requirement added |

---

## Next Steps

**Phase 1**: Generate data models, API contracts, and quickstart guide.

All research items are resolved and require no additional investigation before proceeding to design phase.
