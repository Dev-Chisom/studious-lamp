export interface PaginationProps {
  currentPage: number;
  totalItems: number;
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