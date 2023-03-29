import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from '@testing-library/react';

import * as stories from './Dialog.stories';

const { Default, WithoutTitle, WithoutCloseButton } = composeStories(stories);

describe('Dialog', () => {
  it('renders correctly with default props', () => {
    render(<Default />);
    const openButton = screen.getByText('Open Dialog');
    fireEvent.click(openButton);

    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog content goes here')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('renders without title', () => {
    render(<WithoutTitle />);
    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
  });

  it('does not render close button if closeButton is undefined', () => {
    render(<WithoutCloseButton />);
    expect(screen.queryByText('Close')).not.toBeInTheDocument();
  });

  it('open dialog with external button', () => {
    render(<stories.WithOpenAndOnOpenChange />);
    const openButton = screen.getByText('Open');

    fireEvent.click(openButton);
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog content goes here')).toBeInTheDocument();
  });
});
