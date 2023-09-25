import { composeStories } from '@storybook/testing-react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './CstgDomainInputRow.stories';

const { Default } = composeStories(stories);

const validationInlineBanner = async (bannerMessage: string) => {
  expect(await screen.findByTestId('banner-message')).toHaveTextContent(bannerMessage);
  expect(await screen.findByTestId('domain-input-save-btn')).toBeDisabled();
};

const validateRecommendDomain = async (recommendDomain: string) => {
  await validationInlineBanner(recommendDomain);

  await userEvent.click(screen.getByTestId('domain-input-recommended-domain'));
  expect(screen.queryByTestId('banner-message')).not.toBeInTheDocument();
};

describe('CstgDomainInputRow', () => {
  it('should be able to click save if user type in correct domain', async () => {
    render(<Default />);

    await userEvent.type(screen.getByTestId('domain-input-field'), 'test.com');

    expect(screen.getByTestId('domain-input-save-btn')).toBeEnabled();
    expect(screen.queryByTestId('banner-message')).not.toBeInTheDocument();
  });

  it('renders recommended domain when user type in url', async () => {
    render(<Default />);

    await userEvent.type(screen.getByTestId('domain-input-field'), 'https://test.com/docs/');
    await validateRecommendDomain('test.com');
  });

  it('renders recommended domain when user type in subdomain', async () => {
    render(<Default />);

    await userEvent.type(screen.getByTestId('domain-input-field'), 'https://abc.test.com/docs/');
    await validateRecommendDomain('test.com');
  });

  it('renders error when user type in invalid format', async () => {
    render(<Default />);

    await userEvent.type(screen.getByTestId('domain-input-field'), 'https://abctest');
    await validationInlineBanner('Invalid domain format');
  });

  it('renders error when user type in invalid suffix', async () => {
    render(<Default />);

    await userEvent.type(screen.getByTestId('domain-input-field'), 'https://abctest.bbbbb');

    await validationInlineBanner('Invalid domain format');
  });
});
