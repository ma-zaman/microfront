import { Acl, AclOwnerTypes, RoleTypes } from '@mood/domain'
import { UUID } from 'crypto'

export class DeleteAclRequest {
  constructor(
    public acls: Acl[],
    public id: UUID,
    public owner: string,
    public ownerType: AclOwnerTypes,
    public role: RoleTypes,
    public tenantName: string,
    public tenantId: UUID
  ) {}
}
