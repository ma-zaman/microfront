import { Tenant } from '@mood/domain'

export enum NewTenantFields {
  name = 'name',
  description = 'description',
  appId = 'appId'
}

export type AddTenantErrors = Map<NewTenantFields, string>

export interface AddTenantPresentation {
  notifyNewTenantFieldError(errors: AddTenantErrors): void
  notifyTenantAdded(tenant: Tenant): void
  notifyAddTenantError(error: string): void
  notifyCreatingTenantInfo(): void
}
