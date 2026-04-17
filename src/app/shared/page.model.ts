export interface Pageable {
  page: number;
  size: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}
