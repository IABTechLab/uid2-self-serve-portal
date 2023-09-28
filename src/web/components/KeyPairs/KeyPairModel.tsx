/* eslint-disable camelcase */
import { KeyPairDTO } from '../../../api/services/adminServiceHelpers';

export type KeyPairModel = {
  contact?: string;
  created: Date;
  createdString: string;
  disabled: boolean;
  publicKey: string;
  siteId: number;
  subscriptionId: string;
  name?: string;
};

export const mapKeyPairDTOToModel = (dto: KeyPairDTO): KeyPairModel => {
  const model: KeyPairModel = {
    contact: dto.contact as string | undefined,
    createdString: new Date(dto.created * 1000).toUTCString(),
    created: new Date(dto.created * 1000),
    disabled: dto.disabled as boolean,
    publicKey: dto.public_key as string,
    siteId: dto.site_id as number,
    subscriptionId: dto.subscription_id as string,
    name: dto.name as string,
  };
  return model;
};

export const mapKeyPairModelToDTO = (model: KeyPairModel): KeyPairDTO => {
  const dto: KeyPairDTO = {
    contact: model.contact,
    created: new Date(model.created).getTime(),
    disabled: model.disabled,
    public_key: model.publicKey,
    site_id: model.siteId,
    subscription_id: model.subscriptionId,
    name: model.name,
  };
  return dto;
};
