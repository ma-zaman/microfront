import { Tenant } from '@mood/domain'

export enum UpdateTenantFields {
  name = 'name',
  description = 'description',
  appId = 'appId',
  created_at = 'created_at',
  updated_at = 'updated_at'
}

export type UpdateTenantErrors = Map<UpdateTenantFields, string>

export interface UpdateTenantPresentation {
  notifyUpdateTenantFieldError(errors: UpdateTenantErrors): void
  notifyUpdateTenantError(error: string): void
  notifyTenantUpdated(tenant: Tenant): void
  notifyUpdatingTenantInfo(): void
}
