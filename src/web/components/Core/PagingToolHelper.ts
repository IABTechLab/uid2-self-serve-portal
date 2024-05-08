const rowsPerPageValues = [10, 25, 50, 100, 250] as const;

export type RowsPerPageValues = (typeof rowsPerPageValues)[number];

export const getPageNumberOptions = (numberTotalRows: number, rowsPerPage: RowsPerPageValues) => {
  return Array.from(
    { length: Math.ceil(numberTotalRows / rowsPerPage) },
    (_, index) => index + 1
  ).map((number) => ({
    name: number.toString(),
    id: number,
  }));
};

export const getRowsPerPageOptions = (numberTotalRows: number) => {
  const rowsPerPageOptions: RowsPerPageValues[] = [];
  let i = 0;
  while (i < rowsPerPageValues.length) {
    rowsPerPageOptions.push(rowsPerPageValues[i]);
    if (numberTotalRows <= rowsPerPageValues[i]) break;
    i += 1;
  }
  return rowsPerPageOptions.map((value) => ({
    name: value.toString(),
    id: value,
  }));
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
