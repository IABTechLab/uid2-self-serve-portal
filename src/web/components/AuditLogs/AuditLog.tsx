import { AuditTrailDTO } from '../../../api/entities/AuditTrail';

type AuditLogProps = Readonly<{
  log: AuditTrailDTO;
}>;

function AuditLog({ log }: AuditLogProps) {
  const formattedEventData = log.toString();

  const eventDate = Date().toString();

  return (
    <tr>
      <td>{log.userId}</td>
      <td>{log.userEmail}</td>
      <td>{formattedEventData}</td>
      <td>{eventDate}</td>
      <td>Succeeded Add Icon</td>
    </tr>
  );
}

export default AuditLog;
