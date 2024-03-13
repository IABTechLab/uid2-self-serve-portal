import { composeStories } from '@storybook/testing-react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './CstgDomainInputRow.stories';

const { Default } = composeStories(stories);

const validationInlineBanner = async (messageTestId: string) => {
  expect(await screen.findByTestId(messageTestId)).toBeInTheDocument();
  expect(await screen.findByTestId('domain-input-save-btn')).toBeDisabled();
};

const validateRecommendDomain = async (recommendDomain: string) => {
  const user = userEvent.setup();
  await validationInlineBanner('domain-input-recommended-message');
  expect(await screen.findByTestId('banner-message')).toHaveTextContent(recommendDomain);

  await user.click(screen.getByTestId('domain-input-recommended-domain'));
  expect(screen.queryByTestId('banner-message')).not.toBeInTheDocument();
};

describe('CstgDomainInputRow', () => {
  it('should be able to click save if user type in correct domain', async () => {
    const user = userEvent.setup();
    render(<Default />);

    await user.type(screen.getByTestId('domain-input-field'), 'test.com');

    expect(screen.getByTestId('domain-input-save-btn')).toBeEnabled();
    expect(screen.queryByTestId('banner-message')).not.toBeInTheDocument();
  });

  it('renders recommended domain when user type in url', async () => {
    const user = userEvent.setup();
    render(<Default />);

    await user.type(screen.getByTestId('domain-input-field'), 'https://test.com/docs/');
    await validateRecommendDomain('test.com');
  });

  it('renders recommended domain when user type in subdomain', async () => {
    const user = userEvent.setup();
    render(<Default />);

    await user.type(screen.getByTestId('domain-input-field'), 'https://abc.test.com/docs/');
    await validateRecommendDomain('test.com');
  });

  it('renders error when user type in invalid format', async () => {
    const user = userEvent.setup();
    render(<Default />);

    await user.type(screen.getByTestId('domain-input-field'), 'https://abctest');
    await validationInlineBanner('domain-input-error-message');
  });

  it('renders error when user type in invalid suffix', async () => {
    const user = userEvent.setup();
    render(<Default />);

    await user.type(screen.getByTestId('domain-input-field'), 'https://abctest.bbbbb');

    await validationInlineBanner('domain-input-error-message');
  });
});
