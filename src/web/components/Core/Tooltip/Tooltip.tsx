import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import clsx from 'clsx';
import { ReactNode } from 'react';

import './Tooltip.scss';

type TooltipProps = Readonly<{
  className?: string;
  children: ReactNode;
  trigger?: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'center' | 'start' | 'end';
  delayDuration?: number;
}>;
export function Tooltip({
  className,
  children,
  trigger,
  side,
  align,
  delayDuration,
}: TooltipProps) {
  const DEFAULT_DELAY_DURATION = 300;

  return (
    <div className={clsx('tooltip', className)}>
      <TooltipPrimitive.Provider delayDuration={delayDuration ?? DEFAULT_DELAY_DURATION}>
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger className='tooltip-trigger' type='button'>
            {trigger ?? (
              <FontAwesomeIcon
                icon='circle-info'
                data-testid='tooltip-info-icon'
                className='default-trigger'
              />
            )}
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Content side={side} align={align} className='tooltip-content'>
            {children}
            <TooltipPrimitive.Arrow className='tooltip-arrow' />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    </div>
  );
}
