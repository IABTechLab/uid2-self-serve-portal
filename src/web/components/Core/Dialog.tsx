import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as RadixDialog from '@radix-ui/react-dialog';
import { ReactNode } from 'react';

import './Dialog.scss';

export type DialogProps = {
  triggerButton: string;
  children: ReactNode;
  title?: string;
  closeButton?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};
export function Dialog({
  triggerButton,
  children,
  title,
  closeButton,
  open,
  onOpenChange,
}: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Trigger asChild>
        <button className='small-button' type='button'>
          {triggerButton}
        </button>
      </RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className='dialog-overlay' />
        <RadixDialog.Content className='app dialog-content'>
          {title && <RadixDialog.Title>{title}</RadixDialog.Title>}
          {children}
          {closeButton && (
            <div className='dialog-close-button'>
              <RadixDialog.Close asChild>
                <button className='transparent-button' type='button'>
                  {closeButton}
                </button>
              </RadixDialog.Close>
            </div>
          )}
          <RadixDialog.Close asChild>
            <button className='icon-button' aria-label='Close' type='button'>
              <FontAwesomeIcon icon='xmark' />
            </button>
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
