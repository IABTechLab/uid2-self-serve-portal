import { SelectOption } from '../Dropdown/SelectDropdown';
import {
  getPageNumberOptions,
  getRowsPerPageOptions,
  getShowingRowsText,
  RowsPerPageValues,
} from './PagingToolHelper';

const rowsPerPageOptions: SelectOption<number>[] = [
  { name: '10', id: 10 },
  { name: '25', id: 25 },
  { name: '50', id: 50 },
  { name: '100', id: 100 },
  { name: '250', id: 250 },
];

const manyPageNumberOptions: SelectOption<number>[] = [
  { name: '1', id: 1 },
  { name: '2', id: 2 },
  { name: '3', id: 3 },
  { name: '4', id: 4 },
  { name: '5', id: 5 },
  { name: '6', id: 6 },
  { name: '7', id: 7 },
  { name: '8', id: 8 },
  { name: '9', id: 9 },
  { name: '10', id: 10 },
  { name: '11', id: 11 },
  { name: '12', id: 12 },
  { name: '13', id: 13 },
  { name: '14', id: 14 },
  { name: '15', id: 15 },
  { name: '16', id: 16 },
  { name: '17', id: 17 },
  { name: '18', id: 18 },
  { name: '19', id: 19 },
  { name: '20', id: 20 },
  { name: '21', id: 21 },
  { name: '22', id: 22 },
  { name: '23', id: 23 },
  { name: '24', id: 24 },
  { name: '25', id: 25 },
  { name: '26', id: 26 },
  { name: '27', id: 27 },
  { name: '28', id: 28 },
  { name: '29', id: 29 },
  { name: '30', id: 30 },
  { name: '31', id: 31 },
  { name: '32', id: 32 },
  { name: '33', id: 33 },
  { name: '34', id: 34 },
  { name: '35', id: 35 },
  { name: '36', id: 36 },
  { name: '37', id: 37 },
  { name: '38', id: 38 },
  { name: '39', id: 39 },
  { name: '40', id: 40 },
  { name: '41', id: 41 },
  { name: '42', id: 42 },
  { name: '43', id: 43 },
  { name: '44', id: 44 },
  { name: '45', id: 45 },
  { name: '46', id: 46 },
  { name: '47', id: 47 },
  { name: '48', id: 48 },
  { name: '49', id: 49 },
  { name: '50', id: 50 },
];

describe('test paging tool helper functions', () => {
  describe('check that correct rows per page options are returned', () => {
    const totalRowsSmallNumbers = [3, 1, 10];
    it.each(totalRowsSmallNumbers)('should return at least one rows per page option', (t) => {
      expect(getRowsPerPageOptions(t)).toEqual([rowsPerPageOptions[0]]);
    });

    const totalRowsLargeNumbers = [125, 250, 500, 1000, 3000];
    it.each(totalRowsLargeNumbers)('should return all rows per page options', (t) => {
      expect(getRowsPerPageOptions(t)).toEqual(rowsPerPageOptions);
    });
  });

  describe('check that correct page numbers are returned', () => {
    it('should return one page number option when page number = rows per page or when total rows < 10', () => {
      const onePageNumberOption = [{ name: '1', id: 1 }];
      const numberTotalRows = [3, 10, 25, 50, 100, 250];
      const rowsPerPage: RowsPerPageValues[] = [10, 10, 25, 50, 100, 250];
      numberTotalRows.forEach((_, index) => {
        expect(getPageNumberOptions(numberTotalRows[index], rowsPerPage[index])).toEqual(
          onePageNumberOption
        );
      });
    });

    it('should return multiple page number options when pageNumber * rowsPerPage = one of the rows per page options', () => {
      const numberTotalRows = 50;
      const rowsPerPage: RowsPerPageValues = 10;
      expect(getPageNumberOptions(numberTotalRows, rowsPerPage)).toEqual(
        manyPageNumberOptions.filter((_, index) => index < numberTotalRows / rowsPerPage)
      );
    });

    it('should return multiple page number options when pageNumber * rowsPerPage != one of the rows per page options', () => {
      const numberTotalRows = 45;
      const rowsPerPage: RowsPerPageValues = 10;
      expect(getPageNumberOptions(numberTotalRows, rowsPerPage)).toEqual(
        manyPageNumberOptions.filter((_, index) => index < Math.ceil(numberTotalRows / rowsPerPage))
      );
      const largeNumberTotalRows = 495;
      expect(getPageNumberOptions(largeNumberTotalRows, rowsPerPage)).toEqual(
        manyPageNumberOptions
      );
    });
  });

  describe('check that the correct showing rows text is displayed', () => {
    it('should return singular showing rows text when total rows < 10', () => {
      const pageNumber = 1;
      const rowsPerPage = 10;
      const numberTotalRows = 1;
      expect(getShowingRowsText(pageNumber, rowsPerPage, numberTotalRows)).toEqual(
        `Showing 1 - 1 of 1`
      );
    });

    it('should return an exact amount showing rows text', () => {
      const pageNumbers = [1, 1, 1, 1, 1];
      const rowsPerPages: RowsPerPageValues[] = [10, 25, 50, 100, 250];
      const numberTotalRows = [10, 25, 50, 100, 250];
      pageNumbers.forEach((_, index) => {
        expect(
          getShowingRowsText(pageNumbers[index], rowsPerPages[index], numberTotalRows[index])
        ).toEqual(
          `Showing ${pageNumbers[index]} - ${rowsPerPages[index]} of ${numberTotalRows[index]}`
        );
      });
    });

    it('should return showing rows text with number of total rows less than lastRow variable', () => {
      const pageNumbers = [1, 1];
      const rowsPerPages: RowsPerPageValues[] = [50, 250];
      const numberTotalRows = [35, 123];
      pageNumbers.forEach((_, index) => {
        expect(
          getShowingRowsText(pageNumbers[index], rowsPerPages[index], numberTotalRows[index])
        ).toEqual(
          `Showing ${pageNumbers[index]} - ${numberTotalRows[index]} of ${numberTotalRows[index]}`
        );
      });
    });

    it('should return correct portion of rows not on first or last page', () => {
      const pageNumbers = [2, 3, 10];
      const rowsPerPages: RowsPerPageValues[] = [10, 50, 250];
      const numberTotalRows = [50, 253, 3000];
      pageNumbers.forEach((_, index) => {
        expect(
          getShowingRowsText(pageNumbers[index], rowsPerPages[index], numberTotalRows[index])
        ).toEqual(
          `Showing ${(pageNumbers[index] - 1) * rowsPerPages[index] + 1} - ${
            (pageNumbers[index] - 1) * rowsPerPages[index] + rowsPerPages[index]
          } of ${numberTotalRows[index]}`
        );
      });
    });
  });
});
