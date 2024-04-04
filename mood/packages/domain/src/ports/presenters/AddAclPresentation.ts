import { Acl } from '@mood/domain'

export enum NewAclFields {
  owner = 'owner',
  ownerType = 'ownerType',
  role = 'role',
  tenantName = 'tenantName',
  tenantId = 'tenantId'
}

export type AddAclErrors = Map<NewAclFields, string>

export interface AddAclPresentation {
  notifyNewAclFieldError(errors: AddAclErrors): void
  notifyAclAdded(acl: Acl): void
  notifyAddAclError(error: string): void
  notifyCreatingAclInfo(): void
}
