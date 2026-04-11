// Shared TypeScript types for Booklog - Personal Book Library Tracker
// Used by both frontend and backend

// ============================================================================
// Entity Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  coverImageUrl: string | null;
  pageCount: number | null;
  description: string | null;
  googleBooksId?: string;
  googleRating?: number | null;
  googleRatingCount?: number | null;
  language?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserBook {
  id: string;
  userId: string;
  bookId: string;
  status: BookStatus;
  pagesRead: number | null;
  rating: number | null; // 1-5 or null
  reviewText: string | null;
  dateAdded: Date;
  dateStarted: Date | null;
  dateCompleted: Date | null;
  lastModified: Date;
}

// ============================================================================
// Enums
// ============================================================================

export enum BookStatus {
  WANT_TO_READ = "WANT_TO_READ",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface SearchQuery {
  q: string; // search term
  type?: "title" | "author" | "isbn"; // optional search type
  limit?: number; // default 20
}

export interface SearchResult {
  id: string; // googleBooksId
  title: string;
  author: string;
  coverImageUrl?: string;
  description?: string;
  pageCount?: number;
  rating?: number;
  ratingCount?: number;
}

export interface AddBookRequest {
  googleBooksId: string;
  status: BookStatus;
  isbn?: string;
}

export interface UpdateBookRequest {
  status?: BookStatus;
  pagesRead?: number;
  rating?: number;
  reviewText?: string;
}

export interface LibraryFilters {
  status?: BookStatus | BookStatus[];
  search?: string;
  sort?: "dateAdded" | "dateCompleted" | "title" | "author" | "rating";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface DashboardStatistics {
  totalBooks: number;
  inProgressCount: number;
  completedCount: number;
  completedThisMonth: number;
  completedThisYear: number;
  averageRating: number | null;
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: "added" | "started" | "completed" | "rated";
  bookId: string;
  bookTitle: string;
  timestamp: Date;
}

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ============================================================================
// Service Response Types
// ============================================================================

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code: string = "VALIDATION_ERROR"
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(
    message: string,
    public code: string = "NOT_FOUND"
  ) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  constructor(
    message: string,
    public code: string = "CONFLICT"
  ) {
    super(message);
    this.name = "ConflictError";
  }
}
