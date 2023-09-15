import { KeyPairDTO } from '../../../api/services/adminServiceHelpers';

export type KeyPairModel = {
  contact?: string;
  createdString: string;
  disabled: boolean;
  publicKey: string;
  siteId: number;
  subscriptionId: string;
};

export const mapKeyPairDTOToModel = (dto: KeyPairDTO): KeyPairModel => {
  const model: KeyPairModel = {
    contact: dto.contact as string | undefined,
    createdString: new Date(dto.created * 1000).toUTCString(),
    disabled: dto.disabled as boolean,
    publicKey: dto.public_key as string,
    siteId: dto.site_id as number,
    subscriptionId: dto.subscription_id as string,
  };
  return model;
};
