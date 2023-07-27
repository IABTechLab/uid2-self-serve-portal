import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as RadixCollapsible from '@radix-ui/react-collapsible';
import { ReactNode } from 'react';

import './Collapsible.scss';

export type CollapsibleProps = {
  title: string;
  content: ReactNode;
  defaultOpen: boolean;
};

export function Collapsible({ title, content, defaultOpen }: CollapsibleProps) {
  return (
    <RadixCollapsible.Root className='collapsible-root' defaultOpen={defaultOpen}>
      <div className='collapsible-header'>
        <h2>{title}</h2>
        <RadixCollapsible.Trigger className='collapsible-trigger'>
          <FontAwesomeIcon
            icon='chevron-down'
            data-testid='chevron-icon'
            className='chevron-icon'
          />
        </RadixCollapsible.Trigger>
      </div>
      <RadixCollapsible.Content>
        <div className='collapsible-content'>{content}</div>
      </RadixCollapsible.Content>
    </RadixCollapsible.Root>
  );
}
