import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Dialog } from '../components/Core/Dialog';
import { CheckboxInput } from '../components/Input/CheckboxInput';
import { UpdateParticipantForm } from '../services/participant';

function TermsAndConditionsDialog() {
  const { watch } = useFormContext<UpdateParticipantForm>();
  const watchAcceptConditions = watch('acceptConditions');

  const [open, setOpen] = useState(false);
  return (
    <Dialog
      triggerButton={
        <button className='small-button primary-button' type='button'>
          Save & Continue
        </button>
      }
      title='Accept Terms & Conditions'
      closeButton='Cancel'
      open={open}
      onOpenChange={setOpen}
    >
      <div className='termsContainer'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem
        ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem
        ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmodLorem ipsum dolor sit amet,
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
        aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
        ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
        in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet,
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
        aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
        ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
        in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet,
        consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur
        adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
        officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur
        adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
        officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur
        adipiscing elit, sed do eiusmod
      </div>
      <CheckboxInput
        inputName='acceptCondition'
        rules={{ validate: (value) => value || 'Please accept the terms & conditions.' }}
        options={[
          {
            optionLabel: 'I agree to the Terms & Conditions above.',
            value: true,
          },
        ]}
      />
      <div className='form-footer'>
        <button type='submit' disabled={watchAcceptConditions} className='primary-button'>
          Accept Terms & Conditions
        </button>
      </div>
    </Dialog>
  );
}

export default TermsAndConditionsDialog;
