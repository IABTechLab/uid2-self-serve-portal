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
    createdString: new Date(dto.created).toLocaleDateString(),
    created: new Date(dto.created),
    disabled: dto.disabled as boolean,
    publicKey: dto.publicKey as string,
    siteId: dto.siteId as number,
    subscriptionId: dto.subscriptionId as string,
    name: dto.name as string,
  };
  return model;
};

export const mapKeyPairModelToDTO = (model: KeyPairModel): KeyPairDTO => {
  const dto: KeyPairDTO = {
    contact: model.contact,
    created: new Date(model.created).getTime(),
    disabled: model.disabled,
    publicKey: model.publicKey,
    siteId: model.siteId,
    subscriptionId: model.subscriptionId,
    name: model.name,
  };
  return dto;
};
