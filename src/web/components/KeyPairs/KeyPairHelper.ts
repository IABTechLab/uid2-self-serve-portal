import { KeyPairModel } from './KeyPairModel';

export const validateUniqueKeyPairName = (
  value: string,
  existingKeyPairs: KeyPairModel[] | undefined
) => {
  if (existingKeyPairs && existingKeyPairs?.filter((k) => k.name === value).length > 0) {
    return 'Key pair name already exists.';
  }
  return true;
};
