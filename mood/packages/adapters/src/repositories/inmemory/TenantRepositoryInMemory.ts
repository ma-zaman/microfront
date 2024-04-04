import { TenantRepository, Tenant } from '@mood/domain'

const INITIAL_TENANTS: any[] = [
  {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'my-tenant',
    description: 'My tenant',
    url: { grafana: 'http://grafana-my-tenant' },
    labels: { 'com.orange.repository.orangecarto/id': '9999' },
    created_at: new Date('2022-11-02T14:33:07.123Z'),
    updated_at: new Date('2022-11-02T15:33:07.123Z')
  },
  {
    id: '10000000-0000-0000-0000-000000000000',
    name: 'my-tenant-2',
    description: 'My tenant 2',
    url: {"grafana": "http://grafana-my-tenant-2"},
    labels: { 'com.orange.repository.orangecarto/id': '31944' },
    created_at: new Date('2024-02-07T10:10:10.123Z'),
    updated_at: new Date('2024-02-07T11:11:11.123Z')
  }
]

export class TenantRepositoryInMemory implements TenantRepository {
  constructor(private tenants: Tenant[] = INITIAL_TENANTS) {}

  getTenants(): Promise<Tenant[]> {
    return Promise.resolve(this.tenants)
  }
  addTenant(tenant: Tenant): Promise<void> {
    this.tenants.push(tenant)
    return Promise.resolve()
  }
  updateTenant(tenant: Tenant): Promise<void> {
    tenant.updated_at = new Date()
    const index = this.tenants.findIndex((ten) => ten.id === tenant.id)
    this.tenants[index] = tenant
    return Promise.resolve()
  }
  deleteTenant(tenant: Tenant): Promise<void> {
    this.tenants = this.tenants.filter((el) => el.name !== tenant.name)
    return Promise.resolve()
  }
}
