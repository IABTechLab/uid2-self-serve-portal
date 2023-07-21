import './InlineError.scss';

export function InlineError({ error }: { error?: string }) {
  return (
    <div className='inline-error'>
      <span className='inline-error-content'>{error ?? 'Error: Please try again later'}</span>
    </div>
  );
}
