import { composeStories } from '@storybook/react-webpack5';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './ParticipantItem.stories';

const { Checked, Unchecked } = composeStories(stories);

describe('ParticipantItem', () => {
  it('renders unchecked state correctly', () => {
    render(<Unchecked />);
    expect(screen.getByText(Unchecked.args.site!.name)).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('renders checked state correctly', () => {
    render(<Checked />);
    expect(screen.getByText(Checked.args.site!.name)).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('handles checkbox click', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Unchecked onClick={handleClick} />);

    await user.click(screen.getByRole('checkbox'));
    expect(handleClick).toHaveBeenCalled();
  });
});
