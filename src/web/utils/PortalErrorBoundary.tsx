import { ErrorView } from '../components/Core/Views/ErrorView';
import { errorHandler, RenderedErrorProps } from './errorHandler';

function PortalErrorComponent(props: RenderedErrorProps) {
  const { errorId, errorHash } = props;
  return <ErrorView errorId={errorId} errorHash={errorHash} />;
}

export const PortalErrorBoundary = errorHandler(PortalErrorComponent);
