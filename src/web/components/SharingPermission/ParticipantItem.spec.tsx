import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ParticipantItem } from './ParticipantItem';
import * as stories from './ParticipantItem.stories';

const { Checked, Unchecked } = stories;

describe('ParticipantItem', () => {
  it('renders unchecked state correctly', () => {
    render(
      <table>
        <tbody>
          <ParticipantItem {...Unchecked.args} />
        </tbody>
      </table>
    );
    expect(screen.getByText(Unchecked.args.site!.name)).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('renders checked state correctly', () => {
    render(
      <table>
        <tbody>
          <ParticipantItem {...Checked.args} />
        </tbody>
      </table>
    );
    expect(screen.getByText(Checked.args.site!.name)).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('handles checkbox click', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <table>
        <tbody>
          <ParticipantItem {...Unchecked.args} onClick={handleClick} />
        </tbody>
      </table>
    );

    await user.click(screen.getByRole('checkbox'));
    expect(handleClick).toHaveBeenCalled();
  });
});
