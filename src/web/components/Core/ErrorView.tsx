import { analyticsIdentifier } from '../../utils/errorHelpers';

type ErrorViewProps = {
  message?: string;
  errorId?: string;
  errorHash?: string;
};

function ErrorView({ message, errorId, errorHash }: ErrorViewProps) {
  return (
    <div className='error-content'>
      <img alt='Error icon' src='/uid2-logo.png' />
      <div>Error</div>
      <div>
        {message ??
          'There was an unexpected error. Please try again. If the problem persists, contact Support and provide the following information: '}
      </div>
      <div>({analyticsIdentifier(errorId, errorHash)})</div>
    </div>
  );
}

export default ErrorView;
