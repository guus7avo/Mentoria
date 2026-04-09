# Shared Types & Constants

This directory contains type definitions and constants shared between the frontend and backend applications.

## Structure

```
shared/
└── types/
    └── index.ts       # All shared TypeScript type definitions
```

## Importing Shared Types

### Backend (Node.js / Express / Next.js API Routes)

```typescript
// From backend service/controller
import { Book, UserBook, Rating, ApiResponse } from '../../../shared/types'

// Or with path aliases in tsconfig (recommended)
import { Book, UserBook, Rating, ApiResponse } from '@shared/types'
```

**tsconfig.json setup for backend:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["../shared/*"]
    }
  }
}
```

### Frontend (React / Next.js Browser)

```typescript
// From frontend component/hook
import { Book, UserBook, Rating, ApiResponse } from '@/shared/types'

// Or with explicit path
import { Book, UserBook, Rating, ApiResponse } from '../../shared/types'
```

**tsconfig.json setup for frontend (Next.js):**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@shared/*": ["../shared/*"]
    }
  }
}
```

## Type Categories

### Core Entities
- **Book**: Shared book catalog (id, title, author, isbn, etc.)
- **User**: Authenticated users
- **UserBook**: User's library entry with reading progress
- **Rating**: User ratings and reviews

### Enums & Union Types
- **BookStatus**: `TO_READ | READING | READ`
- **StarRating**: `1 | 2 | 3 | 4 | 5`
- **ActivityType**: `BOOK_ADDED | BOOK_COMPLETED | BOOK_RATED`

### API Types
- **ApiResponse<T>**: Standardized API response wrapper
- **PaginatedResponse<T>**: Paginated list responses

### Special Fields
- **percentageRead**: Calculated field (not persisted in database)
  - Formula: `(pagesRead / totalPages) * 100`
  - Computed by backend in API responses
  - Used by frontend for display

### Request Types
- **BookCreateInput**: Create/update book data
- **UserBookUpdateInput**: Update reading progress
- **RatingInput**: Create/update rating

### Filter & Query Types
- **UserBookFilters**: Filter options for library queries
- **PaginationOptions**: Pagination parameters

## Constitution Alignment

These shared types enforce **Type Safety & Validation** (Constitution Principle IV):

✅ **Strict TypeScript typing** across all layers  
✅ **Shared types** reused between frontend and backend  
✅ **Centralized definitions** prevent duplication  
✅ **Validation happens on backend** (frontend types for UI feedback only)  

## Usage Examples

### Service Layer (Backend)

```typescript
import { Book, UserBook, ApiResponse } from '@shared/types'

class BookService {
  async searchBooks(query: string): Promise<Book[]> {
    const books = await this.repository.search(query)
    return books
  }
}
```

### API Controller (Backend)

```typescript
import { ApiResponse, Book } from '@shared/types'

async function searchBooksHandler(req, res) {
  const result: ApiResponse<Book[]> = {
    success: true,
    data: books,
    error: null
  }
  res.json(result)
}
```

### React Hook (Frontend)

```typescript
import { useQuery } from '@tanstack/react-query'
import { Book, ApiResponse } from '@shared/types'

export function useBooks(query: string) {
  return useQuery({
    queryKey: ['books', query],
    queryFn: async () => {
      const res = await fetch(`/api/books/search?q=${query}`)
      const data: ApiResponse<Book[]> = await res.json()
      return data.data || []
    }
  })
}
```

### React Component (Frontend)

```typescript
import { UserBook, UserBookWithCalculated } from '@shared/types'

interface BookCardProps {
  book: UserBookWithCalculated
  onRate: (rating: number) => void
}

export function BookCard({ book }: BookCardProps) {
  return (
    <div>
      <h3>{book.book.title}</h3>
      <p>Progress: {book.percentageRead}%</p>
    </div>
  )
}
```

## Important Notes

### Calculated Fields

Some fields (like `percentageRead`) are **NOT persisted** in the database:

```typescript
// Calculated field - computed on-the-fly by backend
interface UserBook {
  pagesRead?: number           // Stored in DB
  percentageRead?: number      // NOT in DB - calculated: (pagesRead / totalPages) * 100
  totalPages?: number          // From Book relation
}
```

When the backend fetches a UserBook, it should calculate `percentageRead` in the response:

```typescript
const userBook = await db.userBook.findUnique(...)
const book = await db.book.findUnique(...)
const percentageRead = book.totalPages 
  ? (userBook.pagesRead / book.totalPages) * 100 
  : undefined

return {
  ...userBook,
  percentageRead,
  book
}
```

### Star Rating Validation

The `StarRating` type ensures only valid values (1-5):

```typescript
// ✅ Valid
const rating: StarRating = 5

// ❌ TypeScript error
const badRating: StarRating = 6

// Backend validation
if (!VALID_STAR_RATINGS.includes(stars)) {
  throw new BadRequestError('Stars must be 1-5')
}
```

## Updating Shared Types

When adding new types:

1. Add to `shared/types/index.ts`
2. Re-export if needed for convenience
3. Update documentation above
4. Commit with message: `chore: update shared types`

**Do NOT** create duplicate type definitions in backend or frontend - always import from shared.
