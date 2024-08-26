import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CstgAddDialog from './CstgAddDialog';
import { CstgValueType } from './CstgHelper';

const submitDialogDomains = async () => {
  const submitButton = screen.getByRole('button', { name: 'Add Root-Level Domains' });
  await userEvent.click(submitButton);
};

const submitDialogMobileAppIds = async () => {
  const submitButton = screen.getByRole('button', { name: 'Add Mobile App IDs' });
  await userEvent.click(submitButton);
};

describe('CstgAddDialog', () => {
  it('should be able to click save if user types in correct single domain', async () => {
    const user = userEvent.setup();

    const onAddDomainsMock = jest.fn(() => {
      return Promise.resolve([]);
    });

    render(
      <CstgAddDialog
        onAddCstgValues={onAddDomainsMock}
        onOpenChange={() => {}}
        existingCstgValues={[]}
        cstgValueType={CstgValueType.Domain}
        addInstructions='Add one or more domains.'
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'cstgValues' }), 'test.com');

    expect(screen.getByRole('button', { name: 'Add Root-Level Domains' })).toBeEnabled();

    await submitDialogDomains();

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
      <CstgAddDialog
        onAddCstgValues={onAddDomainsMock}
        onOpenChange={() => {}}
        existingCstgValues={[]}
        cstgValueType={CstgValueType.Domain}
        addInstructions='Add one or more domains.'
      />
    );

    await user.type(
      screen.getByRole('textbox', { name: 'cstgValues' }),
      'test.com, test2.com, test3.com, http://test4.com'
    );

    expect(screen.getByRole('button', { name: 'Add Root-Level Domains' })).toBeEnabled();

    await submitDialogDomains();

    expect(onAddDomainsMock).toHaveBeenCalledWith(
      ['test.com', 'test2.com', 'test3.com', 'test4.com'],
      expect.anything()
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should render error when user types single incorrect domain', async () => {
    const user = userEvent.setup();

    const onAddDomainsMock = jest.fn(() => {
      return Promise.resolve(['newDomains']);
    });

    render(
      <CstgAddDialog
        onAddCstgValues={onAddDomainsMock}
        onOpenChange={() => {}}
        existingCstgValues={[]}
        cstgValueType={CstgValueType.Domain}
        addInstructions='Add one or more domains.'
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'cstgValues' }), 'newDomains');

    await submitDialogDomains();

    expect(
      screen.getByText('The domains entered are invalid root-level domains', { exact: false })
    ).toBeInTheDocument();
  });

  it('should render error if user types in at least one incorrect domain in a list', async () => {
    const user = userEvent.setup();

    const onAddDomainsMock = jest.fn(() => {
      return Promise.resolve(['test1', 'test2']);
    });

    render(
      <CstgAddDialog
        onAddCstgValues={onAddDomainsMock}
        onOpenChange={() => {}}
        existingCstgValues={[]}
        cstgValueType={CstgValueType.Domain}
        addInstructions='Add one or more domains.'
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'cstgValues' }), 'test1, test2');

    await submitDialogDomains();

    expect(
      screen.getByText('The domains entered are invalid root-level domains', { exact: false })
    ).toBeInTheDocument();
  });

  it('should render error if user submits empty text box for domain names', async () => {
    const onAddDomainsMock = jest.fn(() => {
      return Promise.resolve([]);
    });

    render(
      <CstgAddDialog
        onAddCstgValues={onAddDomainsMock}
        onOpenChange={() => {}}
        existingCstgValues={[]}
        cstgValueType={CstgValueType.Domain}
        addInstructions='Add one or more domains.'
      />
    );
    await submitDialogDomains();

    expect(screen.getByText('Please specify root-level domains.')).toBeInTheDocument();
  });

  it('should be able to click save if user types in correct single mobile app ID', async () => {
    const user = userEvent.setup();

    const onAddMobileAppIdsMock = jest.fn(() => {
      return Promise.resolve([]);
    });

    render(
      <CstgAddDialog
        onAddCstgValues={onAddMobileAppIdsMock}
        onOpenChange={() => {}}
        existingCstgValues={[]}
        cstgValueType={CstgValueType.MobileAppId}
        addInstructions='Please register the Android App ID, iOS/tvOS Bundle ID and iOS App Store ID.'
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'cstgValues' }), 'com.test.com');

    expect(screen.getByRole('button', { name: 'Add Mobile App IDs' })).toBeEnabled();

    await submitDialogMobileAppIds();

    await waitFor(() => {
      expect(onAddMobileAppIdsMock).toHaveBeenCalledWith(['com.test.com'], expect.anything());
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should be able to save if user types in multiple correct mobile app IDs as comma separated list', async () => {
    const user = userEvent.setup();

    const onAddMobileAppIdsMock = jest.fn(() => {
      return Promise.resolve([]);
    });

    render(
      <CstgAddDialog
        onAddCstgValues={onAddMobileAppIdsMock}
        onOpenChange={() => {}}
        existingCstgValues={[]}
        cstgValueType={CstgValueType.MobileAppId}
        addInstructions='Please register the Android App ID, iOS/tvOS Bundle ID and iOS App Store ID.'
      />
    );

    await user.type(
      screen.getByRole('textbox', { name: 'cstgValues' }),
      'com.test.com, 123456, test222'
    );

    expect(screen.getByRole('button', { name: 'Add Mobile App IDs' })).toBeEnabled();

    await submitDialogMobileAppIds();

    expect(onAddMobileAppIdsMock).toHaveBeenCalledWith(
      ['com.test.com', '123456', 'test222'],
      expect.anything()
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should render error when user types single incorrect mobile app ID', async () => {
    const user = userEvent.setup();

    const onAddMobileAppIdsMock = jest.fn(() => {
      return Promise.resolve(['com/addtest@']);
    });

    render(
      <CstgAddDialog
        onAddCstgValues={onAddMobileAppIdsMock}
        onOpenChange={() => {}}
        existingCstgValues={[]}
        cstgValueType={CstgValueType.MobileAppId}
        addInstructions='Please register the Android App ID, iOS/tvOS Bundle ID and iOS App Store ID.'
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'cstgValues' }), 'com/addtest@');

    await submitDialogMobileAppIds();

    expect(
      screen.getByText('The mobile app IDs entered are invalid', { exact: false })
    ).toBeInTheDocument();
  });

  it('should render error if user types in at least one incorrect mobile app ID in a list', async () => {
    const user = userEvent.setup();

    const onAddMobileAppIdsMock = jest.fn(() => {
      return Promise.resolve(['com.test.com', '1@2 3 4 ']);
    });

    render(
      <CstgAddDialog
        onAddCstgValues={onAddMobileAppIdsMock}
        onOpenChange={() => {}}
        existingCstgValues={[]}
        cstgValueType={CstgValueType.MobileAppId}
        addInstructions='Please register the Android App ID, iOS/tvOS Bundle ID and iOS App Store ID.'
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'cstgValues' }), 'com.test.com, 1@2 3 4 ');

    await submitDialogMobileAppIds();

    expect(
      screen.getByText('The mobile app IDs entered are invalid', { exact: false })
    ).toBeInTheDocument();
  });

  it('should render error if user submits empty text box for mobile app IDs', async () => {
    const onAddMobileAppIdsMock = jest.fn(() => {
      return Promise.resolve([]);
    });

    render(
      <CstgAddDialog
        onAddCstgValues={onAddMobileAppIdsMock}
        onOpenChange={() => {}}
        existingCstgValues={[]}
        cstgValueType={CstgValueType.MobileAppId}
        addInstructions='Please register the Android App ID, iOS/tvOS Bundle ID and iOS App Store ID.'
      />
    );
    await submitDialogMobileAppIds();

    expect(screen.getByText('Please specify mobile app IDs.')).toBeInTheDocument();
  });
});
