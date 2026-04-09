/**
 * Booklog Shared Types
 *
 * Type definitions shared between frontend and backend
 * These types are used throughout the application for strict TypeScript typing
 * and ensure consistency across the stack (Constitution: Type Safety & Validation)
 *
 * Import from shared/types in both backend and frontend:
 * - Backend: import { Book, UserBook } from '../../../shared/types'
 * - Frontend: import { Book, UserBook } from '@/shared/types' (with tsconfig path alias)
 */

// ============================================================================
// Core Enums & Union Types
// ============================================================================

/**
 * BookStatus: User's reading status for books in their library
 * Aligns with Prisma Status enum
 */
export enum BookStatus {
  WANT_TO_READ = 'WANT_TO_READ',     // User wants to read this book
  IN_PROGRESS = 'IN_PROGRESS',       // Currently reading
  COMPLETED = 'COMPLETED',           // Finished reading
}

/**
 * StarRating: Valid star rating values (1-5)
 * Backend validation enforces this constraint
 */
export type StarRating = 1 | 2 | 3 | 4 | 5;

/**
 * API Activity Types: Types of actions that appear in user activity feeds
 */
export enum ActivityType {
  BOOK_ADDED = 'BOOK_ADDED',
  BOOK_COMPLETED = 'BOOK_COMPLETED',
  BOOK_RATED = 'BOOK_RATED',
}

// ============================================================================
// Core Entity Types
// ============================================================================

/**
 * Book: Shared book catalog entity
 * Represents a book available in the system (accessible by all users)
 * Can be added from Google Books API, OpenLibrary, or manual entry
 */
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;                                    // International Standard Book Number
  coverImageUrl?: string;                           // URL to book cover image
  synopsis?: string;                                // Book description/summary
  totalPages?: number;                              // Total number of pages in book
  googleId?: string;                                // Google Books ID (legacy support)
  externalId?: string;                              // External API identifier
  externalSource?: 'openlibrary' | 'google_books' | 'manual'; // Source of book metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User: Authenticated user entity
 * Represents registered users in the system
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
  image?: string;                                   // User avatar URL
  createdAt: Date;
  updatedAt: Date;
}

/**
 * UserBook: User's personal library entry with reading progress
 * Join table representing a user's copy of a book
 * Includes progress tracking (pages read, completion status)
 */
export interface UserBook {
  id: string;
  userId: string;
  bookId: string;
  book?: Book;                                      // Optional book relation (populated by API)
  status: BookStatus;                               // TO_READ, READING, or READ
  pagesRead?: number;                               // Pages user has read
  completedAt?: Date;                               // When user finished reading
  addedAt: Date;                                    // When book was added to library
  startDate?: Date;                                 // When user started reading
  endDate?: Date;                                   // When user finished (same as completedAt)
  comment?: string;                                 // User's personal notes
  createdAt: Date;
  updatedAt: Date;
}

/**
 * UserBookWithCalculated: UserBook with computed fields
 * Used in API responses to include calculated percentageRead
 * Note: percentageRead is NOT persisted in database, calculated on-the-fly
 */
export interface UserBookWithCalculated extends UserBook {
  percentageRead?: number;                          // Calculated: (pagesRead / totalPages) * 100
  book: Book;                                       // Book relation should be populated
  rating?: Rating;                                  // Optional user's rating for this book
}

/**
 * Rating: User's rating and written review for a book
 * Separate from library tracking (can rate without adding to library)
 * One rating per user per book (unique constraint at database level)
 */
export interface Rating {
  id: string;
  userId: string;
  bookId: string;
  user?: User;                                      // Optional user relation
  book?: Book;                                      // Optional book relation
  stars: StarRating;                                // 1, 2, 3, 4, or 5 stars
  review?: string;                                  // Optional written review (max 5000 chars)
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Generic API Response wrapper
 * All API endpoints return this standardized format
 * Follows Constitution: REST API-First Design
 *
 * @template T The type of data returned on success
 */
export interface ApiResponse<T = unknown> {
  success: boolean;                                 // Whether request succeeded
  data: T | null;                                   // Response data (null if failed)
  error: string | null;                             // Error message (null if succeeded)
}

/**
 * Paginated Response: Used for list endpoints
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// ============================================================================
// Search & Discovery
// ============================================================================

/**
 * BookSearchResult: Book with additional metadata for search results
 * Extends Book with user-specific and aggregated data
 */
export interface BookSearchResult extends Book {
  inUserLibrary?: boolean;                          // Whether user has this book in library
  userBookStatus?: BookStatus;                      // User's reading status if in library
  averageRating?: number;                           // Average rating across all users
  totalRatings?: number;                            // Number of ratings
}

/**
 * BookRatingStats: Aggregated rating information for a book
 * Used in book detail pages to show community ratings
 */
export interface BookRatingStats {
  averageRating: number;                            // Average rating (0-5)
  totalRatings: number;                             // Number of users who rated
  userRating?: Rating;                              // Current user's rating (if authenticated)
}

// ============================================================================
// Dashboard & Statistics
// ============================================================================

/**
 * UserStatistics: Aggregated user reading statistics
 * Calculated from UserBook and Rating entities (not persisted)
 * Used for dashboard display and user insights
 */
export interface UserStatistics {
  totalBooksAdded: number;                          // Total books in user's library
  booksCompleted: number;                           // Books with status = READ
  booksInProgress: number;                          // Books with status = READING
  averageRating: number;                            // Average of user's ratings
  totalPagesRead: number;                           // Sum of pages for completed books
  readings: {
    thisMonth: number;                              // Books completed this month
    lastMonth: number;                              // Books completed last month
    allTime: number;                                // Total books ever completed
  };
  recentActivity: Activity[];                       // Last 10 user actions
}

/**
 * Activity: User action event for activity feeds
 * Represents actions like adding a book, completing reading, or rating
 */
export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;                               // BOOK_ADDED, BOOK_COMPLETED, BOOK_RATED
  book: Book;                                       // Book involved in activity
  rating?: number;                                  // For BOOK_RATED activities
  timestamp: Date;
}

// ============================================================================
// Request/Input Types
// ============================================================================

/**
 * BookCreateInput: Data required to create or update a book
 */
export interface BookCreateInput {
  title: string;
  author: string;
  isbn?: string;
  coverImageUrl?: string;
  synopsis?: string;
  totalPages?: number;
  externalId?: string;
  externalSource?: 'openlibrary' | 'google_books' | 'manual';
}

/**
 * UserBookUpdateInput: Data to update book progress
 */
export interface UserBookUpdateInput {
  status?: BookStatus;
  pagesRead?: number;
}

/**
 * RatingInput: Data to create or update a rating
 */
export interface RatingInput {
  stars: StarRating;
  review?: string;
}

// ============================================================================
// Filter & Query Types
// ============================================================================

/**
 * UserBookFilters: Options for filtering user's library
 */
export interface UserBookFilters {
  status?: BookStatus;
}

/**
 * PaginationOptions: Pagination parameters
 */
export interface PaginationOptions {
  limit?: number;                                   // Items per page (default: 20)
  offset?: number;                                  // Items to skip (default: 0)
}

// ============================================================================
// Runtime Constants
// ============================================================================

/**
 * Valid star values for runtime validation
 */
export const VALID_STAR_RATINGS = [1, 2, 3, 4, 5] as const;

/**
 * Book status options
 */
export const BOOK_STATUS_OPTIONS = Object.values(BookStatus) as BookStatus[];
