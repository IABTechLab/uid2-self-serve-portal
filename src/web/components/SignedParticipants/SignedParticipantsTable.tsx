import { SignedParticipantDTO } from '../../../api/entities/SignedParticipant';

type SignedParticipantsTableProps = {
  signedParticipants: SignedParticipantDTO[];
};

export function SignedParticipantsTable({ signedParticipants }: SignedParticipantsTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Participant Name</th>
        </tr>
      </thead>
      <tbody>
        {signedParticipants.map((participant) => (
          <tr key={participant.name}>
            <td>{participant.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
