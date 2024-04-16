import { composeStories } from '@storybook/testing-react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './CstgAddDomainDialog.stories';

const { Default } = composeStories(stories);

// const validationInlineBanner = async (messageTestId: string) => {
//   expect(await screen.findByTestId(messageTestId)).toBeInTheDocument();
//   expect(await screen.findByTestId('domain-input-save-btn')).toBeDisabled();
// };

// const validateRecommendDomain = async (recommendDomain: string) => {
//   const user = userEvent.setup();
//   await validationInlineBanner('domain-input-recommended-message');
//   expect(await screen.findByTestId('banner-message')).toHaveTextContent(recommendDomain);

//   await user.click(screen.getByTestId('domain-input-recommended-domain'));
//   expect(screen.queryByTestId('banner-message')).not.toBeInTheDocument();
// };

const openDialog = async () => {
  const openButton = screen.getByRole('button', { name: 'Open' });
  await userEvent.click(openButton);
};

const submitDialog = async () => {
  const createButton = screen.getByRole('button', { name: 'Add domains' });
  await userEvent.click(createButton);
};

describe('CstgDomainAddDomainDialog', () => {
  it('should be able to click save if user types in correct single domain', async () => {
    const user = userEvent.setup();
    render(<Default />);

    await openDialog();

    await user.type(screen.getByRole('textbox', { name: 'newDomainNames' }), 'test.com');

    // const onSubmitMock = jest.fn(() => {
    //   return Promise.resolve({
    //     newDomainNames: screen.getByRole('textbox', { name: 'newDomainNames' }),
    //   });
    // });

    expect(screen.getByRole('button', { name: 'Add domains' })).toBeEnabled();

    await submitDialog();

    // await waitFor(() => {
    //   expect(onSubmitMock).toHaveBeenCalledWith({ newDomainNames: 'test.com' });
    // });

    // expect(screen.queryByTestId('banner-message')).not.toBeInTheDocument();
  });

  it('should be able to save if user types in multiple correct domains as comma separated list', async () => {
    const user = userEvent.setup();
    render(<Default />);

    await openDialog();

    await user.type(
      screen.getByRole('textbox', { name: 'newDomainNames' }),
      'test.com, test2.com, test3.com,test4.com'
    );

    // const onSubmitMock = jest.fn(() => {
    //   return Promise.resolve({
    //     newDomainNames: 'test.com',
    //   });
    // });

    expect(screen.getByRole('button', { name: 'Add domains' })).toBeEnabled();

    await submitDialog();
  });

  it('should render error when user types single incorrect domain', async () => {
    const user = userEvent.setup();
    render(<Default />);

    await openDialog();

    await user.type(screen.getByRole('textbox', { name: 'newDomainNames' }), 'test');

    await submitDialog();

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render error if user types in at least one incorrect domain in a list', async () => {
    const user = userEvent.setup();
    render(<Default />);

    await openDialog();

    await user.type(screen.getByRole('textbox', { name: 'newDomainNames' }), 'test, test2.com');

    await submitDialog();

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it.only('should change domain if valid but not top level domain', async () => {
    const user = userEvent.setup();
    render(<Default />);

    await openDialog();

    await user.type(screen.getByRole('textbox', { name: 'newDomainNames' }), 'http://test.com');

    const onSubmitMock = jest.fn(() => {
      return Promise.resolve({
        newDomainNames: 'test.com',
      });
    });

    await submitDialog();

    // await waitFor(() => {
    //   expect(onSubmitMock).toHaveBeenCalledWith({ newDomainNames: 'test.com' });
    // });
  });
  it('should change domains if some are valid but not top level domain', async () => {
    const user = userEvent.setup();
    render(<Default />);

    await openDialog();

    await user.type(
      screen.getByRole('textbox', { name: 'newDomainNames' }),
      'test.com, http://test2.com'
    );

    const onSubmitMock = jest.fn(() => {
      return Promise.resolve({
        newDomainNames: 'test.com',
      });
    });

    await submitDialog();

    // await waitFor(() => {
    //   expect(onSubmitMock).toHaveBeenCalledWith({ newDomainNames: 'test.com' });
    // });
  });
  it.only('should render error if user submits empty text box for domain names', async () => {
    render(<Default />);

    await openDialog();
    await submitDialog();

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
