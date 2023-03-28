import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as RadixDialog from '@radix-ui/react-dialog';
import { ReactNode } from 'react';

import './Dialog.scss';

export type DialogProps = {
  triggerButton: string;
  title: string;
  closeButton: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};
function Dialog({ triggerButton, title, closeButton, children, open, onOpenChange }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Trigger asChild>
        <button className='Button violet' type='button'>
          {triggerButton}
        </button>
      </RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className='dialog-overlay' />
        <RadixDialog.Content className='app dialog-content'>
          <RadixDialog.Title>{title}</RadixDialog.Title>
          {children}
          <div style={{ display: 'flex', marginTop: 25, justifyContent: 'center' }}>
            <RadixDialog.Close asChild>
              <button className='transparent-button' type='button'>
                {closeButton}
              </button>
            </RadixDialog.Close>
          </div>
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

export default Dialog;
