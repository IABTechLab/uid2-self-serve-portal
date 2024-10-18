import { Suspense } from 'react';
import { defer, useLoaderData } from 'react-router-typesafe';

import AuditTrailTable from '../components/AuditTrail/AuditTrailTable';
import { Loading } from '../components/Core/Loading/Loading';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer/ScreenContentContainer';
import { GetAuditTrail } from '../services/auditTrailService';
import { AwaitTypesafe } from '../utils/AwaitTypesafe';
import { makeParticipantLoader } from '../utils/loaderHelpers';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

const loader = makeParticipantLoader((participantId) => {
  const auditTrail = GetAuditTrail(participantId);
  return defer({ auditTrail });
});

function AuditTrail() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Audit Trail</h1>
      <ScreenContentContainer>
        <Suspense fallback={<Loading message='Loading audit trail...' />}>
          <AwaitTypesafe resolve={data.auditTrail}>
            {(auditTrail) => <AuditTrailTable auditTrail={auditTrail} />}
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
