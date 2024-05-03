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

  const onChangeDisplayedRows = (displayedDomains: string[]) => {
    setPagedDomains(displayedDomains);
  };

  useEffect(() => {
    setPagedDomains(totalDomains.filter((_, index) => index >= 1 && index < 1 + 10));
  }, []);

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
        rowsPerPageTitle='Domains Per Page'
        totalRows={totalDomains}
        initialRowsPerPage={10}
        onChangeRows={onChangeDisplayedRows}
      />
    </div>
  );
};
