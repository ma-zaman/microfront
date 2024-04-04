import { Acl } from '@mood/domain'

export enum UpdateAclFields {
  id = 'id',
  owner = 'owner',
  ownerType = 'ownerType',
  role = 'role',
  tenantId = 'tenantId',
  tenantName = 'tenantName'
}

export type UpdateAclErrors = Map<UpdateAclFields, string>

export interface UpdateAclPresentation {
  notifyUpdateAclFieldError(errors: UpdateAclErrors): void
  notifyUpdateAclError(error: string): void
  notifyAclUpdated(acl: Acl): void
  notifyUpdatingAclInfo(): void
}
