import type { Meta } from '@storybook/react';
import { useState } from 'react';

import { getPagedValues } from '../../ClientSideTokenGeneration/CstgHelper';
import { PagingTool } from './PagingTool';
import { RowsPerPageValues } from './PagingToolHelper';

import '../../ClientSideTokenGeneration/CstgTable.scss';

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
  const [pagedDomains, setPagedDomains] = useState<string[]>(getPagedValues(totalDomains, 1, 10));

  const onChangeDisplayedRows = (
    currentPageNumber: number,
    currentRowsPerPage: RowsPerPageValues
  ) => {
    setPagedDomains(getPagedValues(totalDomains, currentPageNumber, currentRowsPerPage));
  };

  return (
    <div>
      {pagedDomains.map((domain) => (
        <div key={domain}>
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
