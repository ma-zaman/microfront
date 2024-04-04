import { Tenant } from '@mood/domain'

export interface TenantRepository {
  addTenant(tenant: Tenant): Promise<void>
  updateTenant(tenant: Tenant): Promise<void>
  deleteTenant(tenant: Tenant): Promise<void>
  getTenants(): Promise<Tenant[]>
}
