export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export class SortingParams {
  column: string;
  direction: SortDirection;
  comparativeValue: Date | number;

  constructor(column = 'changedAt', direction = SortDirection.DESC) {
    this.column = column;
    this.direction = direction;
    this.comparativeValue = (direction === SortDirection.DESC) ? new Date() : 0;
  }
}

export class FilterParams {
  column: string;
  value: any;

  constructor(column = 'tags', value = undefined) {
    this.column = column;
    this.value = value;
  }
}

export class PaginationParams {
  pageSize: number;

  constructor(pageSize = 9) {
    this.pageSize = pageSize;
  }
}

export class ListParams {
  sorting: SortingParams;
  filters: FilterParams;
  pagination: PaginationParams;

  constructor(
    sorting = new SortingParams(),
    filters = new FilterParams(),
    pagination = new PaginationParams()
  ) {
    this.sorting = sorting;
    this.filters = filters;
    this.pagination = pagination;
  }
}
