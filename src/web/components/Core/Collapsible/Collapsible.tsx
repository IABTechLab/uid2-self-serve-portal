import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as RadixCollapsible from '@radix-ui/react-collapsible';
import clsx from 'clsx';
import { ReactNode } from 'react';

import './Collapsible.scss';

export type CollapsibleProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  label?: string;
  className?: string;
};

export function Collapsible({ title, children, defaultOpen, label, className }: CollapsibleProps) {
  return (
    <RadixCollapsible.Root
      className={clsx('collapsible-root', className)}
      defaultOpen={defaultOpen}
    >
      <RadixCollapsible.Trigger className='collapsible-trigger'>
        <div className='collapsible-header'>
          <h2>{title}</h2>
          <div className='collapsible-header-label-and-icon'>
            {label && <span className='label'>{label}</span>}
            <FontAwesomeIcon
              icon='chevron-down'
              data-testid='chevron-icon'
              className='chevron-icon'
            />
          </div>
        </div>
      </RadixCollapsible.Trigger>
      <RadixCollapsible.Content>
        <div className='collapsible-content'>{children}</div>
      </RadixCollapsible.Content>
    </RadixCollapsible.Root>
  );
}
