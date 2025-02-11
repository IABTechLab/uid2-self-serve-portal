import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { getUnapprovedRoles } from './KeyEditDialogHelper';
import { Bidder, Generator, Mapper, Sharer } from './KeyHelper.spec';

const keyRoles = [Mapper, Generator, Bidder, Sharer];

describe('#getUnapprovedRoles', () => {
  test('When all roles are approved', () => {
    const allApprovedRoles = [Mapper, Generator, Bidder, Sharer];

    expect(getUnapprovedRoles(keyRoles, allApprovedRoles)).toEqual([]);
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
