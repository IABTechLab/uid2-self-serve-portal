import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AuditTrailDTO } from '../../../api/entities/AuditTrail';
import { getFormattedEvent, getPrettyAuditDetails } from '../../services/auditTrailService';

import './AuditTrail.scss';

type AuditTrailProps = Readonly<{
  log: AuditTrailDTO;
}>;

function AuditTrailRow({ log }: AuditTrailProps) {
  const formattedEventData = getPrettyAuditDetails(log.eventData);
  const formattedEvent = getFormattedEvent(log.event);

  const eventDate = new Date(log.updated_at).toLocaleString();

  return (
    <tr>
      <td>{eventDate}</td>
      <td>{log.userEmail}</td>
      <td>{formattedEvent}</td>
      <td className='event-data'>{formattedEventData}</td>
      <td className='succeeded'>
        <FontAwesomeIcon
          className={log.succeeded ? 'icon_check' : 'icon_x'}
          icon={log.succeeded ? 'check' : 'xmark'}
        />
      </td>
    </tr>
  );
}

export default AuditTrailRow;
