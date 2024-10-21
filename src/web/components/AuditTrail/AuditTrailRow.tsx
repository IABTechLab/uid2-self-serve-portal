import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AuditTrailDTO } from '../../../api/entities/AuditTrail';
import { getPrettyAuditDetails } from '../../services/auditTrailService';

import './AuditTrail.scss';

type AuditTrailProps = Readonly<{
  log: AuditTrailDTO;
}>;

function AuditTrailRow({ log }: AuditTrailProps) {
  const formattedEventData = getPrettyAuditDetails(log.eventData);

  const eventDate = new Date(log.updated_at).toLocaleString();

  return (
    <tr>
      <td>{log.id}</td>
      <td>{log.userEmail}</td>
      <td>{log.event.replace(/([a-z])([A-Z])/g, '$1 $2')}</td>
      <td className='event-data'>{formattedEventData}</td>
      <td>{eventDate}</td>
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
