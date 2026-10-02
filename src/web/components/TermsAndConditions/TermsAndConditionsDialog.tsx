import { useContext, useState } from 'react';

import { CurrentUserContext } from '../../contexts/CurrentUserProvider';
import { useKeycloak } from '../../contexts/KeycloakProvider';
import { SetTermsAccepted } from '../../services/userAccount';
import { useIdentityConfig } from '../../utils/identity';
import { Dialog } from '../Core/Dialog/Dialog';
import { TermsAndConditionsForm } from './TermsAndConditions';

import './TermsAndConditionsDialog.scss';

export function TermsAndConditionsDialog() {
  const { isEuid } = useIdentityConfig();
  const { loadUser } = useContext(CurrentUserContext);
  const { keycloak } = useKeycloak();
  const [showMustAccept, setShowMustAccept] = useState(false);

  if (isEuid) return null;

  const handleAccept = async () => {
    await SetTermsAccepted();
    // Force token refresh after role updated
    await keycloak.updateToken(10000);
    await loadUser();
  };
  const handleCancel = () => {
    setShowMustAccept(true);
  };

  return (
    <Dialog className='terms-conditions-dialog'>
      <TermsAndConditionsForm onAccept={handleAccept} onCancel={handleCancel}>
        {showMustAccept && (
          <div className='accept-error'>
            Please review the Terms and Conditions document. When you’ve scrolled to the bottom,
            click <b>Accept Terms and Conditions</b>.
          </div>
        )}
      </TermsAndConditionsForm>
    </Dialog>
  );
}
