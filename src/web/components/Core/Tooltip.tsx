import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';

import './Tooltip.scss';

type TooltipProps = {
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'center' | 'start' | 'end';
};
export function Tooltip({ children, side, align }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger className='tooltip-trigger'>
          <FontAwesomeIcon icon='circle-info' data-testid='tooltip-info-icon' />
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content side={side} align={align} className='tooltip-content'>
          {children}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
