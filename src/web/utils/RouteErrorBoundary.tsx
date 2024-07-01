import { useRouteError } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { ErrorView } from '../components/Core/Views/ErrorView';

interface RouteError {
  errorHash?: string;
}

export function RouteErrorBoundary() {
  const errorId = uuidv4() as string;
  const { errorHash } = useRouteError() as RouteError;

  return <ErrorView errorId={errorId} errorHash={errorHash} />;
}
