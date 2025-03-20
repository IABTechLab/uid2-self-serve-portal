import { ErrorView } from '../components/Core/ErrorView/ErrorView';
import { errorHandler, RenderedErrorProps } from './errorHandler';

function PortalErrorComponent(props: RenderedErrorProps) {
  const { errorId, errorHash } = props;
  return <ErrorView errorId={errorId} errorHash={errorHash} showLogoutButton />;
}

export const PortalErrorBoundary = errorHandler(PortalErrorComponent);
