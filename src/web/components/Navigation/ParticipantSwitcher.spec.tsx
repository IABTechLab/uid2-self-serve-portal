import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Participant, ParticipantDTO } from '../../../api/entities/Participant';
import { createMockParticipant, createMockUser } from '../../../testHelpers/dataMocks';
import {
  createParticipantContextValue,
  createUserContextValue,
  TestContextProviderWithoughKeycloak,
} from '../../../testHelpers/testContextProvider';
import { UserContextWithSetter } from '../../contexts/CurrentUserProvider';
import { ParticipantWithSetter } from '../../contexts/ParticipantProvider';
import { ParticipantSwitcher } from './ParticipantSwitcher';

const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

const renderParticipantSwitcherWithContext = (
  participantContextValue: ParticipantWithSetter,
  userContextValue: UserContextWithSetter
) => {
  return render(
    <TestContextProviderWithoughKeycloak
      participantContextValue={participantContextValue}
      userContextValue={userContextValue}
    >
      <ParticipantSwitcher />
    </TestContextProviderWithoughKeycloak>
  );
};

describe('Participant Switcher', () => {
  let participantContextValue: ParticipantWithSetter;
  let userContextValue: UserContextWithSetter;

  describe('user only has access to one participant', () => {
    let mockParticipant: ParticipantDTO;

    beforeAll(() => {
      mockParticipant = createMockParticipant();
      participantContextValue = createParticipantContextValue(mockParticipant);
      const mockUser = createMockUser([mockParticipant] as Participant[]);
      userContextValue = createUserContextValue(mockUser);
    });

    it('displays participant name when user only has one participant', () => {
      renderParticipantSwitcherWithContext(participantContextValue, userContextValue);

      const participantName = screen.getByText(mockParticipant.name);
      const participantSwitcherButton = screen.queryByRole('button', {
        name: mockParticipant.name,
      });
      expect(participantName).toBeInTheDocument();
      expect(participantSwitcherButton).not.toBeInTheDocument();
    });
  });

  describe('user has access to multiple participants', () => {
    let mockParticipant1: ParticipantDTO;
    let mockParticipant2: ParticipantDTO;

    beforeAll(() => {
      mockParticipant1 = createMockParticipant();
      mockParticipant2 = createMockParticipant();
      participantContextValue = createParticipantContextValue(mockParticipant1);
      const mockUser = createMockUser([mockParticipant1, mockParticipant2] as Participant[]);
      userContextValue = createUserContextValue(mockUser);
    });

    it('displays participant switcher when user has multiple participants', () => {
      renderParticipantSwitcherWithContext(participantContextValue, userContextValue);

      const participantSwitcherButton = screen.getByRole('button', {
        name: mockParticipant1.name,
      });
      expect(participantSwitcherButton).toBeInTheDocument();
    });
    it('shows accessible participants in the dropdown', async () => {
      const user = userEvent.setup();
      renderParticipantSwitcherWithContext(participantContextValue, userContextValue);

      const participantSwitcherButton = screen.getByRole('button', { name: mockParticipant1.name });
      await user.click(participantSwitcherButton);

      const participant1Option = screen.getByRole('menuitemcheckbox', {
        name: mockParticipant1.name,
      });
      const participant2Option = screen.getByRole('menuitemcheckbox', {
        name: mockParticipant2.name,
      });
      expect(participant1Option).toBeInTheDocument();
      expect(participant2Option).toBeInTheDocument();
    });
    it('can switch to another participant', async () => {
      const user = userEvent.setup();
      renderParticipantSwitcherWithContext(participantContextValue, userContextValue);

      const participantSwitcherButton = screen.getByRole('button', { name: mockParticipant1.name });
      await user.click(participantSwitcherButton);
      const participant2Option = screen.getByRole('menuitemcheckbox', {
        name: mockParticipant2.name,
      });
      await user.click(participant2Option);

      expect(mockUseNavigate).toHaveBeenCalledWith(
        expect.stringContaining(`participant/${mockParticipant2.id}`)
      );
      const updatedParticipantSwitcherButton = screen.getByRole('button', {
        name: mockParticipant2.name,
      });
      expect(updatedParticipantSwitcherButton).toBeInTheDocument();
    });
  });
});
