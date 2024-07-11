import { ErrorView } from '../components/Core/ErrorView/ErrorView';
import { errorHandler, RenderedErrorProps } from './errorHandler';

function PortalErrorComponent(props: RenderedErrorProps) {
  const { errorId, errorHash, darkMode } = props;
  return <ErrorView errorId={errorId} errorHash={errorHash} darkMode={darkMode} />;
}

export const PortalErrorBoundary = errorHandler(PortalErrorComponent);
