import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from '@testing-library/react';

import * as stories from './ParticipantItem.stories';

const { Checked, Unchecked } = composeStories(stories);

describe('ParticipantItem', () => {
  it('renders unchecked state correctly', () => {
    render(<Unchecked />);
    expect(screen.getByText(Unchecked.args!.participant!.name)).toBeInTheDocument();
    expect(screen.getByLabelText(Unchecked.args!.participant!.name)).not.toBeChecked();
  });

  it('renders checked state correctly', () => {
    render(<Checked />);
    expect(screen.getByText(Checked.args!.participant!.name)).toBeInTheDocument();
    expect(screen.getByLabelText(Checked.args!.participant!.name)).toBeChecked();
  });

  it('handles checkbox click', () => {
    const handleClick = jest.fn();
    render(<Unchecked onClick={handleClick} />);

    fireEvent.click(screen.getByLabelText(Unchecked.args!.participant!.name));
    expect(handleClick).toHaveBeenCalled();
  });
});
