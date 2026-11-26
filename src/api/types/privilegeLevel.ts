export type PrivilegeLevel = 'superuser' | 'uid2-support' | 'standard';

declare module 'express-serve-static-core' {
  interface Request {
    privilegeLevel?: PrivilegeLevel;
  }
}
