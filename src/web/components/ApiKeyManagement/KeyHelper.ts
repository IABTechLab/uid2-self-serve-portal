import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';

export const yearInSeconds = 60 * 60 * 24 * 365.25;

export const shouldRotateApiKey = (apiKey: ApiKeyDTO): boolean => {
  if (apiKey.disabled === true) {
    return false;
  }
  // apiKey date is in seconds, current date is in milliseconds
  const currentDate = Math.floor(Date.now() / 1000);
  if (currentDate - apiKey.created > yearInSeconds) {
    return true;
  }
  return false;
};

export const Mapper: ApiRoleDTO = { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 };
export const Generator: ApiRoleDTO = {
	id: 2,
	roleName: 'GENERATOR',
	externalName: 'Generator',
	order: 2,
};
export const Bidder: ApiRoleDTO = {
	id: 3,
	roleName: 'ID_READER',
	externalName: 'Bidder',
	order: 4,
};
export const Sharer: ApiRoleDTO = { id: 4, roleName: 'SHARER', externalName: 'Sharer', order: 3 };

export const allApiRoles = [Mapper, Generator, Bidder, Sharer];
