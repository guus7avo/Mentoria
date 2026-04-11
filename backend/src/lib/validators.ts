import { z } from "zod";
import { BookStatus } from "../models/types";

// ============================================================================
// Search Validators
// ============================================================================

export const SearchQuerySchema = z.object({
  q: z
    .string()
    .min(1, "Search query is required")
    .max(200, "Search query too long"),
  type: z.enum(["title", "author", "isbn"]).optional(),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),
});

export type SearchQueryType = z.infer<typeof SearchQuerySchema>;

// ============================================================================
// Library Management Validators
// ============================================================================

export const AddBookSchema = z.object({
  googleBooksId: z
    .string()
    .min(1, "Google Books ID is required"),
  status: z.nativeEnum(BookStatus).default(BookStatus.WANT_TO_READ),
  isbn: z.string().optional(),
});

export type AddBookType = z.infer<typeof AddBookSchema>;

export const UpdateBookSchema = z.object({
  status: z.nativeEnum(BookStatus).optional(),
  pagesRead: z
    .number()
    .int()
    .nonnegative("Pages read must be non-negative")
    .optional(),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5")
    .nullable()
    .optional(),
  reviewText: z
    .string()
    .max(5000, "Review text too long")
    .nullable()
    .optional(),
});

export type UpdateBookType = z.infer<typeof UpdateBookSchema>;

// ============================================================================
// Library Filter Validators
// ============================================================================

export const LibraryFiltersSchema = z.object({
  status: z.union([
    z.nativeEnum(BookStatus),
    z.array(z.nativeEnum(BookStatus)),
  ]).optional(),
  search: z.string().max(200).optional(),
  sort: z
    .enum(["dateAdded", "dateCompleted", "title", "author", "rating"])
    .default("dateAdded"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z
    .number()
    .int()
    .positive("Page must be positive")
    .default(1),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),
});

export type LibraryFiltersType = z.infer<typeof LibraryFiltersSchema>;
