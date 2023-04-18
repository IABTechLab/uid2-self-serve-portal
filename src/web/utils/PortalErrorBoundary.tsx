import { errorHandler, ErrorView, RenderedErrorProps } from './errorHandler';

function PortalErrorComponent(props: RenderedErrorProps) {
  const { errorId, errorHash } = props;
  return (
    <ErrorView
      errorId={errorId}
      errorHash={errorHash}
      // Override whatever message we might have, messages we might see are 99% unhelpful
      message='Unexpected error encountered, please contact support if the problem persists and provide the information below'
    />
  );
}

export const PortalErrorBoundary = errorHandler(PortalErrorComponent);
