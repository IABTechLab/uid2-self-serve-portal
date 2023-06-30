import { PropsWithChildren } from 'react';
import { FieldErrors } from 'react-hook-form';

export function getGlobalErrorsAsArray(root: FieldErrors['root']) {
  if (!root) return [];
  if ('message' in root && typeof root.message === 'string') {
    return [{ name: 'error', message: root.message }];
  }
  return Object.keys(root).map((k) => ({
    name: k,
    message: root[k].message || 'Unknown error',
  }));
}

export function ErrorDiv({ display, children }: PropsWithChildren<{ display: boolean }>) {
  return display ? <div className='form-error'>{children}</div> : null;
}
