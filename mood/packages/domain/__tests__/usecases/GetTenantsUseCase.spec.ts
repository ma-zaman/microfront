import { GetTenantsUseCase, Tenant, TenantBuilder } from '@mood/domain'
import { GetTenantsPresentationBuilder } from '__tests__/builders/GetTenantsPresentationBuilder'
import { TenantRepositoryBuilder } from '__tests__/builders/TenantRepositoryBuilder'
import { describe, test, expect } from 'vitest'

describe('Get tenants use case', () => {
  test('display list of tenants', async () => {
    // Given
    const urlTenant0 = {"grafana": "http://grafana_url_0"}
    const urlTenant1 = {"grafana": "http://grafana_url_1"}
    return new Promise((resolve) => {
      const tenantBuilder = new TenantBuilder()
      const tenant0: Tenant = tenantBuilder.withName('tenant0').withUrl(urlTenant0).build()
      const tenant1: Tenant = tenantBuilder.withName('tenant1').withUrl(urlTenant1).build()

      const tenants = []
      tenants.push(tenant0)
      tenants.push(tenant1)

      const tenantRepository = new TenantRepositoryBuilder()
        .withGetTenants(() => Promise.resolve(tenants))
        .build()
      const useCase = new GetTenantsUseCase(tenantRepository)
      const presentation = new GetTenantsPresentationBuilder()
        .withDisplayTenants((displayTenants) => resolve(displayTenants))
        .build()

      // When
      useCase.execute(presentation)
    }).then((tenants) => {
      // Then
      expect(tenants).toBeDefined()
      expect(tenants).toHaveLength(2)
      expect(tenants[0].name).toStrictEqual('tenant0')
      expect(tenants[1].name).toStrictEqual('tenant1')
      expect(tenants[0].url).toStrictEqual(urlTenant0)
      expect(tenants[1].url).toStrictEqual(urlTenant1)
    })
  })
})
