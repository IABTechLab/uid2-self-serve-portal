import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { getUnapprovedRoles } from './KeyEditDialogHelper';
import { allApiRoles, Bidder, Generator, Mapper, Sharer } from './KeyHelper';

const keyRoles = allApiRoles;

describe('#getUnapprovedRoles', () => {
  test('When all roles are approved', () => {
    expect(getUnapprovedRoles(keyRoles, allApiRoles)).toEqual([]);
  });

  test('When some roles are approved', () => {
    const someApprovedRoles = [Mapper, Generator];

    expect(getUnapprovedRoles(keyRoles, someApprovedRoles)).toEqual([Bidder, Sharer]);
  });

  test('When no roles are approved', () => {
    const noApprovedRoles: ApiRoleDTO[] = [];

    expect(getUnapprovedRoles(keyRoles, noApprovedRoles)).toEqual(keyRoles);
  });
});
