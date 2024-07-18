import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as RadixDialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { ReactNode } from 'react';

import './Dialog.scss';

export type DialogProps = Readonly<{
  children: ReactNode;
  title?: string;
  closeButtonText?: string;
  onOpenChange?: (open: boolean) => void;
  fullScreen?: boolean;
  className?: string;
  hideCloseButtons?: boolean;
  hideActionCloseButtonOnly?: boolean;
}>;
export function Dialog({
  children,
  title,
  closeButtonText,
  onOpenChange,
  fullScreen,
  className,
  hideCloseButtons = false,
  hideActionCloseButtonOnly = false,
}: DialogProps) {
  return (
    <RadixDialog.Root open onOpenChange={onOpenChange}>
      <RadixDialog.Overlay className='dialog-overlay' />
      <RadixDialog.Content
        className='dialog-container'
        // To prevent dialog closed from user clicking outside of the dialog
        onInteractOutside={(fireEvent) => fireEvent.preventDefault()}
      >
        <div className={clsx({ fullScreen }, 'dialog-content', className)}>
          {title && <RadixDialog.Title className='dialog-title'>{title}</RadixDialog.Title>}
          {children}
          {!hideCloseButtons && (
            <>
              {!hideActionCloseButtonOnly && closeButtonText && (
                <div className='dialog-close-button'>
                  <RadixDialog.Close asChild>
                    <button
                      className='dialog-cancel-button'
                      type='button'
                      aria-label='Close Button'
                    >
                      {closeButtonText}
                    </button>
                  </RadixDialog.Close>
                </div>
              )}

              <div className='dialog-close-container'>
                <RadixDialog.Close asChild>
                  <button
                    className='dialog-close-icon icon-button'
                    aria-label='Close Icon'
                    type='button'
                  >
                    <FontAwesomeIcon icon='xmark' />
                  </button>
                </RadixDialog.Close>
              </div>
            </>
          )}
        </div>
      </RadixDialog.Content>
    </RadixDialog.Root>
  );
}
