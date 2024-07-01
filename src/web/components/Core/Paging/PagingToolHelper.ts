import { SelectOption } from '../Dropdown/SelectDropdown';

const rowsPerPageValues = [10, 25, 50, 100, 250] as const;

export type RowsPerPageValues = (typeof rowsPerPageValues)[number];

export const getPageNumberOptions = (
  numberTotalRows: number,
  rowsPerPage: RowsPerPageValues
): SelectOption<number>[] => {
  const maxPageNumber = Math.ceil(numberTotalRows / rowsPerPage);
  const newOptions: SelectOption<number>[] = Array.from(
    { length: maxPageNumber },
    (_, index) => index + 1
  ).map((number) => ({
    name: number.toString(),
    id: number,
  }));
  return newOptions;
};

export const getRowsPerPageOptions = (
  numberTotalRows: number
): SelectOption<RowsPerPageValues>[] => {
  const rowsPerPageOptions: RowsPerPageValues[] = [];
  let i = 0;
  while (i < rowsPerPageValues.length) {
    rowsPerPageOptions.push(rowsPerPageValues[i]);
    if (numberTotalRows <= rowsPerPageValues[i]) break;
    i += 1;
  }
  const newRowsPerPageOptions: SelectOption<RowsPerPageValues>[] = rowsPerPageOptions.map(
    (value) => ({
      name: value.toString(),
      id: value,
    })
  );
  return newRowsPerPageOptions;
};

export const getShowingRowsText = (
  pageNumber: number,
  rowsPerPage: RowsPerPageValues,
  numberTotalRows: number
) => {
  const firstRow = numberTotalRows > 0 ? (pageNumber - 1) * rowsPerPage + 1 : 0;
  const lastRow = (pageNumber - 1) * rowsPerPage + rowsPerPage;
  return `Showing ${firstRow} - ${
    lastRow <= numberTotalRows ? lastRow : numberTotalRows
  } of ${numberTotalRows}`;
};

export const canIncreasePageNumber = (
  pageNumber: number,
  numberTotalRows: number,
  rowsPerPage: RowsPerPageValues
) => {
  return pageNumber < Math.ceil(numberTotalRows / rowsPerPage);
};

export const canDecreasePageNumber = (pageNumber: number) => {
  return pageNumber > 1;
};
