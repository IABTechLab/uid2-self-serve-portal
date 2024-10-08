import React, { ErrorInfo, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ApiError } from './apiError';

interface ErrorState {
  errorId: string;
  errorHash?: string;
  hasError?: boolean;
  message?: string;
  stack?: string;
  componentStack?: string | null;
}

export interface RenderedErrorProps {
  errorId?: string;
  errorHash?: string;
  message?: string;
  stack?: string;
  componentStack?: string | null;
}

export interface ErrorBoundaryPropType {
  children: ReactNode;
  [key: string]: unknown;
}

/** Create an Error Boundary around a given component.
 * @param ErrorComponent - Custom error component used to display the error.
 */
export function errorHandler<P extends ErrorBoundaryPropType>(
  ErrorComponent: React.ComponentType<RenderedErrorProps>
) {
  class ErrorHandlerWrapperComponent extends React.Component<P, ErrorState> {
    ErrorComponent: React.ComponentType<RenderedErrorProps>; // eslint-disable-line react/no-unused-class-component-methods
    constructor(props: P) {
      super(props);
      this.state = {
        errorId: uuidv4() as string,
        hasError: false,
        errorHash: undefined,
      };
      this.ErrorComponent = ErrorComponent; // eslint-disable-line react/no-unused-class-component-methods
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
      const errorId = uuidv4() as string;
      const { message, stack } = error;
      const { componentStack } = info;
      const errorHash = error instanceof ApiError ? error.errorHash : undefined;
      const newState = {
        hasError: true,
        errorId,
        errorHash,
        message,
        stack,
        componentStack,
      };
      this.setState(newState);
    }

    render() {
      const { hasError, errorId, errorHash, message, stack, componentStack } = this.state;
      const { children } = this.props;
      if (hasError) {
        return (
          <this.ErrorComponent
            errorId={errorId}
            errorHash={errorHash}
            message={message}
            stack={stack}
            componentStack={componentStack}
          />
        );
      }
      return children;
    }
  }

  return ErrorHandlerWrapperComponent as React.ComponentType<P>;
}

/**
 * This is needed to make the react render loop aware of errors in async events.
 * Refer [this issue](https://github.com/facebook/react/issues/14981#issuecomment-468460187)
 */
export function useAsyncThrowError() {
  const [, setError] = React.useState();
  return React.useCallback(
    (e: Error) => {
      setError(() => {
        throw e;
      });
    },
    [setError]
  );
}
