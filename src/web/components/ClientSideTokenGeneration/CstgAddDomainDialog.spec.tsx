import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CstgAddDomainDialog from './CstgAddDomainDialog';

const submitDialog = async () => {
  const createButton = screen.getByRole('button', { name: 'Add Domains' });
  await userEvent.click(createButton);
};

describe('CstgDomainAddDomainDialog', () => {
  it('should be able to click save if user types in correct single domain', async () => {
    const user = userEvent.setup();

    const onAddDomainsMock = jest.fn(() => {
      return Promise.resolve([]);
    });

    render(
      <CstgAddDomainDialog
        onAddDomains={onAddDomainsMock}
        onOpenChange={() => {}}
        existingDomains={[]}
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'newDomains' }), 'test.com');

    expect(screen.getByRole('button', { name: 'Add Domains' })).toBeEnabled();

    await submitDialog();

    await waitFor(() => {
      expect(onAddDomainsMock).toHaveBeenCalledWith(['test.com'], expect.anything());
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should be able to save if user types in multiple correct domains as comma separated list', async () => {
    const user = userEvent.setup();

    const onAddDomainsMock = jest.fn(() => {
      return Promise.resolve([]);
    });

    render(
      <CstgAddDomainDialog
        onAddDomains={onAddDomainsMock}
        onOpenChange={() => {}}
        existingDomains={[]}
      />
    );

    await user.type(
      screen.getByRole('textbox', { name: 'newDomains' }),
      'test.com, test2.com, test3.com, http://test4.com'
    );

    expect(screen.getByRole('button', { name: 'Add Domains' })).toBeEnabled();

    await submitDialog();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should render error when user types single incorrect domain', async () => {
    const onAddDomainsMock = jest.fn(() => {
      return Promise.resolve(['newDomains']);
    });

    render(
      <CstgAddDomainDialog
        onAddDomains={onAddDomainsMock}
        onOpenChange={() => {}}
        existingDomains={[]}
      />
    );

    await submitDialog();

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render error if user types in at least one incorrect domain in a list', async () => {
    const onAddDomainsMock = jest.fn(() => {
      return Promise.resolve(['test', 'test2']);
    });

    render(
      <CstgAddDomainDialog
        onAddDomains={onAddDomainsMock}
        onOpenChange={() => {}}
        existingDomains={[]}
      />
    );

    await submitDialog();

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render error if user submits empty text box for domain names', async () => {
    const onAddDomainsMock = jest.fn(() => {
      return Promise.resolve([]);
    });

    render(
      <CstgAddDomainDialog
        onAddDomains={onAddDomainsMock}
        onOpenChange={() => {}}
        existingDomains={[]}
      />
    );
    await submitDialog();

    expect(screen.getByText('Please specify domains.')).toBeInTheDocument();
  });
});
