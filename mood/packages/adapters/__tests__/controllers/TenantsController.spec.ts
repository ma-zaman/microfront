import { TenantBuilder, GetTenantsPresentation, Tenant } from '@mood/domain'
import {
  FakeNavigation,
  TenantStore,
  Navigation,
  NavigationRoute,
  Store,
  TenantsController,
  TenantsPresenter
} from '@mood/web-adapters'
import { GetTenantsUseCaseBuilder } from '__tests__/builders/GetTenantsUseCaseBuilder'
import { expect, describe, test } from 'vitest'

describe('TenantsController', () => {
  test('fetch tenants update tenants vm', async () => {
    // Given

    const tenantBuilder = new TenantBuilder()
    const tenants = [tenantBuilder.withName('tenant0').build()]
    const getTenantsUseCase = new GetTenantsUseCaseBuilder()
      .withExecute((presenter: GetTenantsPresentation) => {
        presenter.displayTenants(tenants)
        return Promise.resolve()
      })
      .build()
    const navigation: Navigation = new FakeNavigation()
    const store: Store<Tenant> = new TenantStore()
    const controller = new TenantsController(
      getTenantsUseCase,
      new TenantsPresenter(navigation, store)
    )

    // When
    await controller.fetchTenants()

    // Then
    expect(controller.vm.tenants).toEqual(tenants)
  })

  test('Display tenant acl must store tenant', async () => {
    // Given
    const tenantBuilder = new TenantBuilder()

    const tenants = [tenantBuilder.withName('tenant0').build()]
    const getTenantsUseCase = new GetTenantsUseCaseBuilder()
      .withExecute((presenter: GetTenantsPresentation) => {
        presenter.displayTenants(tenants)
        return Promise.resolve()
      })
      .build()

    const navigation: Navigation = new FakeNavigation()
    const store: Store<Tenant> = new TenantStore()
    const controller = new TenantsController(
      getTenantsUseCase,
      new TenantsPresenter(navigation, store)
    )

    // When
    const tenantToStore = new TenantBuilder().withName('tenant-test').build()
    expect(store.get().id).toBe("")
    expect(store.get().name).toBe("")
    controller.displayTenantAcl(tenantToStore)

    // Then
    expect(store.get()).toBe(tenantToStore)
  })

  test('Display to acl tenant must change navigation', async () => {
    // Given
    const getTenantsUseCase = new GetTenantsUseCaseBuilder().build()

    const navigation = new FakeNavigation()
    const store: Store<Tenant> = new TenantStore()
    const controller = new TenantsController(
      getTenantsUseCase,
      new TenantsPresenter(navigation, store)
    )

    // When
    navigation.navigate(NavigationRoute.TENANTS)
    const tenantToStore = new TenantBuilder().withName('tenant-test').build()
    expect(navigation.currentRoute).not.toBe(NavigationRoute.ACLS)
    controller.displayTenantAcl(tenantToStore)

    // Then
    expect(navigation.currentRoute).toBe(NavigationRoute.ACLS)
  })
})
