import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from '@testing-library/react';

import * as stories from './ParticipantItem.stories';

const { Checked, Unchecked } = composeStories(stories);

describe('ParticipantItem', () => {
  it('renders unchecked state correctly', () => {
    render(<Unchecked />);
    expect(screen.getByText(Unchecked.args!.site!.name)).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('renders checked state correctly', () => {
    render(<Checked />);
    expect(screen.getByText(Checked.args!.site!.name)).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('handles checkbox click', () => {
    const handleClick = jest.fn();
    render(<Unchecked onClick={handleClick} />);

    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleClick).toHaveBeenCalled();
  });
});
