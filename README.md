# Booklog: Personal Book Library Tracker

A modern web application for readers to search books, build personal libraries, track reading progress, and discover reading habits through statistics and insights.

**Status**: 🚀 **Phase 1 Setup Complete** | MVP Development in Progress  
**Branch**: `001-book-library` | **Last Updated**: 2026-04-11

---

## 📚 Quick Start

### Prerequisites

- **Node.js**: 18+ (tested with Node.js 20+)
- **PostgreSQL**: 14+ (for database)
- **npm**: 10+ (included with Node.js)

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd mentoria
   ```

2. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies** (if using backend services):
   ```bash
   cd ../backend
   npm install
   ```

4. **Setup environment variables**:
   ```bash
   # In .frontend/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   
   # In backend/.env (if applicable)
   DATABASE_URL=postgresql://user:password@localhost:5432/booklog
   GOOGLE_BOOKS_API_KEY=your_api_key_here
   ```

5. **Setup database**:
   ```bash
   cd backend
   npx prisma migrate deploy
   npx prisma generate
   ```

6. **Start development server**:
   ```bash
   cd frontend
   npm run dev
   ```

   Visit http://localhost:3000

---

## 📁 Project Structure

```
mentoria/
├── frontend/                      # Next.js web application
│   ├── src/
│   │   ├── app/                   # Next.js App Router pages and API routes
│   │   │   ├── api/               # Backend API routes
│   │   │   ├── page.tsx           # Dashboard landing page
│   │   │   ├── search/            # Search page
│   │   │   ├── library/           # Library view page
│   │   │   └── settings/          # Settings page
│   │   ├── components/            # Reusable React components
│   │   ├── services/              # Frontend service layer (API clients)
│   │   ├── stores/                # State management (Zustand/Context)
│   │   └── types/                 # TypeScript type definitions
│   ├── jest.config.ts             # Jest testing configuration
│   ├── next.config.ts             # Next.js configuration
│   └── package.json
│
├── backend/                       # Backend services and database
│   ├── src/
│   │   ├── models/                # TypeScript types and interfaces
│   │   ├── services/              # Business logic (SearchService, LibraryService, etc.)
│   │   ├── middleware/            # Express/Next.js middleware
│   │   └── lib/                   # Utilities (validators, response formatter, logger)
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema (User, Book, UserBook, etc.)
│   │   └── migrations/            # Database migrations
│   ├── tests/                     # Test suite
│   └── package.json
│
├── specs/001-book-library/        # Feature specification and documentation
│   ├── spec.md                    # Feature requirements
│   ├── plan.md                    # Implementation plan
│   ├── data-model.md              # Database schema documentation
│   ├── research.md                # Technical research & decisions
│   ├── quickstart.md              # Developer setup guide
│   ├── tasks.md                   # Implementation tasks (139 tasks, 10 phases)
│   └── contracts/                 # API specifications
│
├── .github/copilot-instructions.md # GitHub Copilot context (auto-updated)
├── .gitignore                     # Git ignore patterns
└── mentoria.sln                   # Solution file
```

---

## 🚀 Development Workflow

### Running the Application

**Development mode**:
```bash
cd frontend
npm run dev
```

**Production build**:
```bash
cd frontend
npm run build
npm run start
```

### Testing

**Run all tests**:
```bash
npm test
```

**Run tests in watch mode**:
```bash
npm test -- --watch
```

**Generate coverage report**:
```bash
npm test -- --coverage
```

### Code Quality

**Run linting**:
```bash
npm run lint
```

**Run type checking**:
```bash
tsc --noEmit
```

**Format code** (Prettier):
```bash
npm run format
```

---

## 📋 Feature Overview

### Completed (Phase 1: Setup)

- ✅ Next.js 16 + TypeScript 5 with strict mode
- ✅ Prisma ORM with PostgreSQL database schema
- ✅ Type-safe request validation (Zod schemas)
- ✅ API response formatting utilities
- ✅ Jest testing configuration
- ✅ Project documentation structure

### In Development (Phases 2-9)

**Phase 2 (Foundational)**:
- Data layer setup (Prisma migrations)
- Authentication middleware
- Google Books API client wrapper
- Logging service infrastructure

**Phase 3-5 (MVP - P1 User Stories)**:
- User Story 1: Search and discover books
- User Story 2: Build personal library
- User Story 3: Organize by reading status

**Phase 6-8 (P2 Features)**:
- User Story 4: Track reading progress
- User Story 5: Rate and review books
- User Story 6: Advanced library filtering

**Phase 9 (P3 Features)**:
- User Story 7: Reading dashboard and statistics

**Phase 10 (Polish)**:
- Testing, performance optimization, deployment

---

## 🏗️ Architecture

### Design Principles (Booklog Constitution)

1. **Layered Architecture**: API routes → Services → Prisma (database)
2. **REST API-First**: All features exposed via REST endpoints
3. **Business Logic in Services**: No logic in controllers or components
4. **Type Safety**: Strict TypeScript + Zod validation
5. **Simplicity First**: Simple solutions, avoid premature optimization

### Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript 5 (strict)
- **Styling**: TailwindCSS 4
- **State Management**: Zustand (store management)
- **Backend**: Next.js API Routes + Node.js services
- **Database**: PostgreSQL 14+, Prisma ORM 5
- **Validation**: Zod
- **Testing**: Jest, React Testing Library
- **External APIs**: Google Books API v1

---

## 🔑 Key Configuration Files

### TypeScript Configuration (`frontend/tsconfig.json`)

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Prisma Schema (`backend/prisma/schema.prisma`)

Core models:
- **User**: Reader account
- **Book**: Book metadata (cached from Google Books API)
- **UserBook**: User's library entry (status, progress, ratings)
- **Rating**: User's book ratings and reviews
- **Tag, Goal**: Optional features for future enhancements

### Environment Variables

**`.frontend/.env.local`**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**`backend/.env`**:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/booklog
GOOGLE_BOOKS_API_KEY=<your_api_key>
LOG_LEVEL=info
```

