import { AclBuilder, GetAclsPresentation, GetAclsRequest, TenantBuilder } from '@mood/domain'
import { AclsController, AclsPresenter, TenantStore } from '@mood/web-adapters'
import { GetAclsUseCaseBuilder } from '__tests__/builders/GetAclsUseCaseBuilder'
import { expect, describe, test } from 'vitest'

describe('AclsController', () => {
  test('fetch acls update acls vm', async () => {
    // Given

    const aclBuilder = new AclBuilder()
    const store = new TenantStore()
    const acls = [
      aclBuilder
        .withOwner('user0')
        .withOwnerType('user')
        .withRole('administrator')
        .withTenantName('tenant0')
        .withTenantId('00000000-0000-0000-0000-000000000000')
        .build()
    ]
    const getAclsUseCase = new GetAclsUseCaseBuilder()
      .withExecute((request: GetAclsRequest, presenter: GetAclsPresentation) => {
        presenter.displayAcls(acls)
        return Promise.resolve()
      })
      .build()
    const presenter = new AclsController(getAclsUseCase, new AclsPresenter(store))

    // When
    await presenter.fetchAcls()

    // Then
    expect(presenter.vm.acls).toEqual(acls)
  })
  test('Use stored tenant update acls vm', async () => {
    // Given

    const aclBuilder = new AclBuilder()
    const store = new TenantStore()
    const acls = [
      aclBuilder
        .withOwner('user0')
        .withOwnerType('user')
        .withRole('administrator')
        .withTenantName('tenant0')
        .build()
    ]
    const getAclsUseCase = new GetAclsUseCaseBuilder()
      .withExecute((request: GetAclsRequest, presenter: GetAclsPresentation) => {
        presenter.displayAcls(acls)
        return Promise.resolve()
      })
      .build()
    const presenter = new AclsController(getAclsUseCase, new AclsPresenter(store))

    // When
    const tenantToStore = new TenantBuilder().withName('tenant-test').build()
    store.set(tenantToStore)

    // Then
    expect(presenter.vm.tenantName).toBeUndefined()
    presenter.popStoredTenant()
    expect(presenter.vm.tenantName).toBe(tenantToStore.name)
  })
  test('Update acl with non defined tenant must not change stored tenant', async () => {
    // Given

    const store = new TenantStore()
    const getAclsUseCase = new GetAclsUseCaseBuilder().build()
    const presenter = new AclsController(getAclsUseCase, new AclsPresenter(store))

    // When
    expect(presenter.vm.tenantName).toBeUndefined()
    expect(store.get().id).toBe("")
    expect(store.get().name).toBe("")
    const tenantStored = presenter.popStoredTenant()

    // Then
    expect(presenter.vm.tenantName).toBe(tenantStored.name)
    expect(store.get().id).toBe("")
    expect(store.get().name).toBe("")
  })
  test('Use stored tenant in acl must remove stored tenant', async () => {
    // Given

    const store = new TenantStore()
    const getAclsUseCase = new GetAclsUseCaseBuilder().build()
    const presenter = new AclsController(getAclsUseCase, new AclsPresenter(store))

    // When
    const tenantToStore = new TenantBuilder().withName('tenant-test').build()
    store.set(tenantToStore)

    // Then
    expect(store.get().id).not.toBe("")
    expect(store.get().name).not.toBe("")
    presenter.popStoredTenant()
    expect(store.get().id).toBe("")
    expect(store.get().name).toBe("")
  })
})
