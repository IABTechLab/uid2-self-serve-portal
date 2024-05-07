import type { Meta } from '@storybook/react';
import { useEffect, useState } from 'react';

import { PagingTool } from './PagingTool';

import '../ClientSideTokenGeneration/CstgDomainsTable.scss';

const meta: Meta<typeof PagingTool> = {
  component: PagingTool,
  title: 'Shared Components/Paging Tool',
};
export default meta;

const totalDomains = [
  'test.com',
  'test2.com',
  'test3.com',
  'test4.com',
  'test5.com',
  'test6.com',
  'test7.com',
  'test8.com',
  'test9.com',
  'test10.com',
  'test11.com',
  'test12.com',
  'test13.com',
  'test14.com',
  'test15.com',
  'test16.com',
  'test17.com',
  'test18.com',
  'test19.com',
  'test20.com',
  'test21.com',
  'test22.com',
  'test23.com',
  'test25.com',
  'test26.com',
  'test27.com',
  'test28.com',
  'test29.com',
];

export const Default = () => {
  const [pagedDomains, setPagedDomains] = useState<string[]>(totalDomains);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const onChangeDisplayedRows = (currentPageNumber: number, currentRowsPerPage: number) => {
    setPageNumber(currentPageNumber);
    setRowsPerPage(currentRowsPerPage);
  };

  useEffect(() => {
    setPagedDomains(
      totalDomains.filter(
        (_, index) =>
          index >= (pageNumber - 1) * rowsPerPage &&
          index < (pageNumber - 1) * rowsPerPage + rowsPerPage
      )
    );
  }, [pageNumber, rowsPerPage]);

  return (
    <div>
      {pagedDomains.map((domain) => (
        <div>
          {' '}
          {domain}
          <br />
        </div>
      ))}

      <PagingTool
        numberTotalRows={totalDomains.length}
        initialRowsPerPage={10}
        onChangeRows={onChangeDisplayedRows}
      />
    </div>
  );
};
