export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export enum ColumnType {
  DATE = 'DATE',
  TEXT = 'TEXT',
  NUMBER = 'NUMBER'
}

export class SortingSettings {
  column: string[];
  columnType: ColumnType;
  alternativeValue: any;
  direction: SortDirection;

  constructor(
    column = ['changedAt'],
    columnType = ColumnType.DATE,
    alternativeValue = undefined,
    direction = SortDirection.DESC
  ) {
    this.column = column;
    this.columnType = columnType;
    this.alternativeValue = getAlternativeValue(columnType, direction);
    this.direction = direction;
  }
}

function getAlternativeValue(columnType: ColumnType, sortDirection: SortDirection): any {
  switch (columnType) {
    case ColumnType.TEXT:
      return sortDirection === SortDirection.ASC ? '' : '~'; // First and last ascii sign
    case ColumnType.DATE:
      return sortDirection === SortDirection.DESC ? new Date() : 0;
    case ColumnType.NUMBER:
      return sortDirection === SortDirection.ASC ? -1000000 : 1000000;
  }
}
