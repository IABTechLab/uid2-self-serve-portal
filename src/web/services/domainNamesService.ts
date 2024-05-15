import axios, { AxiosError } from 'axios';

import { UpdateDomainNamesResponse } from '../components/ClientSideTokenGeneration/CstgDomainHelper';
import { backendError } from '../utils/apiError';

export type AddDomainNamesFormProps = {
  newDomains: string;
};

export type EditDomainFormProps = {
  domainName: string;
};

export async function GetDomainNames(participantId?: number) {
  try {
    const result = await axios.get<string[]>(
      `/participants/${participantId ?? 'current'}/domainNames`
    );
    if (result.status === 200) {
      return result.data;
    }
  } catch (e: unknown) {
    throw backendError(e, 'Could not get domain names');
  }
}

export async function UpdateDomainNames(
  domainNames: string[],
  participantId?: number
): Promise<UpdateDomainNamesResponse> {
  try {
    const result = await axios.post<string[]>(
      `/participants/${participantId ?? 'current'}/domainNames`,
      {
        domainNames,
      }
    );
    return { domains: result.data, isValidDomains: true };
  } catch (e: unknown) {
    if (
      e instanceof AxiosError &&
      e?.response?.status === 400 &&
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      e?.response?.data.message.includes('Invalid Domain Names')
    ) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        domains: [e?.response?.data.message.replace('Invalid Domain Names:', '')],
        isValidDomains: false,
      };
    }

    throw backendError(e, 'Could not set domain names');
  }
}
