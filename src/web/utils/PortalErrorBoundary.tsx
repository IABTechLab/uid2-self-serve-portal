import { errorHandler, RenderedErrorProps } from './errorHandler';
import { ErrorView } from './ErrorView';

function PortalErrorComponent(props: RenderedErrorProps) {
  const { errorId, errorHash } = props;
  return <ErrorView errorId={errorId} errorHash={errorHash} />;
}

export const PortalErrorBoundary = errorHandler(PortalErrorComponent);
