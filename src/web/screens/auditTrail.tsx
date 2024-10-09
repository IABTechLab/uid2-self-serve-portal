import { Suspense, useContext } from 'react';
import { useRevalidator } from 'react-router-dom';
import { defer, useLoaderData } from 'react-router-typesafe';

import { AuditTrailDTO } from '../../api/entities/AuditTrail';
import AuditLogTable from '../components/AuditLogs/AuditLogTable';
import { Loading } from '../components/Core/Loading/Loading';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer/ScreenContentContainer';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { GetAuditLogs } from '../services/auditTrail';
import { AwaitTypesafe } from '../utils/AwaitTypesafe';
import { makeParticipantLoader } from '../utils/loaderHelpers';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

// const loader = makeParticipantLoader((participantId) => {
//   const users = GetAllUsersOfParticipant(participantId);
//   return defer({ users });
// });

const loader = makeParticipantLoader((participantId) => {
  const auditTrail = GetAuditLogs(participantId);
  return defer({ auditTrail });
});

function AuditLogs() {
  const { LoggedInUser, loadUser } = useContext(CurrentUserContext);
  const data = useLoaderData<typeof loader>();
  const { participant } = useContext(ParticipantContext);
  const reloader = useRevalidator();

  return (
    <>
      <h1>Audit Logs</h1>
      <p className='heading-details'>Blah Blah Blah</p>
      <ScreenContentContainer>
        <Suspense fallback={<Loading message='Loading audit data...' />}>
          <AwaitTypesafe resolve={data.auditTrail}>
            {(auditTrail) => <AuditLogTable auditTrail={auditTrail} />}
          </AwaitTypesafe>
        </Suspense>
      </ScreenContentContainer>
    </>
  );
}

export const AuditLogsRoute: PortalRoute = {
  description: 'Audit Logs',
  element: <AuditLogs />,
  errorElement: <RouteErrorBoundary />,
  path: '/participant/:participantId/auditLogs',
  loader,
};
