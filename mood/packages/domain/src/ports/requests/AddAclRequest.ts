import { AclOwnerTypes, RoleTypes } from '@mood/domain'
import { UUID } from 'crypto'

export class AddAclRequest {
  constructor(
    public owner: string,
    public ownerType: AclOwnerTypes,
    public role: RoleTypes,
    public tenantId: UUID,
    public tenantName: string
  ) {}
}
