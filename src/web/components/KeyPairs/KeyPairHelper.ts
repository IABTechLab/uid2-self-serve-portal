import { KeyPairModel } from './KeyPairModel';

export const validateUniqueKeyPairName = (
  value: string,
  existingKeyPairs: KeyPairModel[] | undefined
) => {
  const existingKeyPairNames = existingKeyPairs?.map((keypair) => keypair.name);
  if (existingKeyPairNames?.includes(value)) {
    return 'Please enter a key pair name that does not already exist.';
  }
  return true;
};
