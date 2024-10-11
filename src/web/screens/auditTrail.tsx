import { Suspense } from 'react';
import { defer, useLoaderData } from 'react-router-typesafe';

import AuditLogTable from '../components/AuditTrail/AuditTrailTable';
import { Loading } from '../components/Core/Loading/Loading';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer/ScreenContentContainer';
import { GetAuditLogs } from '../services/auditTrail';
import { AwaitTypesafe } from '../utils/AwaitTypesafe';
import { makeParticipantLoader } from '../utils/loaderHelpers';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

const loader = makeParticipantLoader((participantId) => {
  const auditTrail = GetAuditLogs(participantId);
  return defer({ auditTrail });
});

function AuditTrail() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Audit Trail</h1>
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

export const AuditTrailRoute: PortalRoute = {
  description: 'Audit Trail',
  element: <AuditTrail />,
  errorElement: <RouteErrorBoundary />,
  path: '/participant/:participantId/auditTrail',
  loader,
  isHidden: true,
};
