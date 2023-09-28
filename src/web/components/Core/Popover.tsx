import * as RadixPopover from '@radix-ui/react-popover';
import clsx from 'clsx';
import { ReactNode } from 'react';

import './Popover.scss';

export type PopoverProps = {
  triggerButton?: JSX.Element;
  children: ReactNode;
  // closeButton?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  className?: string;
};

export default function Popover({
  triggerButton,
  children,
  // closeButton,
  open,
  onOpenChange,
  modal,
  className,
}: PopoverProps) {
  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange} modal={modal}>
      {triggerButton && <RadixPopover.Trigger asChild>{triggerButton}</RadixPopover.Trigger>}
      <RadixPopover.Content className='popover-container'>
        <div className={clsx('popover-content', className)}>{children}</div>
      </RadixPopover.Content>
    </RadixPopover.Root>
  );
}
