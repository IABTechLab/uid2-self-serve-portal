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
  return numberTotalRows > rowsPerPageValues[0]
    ? rowsPerPageValues
        .filter((value) => value <= numberTotalRows)
        .map((value) => ({
          name: value.toString(),
          id: value,
        }))
    : [{ name: rowsPerPageValues[0].toString(), id: rowsPerPageValues[0] }];
};

export const getShowingRowsText = (
  pageNumber: number,
  rowsPerPage: RowsPerPageValues,
  numberTotalRows: number
) => {
  const firstRow = numberTotalRows > 0 ? (pageNumber - 1) * rowsPerPage + 1 : 0;
  const lastRow = (pageNumber - 1) * rowsPerPage + rowsPerPage;
  return `Showing ${firstRow} -
        ${lastRow <= numberTotalRows ? lastRow : numberTotalRows}
        of ${numberTotalRows}`;
};
