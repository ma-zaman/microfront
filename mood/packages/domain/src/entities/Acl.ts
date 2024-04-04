import { UUID } from 'crypto'

export type RoleTypes = 'administrator' | 'member' | 'viewer'

export type AclOwnerTypes = 'user' | 'team'

export interface Acl {
  id: UUID
  owner: string
  ownerType: AclOwnerTypes
  role: RoleTypes
  tenantId: UUID
  tenantName: string
}
