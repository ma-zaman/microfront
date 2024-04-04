import { Tenant } from '@mood/domain'

export enum DeleteTenantFields {
  name = 'name',
  tenantToDelete = 'tenantToDelete'
}

export type DeleteTenantErrors = Map<DeleteTenantFields, string>

export interface DeleteTenantPresentation {
  notifyDeleteTenantFieldError(errors: DeleteTenantErrors): void
  notifyDeleteTenantError(error: string): void
  notifyTenantDeleted(tenant: Tenant): void
  notifyDeletingTenantInfo(): void
}
