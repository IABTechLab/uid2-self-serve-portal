import { ApiRoleDTO } from './ApiRole';

export interface ApiKeyDTO {
  keyId: string;
  name: string;
  contact: string;
  roles: ApiRoleDTO[];
  created: number;
  disabled: boolean;
  serviceId: number;
}
