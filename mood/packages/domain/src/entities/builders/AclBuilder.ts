import { Acl, RoleTypes, AclOwnerTypes, Tenant } from '@mood/domain'
import { UUID } from 'crypto'

export class AclBuilder {
  private id!: UUID
  private owner!: string
  private ownerType!: AclOwnerTypes
  private role!: RoleTypes
  private tenantId!: UUID
  private tenantName!: string

  withId(id: UUID) {
    this.id = id
    return this
  }

  withOwner(owner: string) {
    this.owner = owner
    return this
  }

  withOwnerType(ownerType: AclOwnerTypes) {
    this.ownerType = ownerType
    return this
  }

  withRole(role: RoleTypes) {
    this.role = role
    return this
  }

  withTenantName(tenantName: string) {
    this.tenantName = tenantName
    return this
  }

  withTenantId(tenantId: UUID) {
    this.tenantId = tenantId
    return this
  }

  build(): Acl {
    return {
      id: this.id,
      owner: this.owner,
      ownerType: this.ownerType,
      role: this.role,
      tenantId: this.tenantId,
      tenantName: this.tenantName
    }
  }
}
