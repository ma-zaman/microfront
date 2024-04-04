import { Tenant } from '@mood/domain'

export interface GetTenantsPresentation {
  loadingTenants(): void
  notifyTenantsError(message: string): any
  displayTenants(tenants: Tenant[]): void
  displayTenantAcl(tenant: Tenant): void
}
