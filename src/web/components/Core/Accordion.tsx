import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { ReactNode } from 'react';

import './Accordion.scss';

export type AccordionProps = {
  title: string;
  content: ReactNode;
  defaultExpanded: boolean;
  isCollapsible: boolean;
  label: ReactNode;
};

export function Accordion({
  title,
  content,
  defaultExpanded,
  isCollapsible,
  label,
}: AccordionProps) {
  const itemName = 'item-1';
  const defaultValue = defaultExpanded ? itemName : '';

  return (
    <RadixAccordion.Root
      className='accordion-root'
      type='single'
      defaultValue={defaultValue}
      collapsible
    >
      <RadixAccordion.Item className='accordion-item' value={itemName}>
        <div className='accordion-header'>
          <h2>{title}</h2>
          {isCollapsible && (
            <RadixAccordion.AccordionTrigger className='accordion-trigger'>
              <FontAwesomeIcon
                icon='chevron-down'
                data-testid='chevron-icon'
                className='chevron-icon'
              />
            </RadixAccordion.AccordionTrigger>
          )}
          {!isCollapsible && label && <span className='label'>{label}</span>}
        </div>
        <RadixAccordion.Content className='accordion-content'>{content}</RadixAccordion.Content>
      </RadixAccordion.Item>
    </RadixAccordion.Root>
  );
}
