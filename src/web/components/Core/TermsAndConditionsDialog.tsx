import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useState } from 'react';

import { Dialog } from './Dialog';

import './TermsAndConditionsDialog.scss';

type TermsAndConditionsDialogProps = {
  termsAndConditions: JSX.Element;
  triggerButton: JSX.Element;
};

export type AcceptTermForm = {
  acceptConditions: boolean;
};

export function TermsAndConditionsDialog({
  termsAndConditions,
  triggerButton,
}: TermsAndConditionsDialogProps) {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <Dialog
      triggerButton={triggerButton}
      title='Accept Terms & Conditions'
      closeButton='Cancel'
      open={open}
      onOpenChange={setOpen}
    >
      <div className='termsContainer'>{termsAndConditions}</div>
      <div className='checkbox-option'>
        <Checkbox.Root
          id='acceptTerms'
          className='checkbox-root'
          onCheckedChange={(checked: boolean) => {
            console.log('1111', checked);
            setAcceptTerms(checked);
          }}
        >
          <Checkbox.Indicator className='checkbox-indicator'>
            <FontAwesomeIcon icon='check' />
          </Checkbox.Indicator>
        </Checkbox.Root>
        <label className='option-label' htmlFor='acceptTerms'>
          I agree to the Terms & Conditions above.
        </label>
      </div>

      <div className='form-footer'>
        <button type='submit' disabled={acceptTerms} className='primary-button'>
          Accept Terms & Conditions
        </button>
      </div>
    </Dialog>
  );
}
