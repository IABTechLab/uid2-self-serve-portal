import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from '@testing-library/react';

import * as stories from './TypeFilter.stories';

const { Default } = composeStories(stories);

describe('TypeFilter', () => {
  it('calls onFilterChange with correct type id when a type button is clicked', () => {
    const mockOnFilterChange = jest.fn();

    render(<Default onFilterChange={mockOnFilterChange} />);

    const button = screen.getByText('Type 1');
    fireEvent.click(button);

    expect(mockOnFilterChange).toHaveBeenCalled();
    const firstCallArg = mockOnFilterChange.mock.calls[0][0] as Set<number>;
    expect(firstCallArg.has(1)).toBeTruthy();
  });
});
