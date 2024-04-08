import { ReactNode } from 'react';

import './TableNoDataPlaceholder.scss';

type TableNoDataPlaceholderProps = {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
};

export function TableNoDataPlaceholder({ icon, title, children }: TableNoDataPlaceholderProps) {
  return (
    <div className='no-table-data-container'>
      {icon}
      <div>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
