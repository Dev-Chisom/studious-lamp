// types/pagination.ts
export interface PaginationProps {
  totalItems: number;
  currentPage: number;
  perPage: number;
  maxVisiblePages?: number;
  perPageOptions?: number[];
  showEndButtons?: boolean;
  showPerPage?: boolean;
  showRange?: boolean;
  paginationClass?: string;
  disabled?: boolean;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  visiblePages: (number | string)[];
  startIndex: number;
  endIndex: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  perPage: number;
  perPageOptions: number[];
}

export interface PaginationEmits {
  (e: 'update:currentPage', value: number): void;
  (e: 'update:perPage', value: number): void;
  (e: 'page-change', value: number): void;
  (e: 'per-page-change', value: number): void;
}