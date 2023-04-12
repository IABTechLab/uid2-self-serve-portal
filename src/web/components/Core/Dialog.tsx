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
      <RadixDialog.Overlay className='dialog-overlay' />
      <RadixDialog.Content
        className='dialog-container'
        // To prevent dialog closed from user clicking outside of the dialog
        onInteractOutside={(fireEvent) => fireEvent.preventDefault()} // eslint-disable-line @typescript-eslint/no-unsafe-call
      >
        <div className='dialog-content'>
          {title && <RadixDialog.Title className='dialog-title'>{title}</RadixDialog.Title>}
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
          <div className='dialog-close-container'>
            <RadixDialog.Close asChild>
              <button className='dialog-close-icon icon-button' aria-label='Close' type='button'>
                <FontAwesomeIcon icon='xmark' />
              </button>
            </RadixDialog.Close>
          </div>
        </div>
      </RadixDialog.Content>
    </RadixDialog.Root>
  );
}
