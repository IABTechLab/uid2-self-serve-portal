import { KeyPairModel } from './KeyPairModel';

export const validateUniqueKeyPairName = (
  value: string,
  existingKeyPairs: KeyPairModel[] | undefined
) => {
  if (existingKeyPairs && existingKeyPairs?.filter((k) => k.name === value).length > 0) {
    return 'Please enter a key pair name that does not already exist.';
  }
  return true;
};
