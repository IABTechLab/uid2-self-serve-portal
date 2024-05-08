import {
  getPageNumberOptions,
  getRowsPerPageOptions,
  getShowingRowsText,
} from './PagingToolHelper';

describe('test paging tool helper functions', () => {
  describe('check that correct rows per page options are returned', () => {
    it('should return at least one rows per page option', () => {
      expect(getRowsPerPageOptions(3)).toEqual([{ name: '10', id: 10 }]);
      expect(getRowsPerPageOptions(1)).toEqual([{ name: '10', id: 10 }]);
      expect(getRowsPerPageOptions(10)).toEqual([{ name: '10', id: 10 }]);
    });
    it('should return all rows per page options', () => {
      expect(getRowsPerPageOptions(250)).toEqual([
        { name: '10', id: 10 },
        { name: '25', id: 25 },
        { name: '50', id: 50 },
        { name: '100', id: 100 },
        { name: '250', id: 250 },
      ]);
      expect(getRowsPerPageOptions(125)).toEqual([
        { name: '10', id: 10 },
        { name: '25', id: 25 },
        { name: '50', id: 50 },
        { name: '100', id: 100 },
        { name: '250', id: 250 },
      ]);
      expect(getRowsPerPageOptions(500)).toEqual([
        { name: '10', id: 10 },
        { name: '25', id: 25 },
        { name: '50', id: 50 },
        { name: '100', id: 100 },
        { name: '250', id: 250 },
      ]);
    });
  });

  describe('check that correct page numbers are returned', () => {
    it('should return one page number option', () => {
      expect(getPageNumberOptions(3, 10)).toEqual([{ name: '1', id: 1 }]);
      expect(getPageNumberOptions(10, 10)).toEqual([{ name: '1', id: 1 }]);
      expect(getPageNumberOptions(250, 250)).toEqual([{ name: '1', id: 1 }]);
    });
    it('should return multiple page number options', () => {
      expect(getPageNumberOptions(50, 10)).toEqual([
        { name: '1', id: 1 },
        { name: '2', id: 2 },
        { name: '3', id: 3 },
        { name: '4', id: 4 },
        { name: '5', id: 5 },
      ]);
      expect(getPageNumberOptions(45, 10)).toEqual([
        { name: '1', id: 1 },
        { name: '2', id: 2 },
        { name: '3', id: 3 },
        { name: '4', id: 4 },
        { name: '5', id: 5 },
      ]);
      expect(getPageNumberOptions(495, 10)).toEqual([
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
      ]);
    });
  });

  describe('check that the correct showing rows text is displayed', () => {
    it('should return singular showing rows text', () => {
      expect(getShowingRowsText(1, 10, 1)).toEqual(`Showing 1 - 1 of 1`);
    });
    it('should return an exact amount showing rows text', () => {
      expect(getShowingRowsText(1, 25, 25)).toEqual('Showing 1 - 25 of 25');
      expect(getShowingRowsText(1, 250, 250)).toEqual('Showing 1 - 250 of 250');
    });
    it('should return showing rows text with number of total rows less than lastRow variable', () => {
      expect(getShowingRowsText(1, 50, 35)).toEqual('Showing 1 - 35 of 35');
      expect(getShowingRowsText(1, 250, 123)).toEqual('Showing 1 - 123 of 123');
    });
    it('should return correct portion of rows not first or last', () => {
      expect(getShowingRowsText(2, 10, 50)).toEqual('Showing 11 - 20 of 50');
      expect(getShowingRowsText(3, 50, 253)).toEqual('Showing 101 - 150 of 253');
      expect(getShowingRowsText(10, 250, 3000)).toEqual('Showing 2251 - 2500 of 3000');
    });
  });
});
