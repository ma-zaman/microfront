import { Acl } from '@mood/domain'

export enum DeleteAclFields {
  acls = 'acls',
  id = 'id',
  owner = 'owner',
  ownerType = 'ownerType',
  role = 'role',
  tenantName = 'tenantName',
  tenantId = 'tenantId'
}

export type DeleteAclErrors = Map<DeleteAclFields, string>

export interface DeleteAclPresentation {
  notifyDeleteAclFieldError(errors: DeleteAclErrors): void
  notifyDeleteAclError(error: string): void
  notifyAclDeleted(acl: Acl): void
  notifyDeletingAclInfo(): void
}
