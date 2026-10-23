/**
 * Pagination utilities for stable performance under <10,000 listings
 */

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Default pagination settings optimized for stability
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;

/**
 * Calculate pagination offset from page number
 */
export function calculateOffset(page: number, pageSize: number): number {
  return Math.max(0, (page - 1) * pageSize);
}

/**
 * Calculate total pages from count and page size
 */
export function calculateTotalPages(totalCount: number, pageSize: number): number {
  return Math.ceil(totalCount / pageSize);
}

/**
 * Create pagination result object
 */
export function createPaginatedResult<T>(
  data: T[],
  totalCount: number,
  page: number,
  pageSize: number
): PaginatedResult<T> {
  const totalPages = calculateTotalPages(totalCount, pageSize);
  
  return {
    data,
    pagination: {
      currentPage: page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Validate and normalize pagination params
 */
export function normalizePaginationParams(params: Partial<PaginationParams>): PaginationParams {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, params.pageSize || DEFAULT_PAGE_SIZE));
  
  return { page, pageSize };
}

/**
 * Generate page numbers array for pagination UI
 * Shows at most 7 page numbers with ellipsis
 */
export function generatePageNumbers(
  currentPage: number,
  totalPages: number
): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  
  // Always show first page
  pages.push(1);
  
  if (currentPage > 3) {
    pages.push('ellipsis');
  }
  
  // Show pages around current
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  if (currentPage < totalPages - 2) {
    pages.push('ellipsis');
  }
  
  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  
  return pages;
}
