import { render } from '@testing-library/react';

import { IdentityConfigProvider, RawIdentityConfig } from '../../utils/identity';
import { TermsAndConditionsDialog } from './TermsAndConditionsDialog';

jest.mock('../../contexts/KeycloakProvider', () => ({
  useKeycloak: () => ({ keycloak: { updateToken: jest.fn() } }),
}));

jest.mock('../../contexts/CurrentUserProvider', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, global-require
  const React = require('react') as typeof import('react');
  return {
    CurrentUserContext: React.createContext({ loadUser: jest.fn() }),
  };
});

jest.mock('../../services/userAccount', () => ({
  SetTermsAccepted: jest.fn(),
}));

jest.mock('./TermsAndConditions', () => ({
  TermsAndConditionsForm: () => <div data-testid='tc-form'>terms-form</div>,
}));

const rawConfig = (identity: 'UID2' | 'EUID'): RawIdentityConfig => ({
  identity,
  productName: identity,
  docsBaseUrl: '',
  logo: { light: '', dark: '' },
});

const renderInIdentity = (identity: 'UID2' | 'EUID') =>
  render(
    <IdentityConfigProvider value={rawConfig(identity)}>
      <TermsAndConditionsDialog />
    </IdentityConfigProvider>
  );

describe('TermsAndConditionsDialog', () => {
  it('renders nothing on EUID', () => {
    const { container } = renderInIdentity('EUID');
    expect(container).toBeEmptyDOMElement();
  });

  it('renders content on UID2', () => {
    const { container } = renderInIdentity('UID2');
    expect(container).not.toBeEmptyDOMElement();
  });
});
