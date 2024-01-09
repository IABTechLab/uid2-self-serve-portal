import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as RadixDialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { ReactNode } from 'react';

import './Dialog.scss';

export type DialogProps = {
  triggerButton?: JSX.Element;
  children: ReactNode;
  title?: string;
  closeButton?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  fullScreen?: boolean;
  className?: string;
  hideCloseContainerButton?: boolean;
};
export function Dialog({
  triggerButton,
  children,
  title,
  closeButton,
  open,
  onOpenChange,
  fullScreen,
  className,
  hideCloseContainerButton = false,
}: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {triggerButton && <RadixDialog.Trigger asChild>{triggerButton}</RadixDialog.Trigger>}
      <RadixDialog.Overlay className='dialog-overlay' />
      <RadixDialog.Content
        className='dialog-container'
        // To prevent dialog closed from user clicking outside of the dialog
        onInteractOutside={(fireEvent) => fireEvent.preventDefault()}
      >
        <div className={clsx({ fullScreen }, 'dialog-content', className)}>
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
          {!hideCloseContainerButton && (
            <div className='dialog-close-container'>
              <RadixDialog.Close asChild>
                <button className='dialog-close-icon icon-button' aria-label='Close' type='button'>
                  <FontAwesomeIcon icon='xmark' />
                </button>
              </RadixDialog.Close>
            </div>
          )}
        </div>
      </RadixDialog.Content>
    </RadixDialog.Root>
  );
}
