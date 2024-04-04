import { Tenant, TenantBuilder } from '@mood/domain'
import { TenantRepositoryInMemory } from '@mood/web-adapters'
import { describe, test, expect } from 'vitest'

describe('TenantRepositoryInMemory', () => {
  test('add 2 new tenants and get them should be fine', async () => {
    // Given
    const tenants: Tenant[] = []
    const tenantRepository = new TenantRepositoryInMemory(tenants)
    const urlTenant0 = {"grafana": "http://grafana_url_0"}
    const urlTenant1 = {"grafana": "http://grafana_url_1"}
    // When
    const tenantBuilder = new TenantBuilder()
    const tenant0 = tenantBuilder.withName('tenant-to-add-0').withUrl(urlTenant0).build()
    const tenant1 = tenantBuilder.withName('tenant-to-add-1').withUrl(urlTenant1).build()

    await tenantRepository.addTenant(tenant0)
    await tenantRepository.addTenant(tenant1)
    const tenantsAdded = await tenantRepository.getTenants()

    // Then
    expect(tenantsAdded).toBeDefined()
    expect(tenantsAdded).toHaveLength(2)
    expect(tenantsAdded[0].name).toEqual('tenant-to-add-0')
    expect(tenantsAdded[1].name).toEqual('tenant-to-add-1')
    expect(tenantsAdded[0].url).toEqual(urlTenant0)
    expect(tenantsAdded[1].url).toEqual(urlTenant1)
  })

  test('update tenants', async () => {
    // Given
    const tenants: Tenant[] = []
    const tenantRepository = new TenantRepositoryInMemory(tenants)
    const urlTenant0 = {"grafana": "http://grafana_url_0"}
    const tenantBuilder = new TenantBuilder()
    const tenant = tenantBuilder.withName('my-tenant').withUrl(urlTenant0).build()
    await tenantRepository.addTenant(tenant)
    const tenantsAdded = await tenantRepository.getTenants()
    expect(tenantsAdded).toBeDefined()
    expect(tenantsAdded[0].name).toEqual('my-tenant')

    // When
    tenant.name = 'my-tenant-updated'
    const urlTenantUpdated = {"grafana": "http://grafana_url_1"}
    tenant.url = urlTenantUpdated

    await tenantRepository.updateTenant(tenant)
    const tenantsUpdated = await tenantRepository.getTenants()

    // Then
    expect(tenantsUpdated).toBeDefined()
    expect(tenantsUpdated[0].name).toEqual('my-tenant-updated')
    expect(tenantsUpdated[0].url).toEqual(urlTenantUpdated)
  })
})
