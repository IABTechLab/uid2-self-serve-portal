import { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';

export function TestContextProvider({ children }: PropsWithChildren) {
  return <BrowserRouter>{children}</BrowserRouter>;
}
