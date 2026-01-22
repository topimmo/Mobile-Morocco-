import { useState, useCallback, useMemo } from 'react';
import {
  PaginationParams,
  DEFAULT_PAGE_SIZE,
  normalizePaginationParams,
  calculateTotalPages,
  generatePageNumbers,
} from '@/lib/pagination';

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalCount?: number;
}

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageNumbers: (number | 'ellipsis')[];
  offset: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  updateTotalCount: (count: number) => void;
  paginationParams: PaginationParams;
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const {
    initialPage = 1,
    initialPageSize = DEFAULT_PAGE_SIZE,
    totalCount: initialTotalCount = 0,
  } = options;

  const [state, setState] = useState({
    page: initialPage,
    pageSize: initialPageSize,
    totalCount: initialTotalCount,
  });

  const totalPages = useMemo(
    () => calculateTotalPages(state.totalCount, state.pageSize),
    [state.totalCount, state.pageSize]
  );

  const hasNextPage = state.page < totalPages;
  const hasPreviousPage = state.page > 1;
  const offset = (state.page - 1) * state.pageSize;

  const pageNumbers = useMemo(
    () => generatePageNumbers(state.page, totalPages),
    [state.page, totalPages]
  );

  const setPage = useCallback((newPage: number) => {
    setState((prev) => ({
      ...prev,
      page: Math.max(1, Math.min(newPage, calculateTotalPages(prev.totalCount, prev.pageSize))),
    }));
  }, []);

  const setPageSize = useCallback((newPageSize: number) => {
    setState((prev) => {
      const normalized = normalizePaginationParams({ page: 1, pageSize: newPageSize });
      return {
        ...prev,
        page: 1, // Reset to first page when changing page size
        pageSize: normalized.pageSize,
      };
    });
  }, []);

  const nextPage = useCallback(() => {
    setState((prev) => {
      const maxPage = calculateTotalPages(prev.totalCount, prev.pageSize);
      return {
        ...prev,
        page: Math.min(prev.page + 1, maxPage),
      };
    });
  }, []);

  const previousPage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 1),
    }));
  }, []);

  const goToFirstPage = useCallback(() => {
    setState((prev) => ({ ...prev, page: 1 }));
  }, []);

  const goToLastPage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      page: calculateTotalPages(prev.totalCount, prev.pageSize),
    }));
  }, []);

  const updateTotalCount = useCallback((count: number) => {
    setState((prev) => {
      const newTotalPages = calculateTotalPages(count, prev.pageSize);
      return {
        ...prev,
        totalCount: count,
        // Adjust page if it exceeds new total pages
        page: Math.min(prev.page, Math.max(1, newTotalPages)),
      };
    });
  }, []);

  const paginationParams: PaginationParams = useMemo(
    () => ({ page: state.page, pageSize: state.pageSize }),
    [state.page, state.pageSize]
  );

  return {
    page: state.page,
    pageSize: state.pageSize,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    pageNumbers,
    offset,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    updateTotalCount,
    paginationParams,
  };
}

export default usePagination;
