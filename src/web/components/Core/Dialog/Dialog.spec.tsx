import { composeStories } from '@storybook/react-webpack5';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './Dialog.stories';

const { Default, WithoutCloseText, WithoutCloseButtons } = composeStories(stories);

describe('Dialog', () => {
  it('renders correctly with default props', () => {
    render(<Default />);

    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog content goes here')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close Button' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close Icon' })).toBeInTheDocument();
  });

  it('does not render text close button if closeButton is undefined', () => {
    render(<WithoutCloseText />);

    expect(screen.queryByRole('button', { name: 'Close Button' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close Icon' })).toBeInTheDocument();
  });

  it('does not render close buttons if hideCloseButtons', () => {
    render(<WithoutCloseButtons />);

    expect(screen.queryByRole('button', { name: 'Close Button' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close Icon' })).not.toBeInTheDocument();
  });

  it('open dialog with external button', async () => {
    const user = userEvent.setup();
    render(<stories.WithOpenAndOnOpenChange />);
    const openButton = screen.getByRole('button', { name: 'Open Dialog' });

    await user.click(openButton);
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog content goes here')).toBeInTheDocument();
  });
});
