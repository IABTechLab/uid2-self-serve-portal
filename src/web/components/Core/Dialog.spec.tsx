import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from '@testing-library/react';

import * as stories from './Dialog.stories';

const { Default, WithoutCloseText, WithoutCloseButtons } = composeStories(stories);

describe('Dialog', () => {
  it('renders correctly with default props', () => {
    render(<Default />);
    const openButton = screen.getByText('Open Dialog');
    fireEvent.click(openButton);

    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog content goes here')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close Button' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close Icon' })).toBeInTheDocument();
  });

  it('does not render text close button if closeButton is undefined', () => {
    render(<WithoutCloseText />);
    const openButton = screen.getByText('Open Dialog');
    fireEvent.click(openButton);

    expect(screen.queryByRole('button', { name: 'Close Button' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close Icon' })).toBeInTheDocument();
  });

  it('does not render close buttons if hideCloseButtons', () => {
    render(<WithoutCloseButtons />);
    const openButton = screen.getByText('Open Dialog');
    fireEvent.click(openButton);

    expect(screen.queryByRole('button', { name: 'Close Button' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close Icon' })).not.toBeInTheDocument();
  });

  it('open dialog with external button', () => {
    render(<stories.WithOpenAndOnOpenChange />);
    const openButton = screen.getByText('Open');

    fireEvent.click(openButton);
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog content goes here')).toBeInTheDocument();
  });
});