---

## 📖 Documentation

- **[Specification](specs/001-book-library/spec.md)** - Feature requirements, user stories, acceptance criteria
- **[Implementation Plan](specs/001-book-library/plan.md)** - Technical architecture, constitutional alignment
- **[Data Model](specs/001-book-library/data-model.md)** - Database entities and relationships
- **[Research & Decisions](specs/001-book-library/research.md)** - Technical research findings
- **[Quick Start Guide](specs/001-book-library/quickstart.md)** - Developer setup and architecture overview
- **[API Contracts](specs/001-book-library/contracts/)** - API endpoint specifications

---

## 🧪 Testing

### Test Structure

```
backend/tests/
├── unit/
│   └── services/          # Service layer logic tests
└── integration/
    └── api/               # API endpoint tests

frontend/tests/
├── unit/
│   └── components/        # Component tests
└── integration/
    └── flows/             # User flow tests
```

### Example Test Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test -- services.test.ts

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

---

## 🚢 Deployment

### Prerequisites

- PostgreSQL 14+ database (hosting: Azure, AWS RDS, Supabase, etc.)
- Google Books API key configured
- Node.js 18+ runtime

### Deployment Steps

1. **Build the application**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Set environment variables** on the hosting platform:
   ```
   DATABASE_URL=postgresql://...
   GOOGLE_BOOKS_API_KEY=...
   NODE_ENV=production
   ```

3. **Deploy to Vercel, Heroku, AWS, or similar**:
   ```bash
   # Using Vercel (recommended for Next.js)
   npm install -g vercel
   vercel
   ```

4. **Run database migrations** on production database:
   ```bash
   npx prisma migrate deploy
   ```

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db execute --stdin < /dev/null

# Reset database (development only!)
npx prisma migrate reset --force
```

### Port Already in Use

```bash
# Run on different port
npm run dev -- -p 3001
```

### Missing Environment Variables

Ensure `.env.local` and `backend/.env` are set correctly:
```bash
# Check which variables are expected
cat .env.example
```

---

## 📝 Code Style

### TypeScript

- **Strict Mode**: Always enabled
- **Naming**: camelCase for variables/functions, PascalCase for types/components
- **Explicit Types**: Avoid `any`, use unions and generics
- **Error Handling**: Use typed error classes (ValidationError, NotFoundError, ConflictError)

### React Components

- **Functional Components**: Use React hooks
- **Props Interfaces**: Always type component props
- **State Management**: Zustand for global state, useState for local
- **File Organization**: Group by feature, not type

### SQL/Prisma

- **Schema Updates**: Always use `prisma migrate` for changes
- **Indexes**: Applied for frequently queried fields
- **Relationships**: Explicit `@relation` directives
- **Validation**: Enforce constraints at database level

---

## 📞 Support & Contact

For issues, questions, or feature requests:
- Check the [Specification](specs/001-book-library/spec.md) for requirements clarity
- Review [Implementation Plan](specs/001-book-library/plan.md) for architecture details
- Submit issues to the project repository

---

## 📄 License

This project is part of the Booklog initiative. All rights reserved.

---

**Next Steps**:
1. ✅ Phase 1: Setup (Complete)
2. → Phase 2: Foundational Infrastructure (In Progress)
3. → Phase 3-5: MVP User Stories (Queued)
4. → Phase 6-9: Additional Features (Queued)
5. → Phase 10: Polish & Launch (Queued)

For detailed task breakdown, see [tasks.md](specs/001-book-library/tasks.md) (139 tasks across 10 phases).
