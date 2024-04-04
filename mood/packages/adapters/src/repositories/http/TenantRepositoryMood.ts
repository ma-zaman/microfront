import { TenantRepository, Tenant } from '@mood/domain'
import { HttpClient } from '@mood/web-adapters'

export class TenantRepositoryMood implements TenantRepository {
  private API_URI = '/v1/tenants'

  constructor(
    private http: HttpClient,
    private apiBaseUrl: string
  ) {}

  getTenants(): Promise<Tenant[]> {
    return this.http.get(this.apiBaseUrl + this.API_URI)
  }
  addTenant(tenant: Tenant): Promise<void> {
    const body = {
      name: tenant.name,
      labels: {
        'com.orange.repository.orangecarto/id': tenant.labels?.get(
          'com.orange.repository.orangecarto/id'
        )
      },
      description: tenant.description
    }
    return this.http.post(this.apiBaseUrl + this.API_URI, body)
  }
  updateTenant(tenant: Tenant): Promise<void> {
    const body = {
      ...tenant,
      labels: {
        'com.orange.repository.orangecarto/id': tenant.labels?.get(
          'com.orange.repository.orangecarto/id'
        )
      },
      updated_at: new Date()
    }
    return this.http.put(this.apiBaseUrl + this.API_URI + `/${tenant.id}`, body)
  }
  deleteTenant(tenant: Tenant): Promise<void> {
    return this.http.delete(this.apiBaseUrl + this.API_URI + `/${tenant.id}`)
  }
}
