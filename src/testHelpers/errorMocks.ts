import * as axios from 'axios';

export function mockBackendError({ status, errorHash }: { status: number; errorHash: string }) {
  return new axios.AxiosError(
    'Something went wrong',
    'INTERNAL_SERVER_ERROR',
    {
      headers: new axios.AxiosHeaders({
        'Content-Type': 'application/json',
      }),
    },
    {},
    {
      data: { errorHash },
      status,
      statusText: '',
      headers: new axios.AxiosHeaders({
        'Content-Type': 'application/json',
      }),
      config: {
        headers: new axios.AxiosHeaders({
          'Content-Type': 'application/json',
        }),
      },
    }
  );
}
