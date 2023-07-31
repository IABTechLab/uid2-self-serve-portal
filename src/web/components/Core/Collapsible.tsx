import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as RadixCollapsible from '@radix-ui/react-collapsible';
import { ReactNode } from 'react';

import './Collapsible.scss';

export type CollapsibleProps = {
  title: string;
  content: ReactNode;
  defaultOpen?: boolean;
  label?: string;
};

export function Collapsible({ title, content, defaultOpen, label }: CollapsibleProps) {
  return (
    <RadixCollapsible.Root className='collapsible-root' defaultOpen={defaultOpen}>
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
        <div className='collapsible-content'>{content}</div>
      </RadixCollapsible.Content>
    </RadixCollapsible.Root>
  );
}
