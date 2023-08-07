import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from '@testing-library/react';

import * as stories from './ParticipantsTable.stories';

const { Default } = composeStories(stories);

describe('ParticipantsTable', () => {
  it('renders all participants', () => {
    render(<Default />);
    expect(screen.getByText('Participant 1')).toBeInTheDocument();
    expect(screen.getByText('Participant 2')).toBeInTheDocument();
  });

  it('calls onSelectedChange when a participant is selected', () => {
    const mockOnSelectedChange = jest.fn();
    render(<Default onSelectedChange={mockOnSelectedChange} />);

    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(firstCheckbox);

    expect(mockOnSelectedChange).toHaveBeenCalled();
  });

  it('handles filter changes', () => {
    render(<Default filterText='1' />);
    expect(screen.getByText('Participant 1')).toBeInTheDocument();
    expect(screen.queryByText('Participant 2')).not.toBeInTheDocument();
  });
});
