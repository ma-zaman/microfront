import { Tenant } from '@mood/domain'
import {
  FakeNavigation,
  Navigation,
  Store,
  TenantsControllerFactory,
  TenantStore
} from '@mood/web-adapters'
import { GetTenantsUseCaseBuilder } from '__tests__/builders/GetTenantsUseCaseBuilder'
import { expect, test, describe } from 'vitest'

describe('TenantsPresenterFactory', () => {
  test('create a TenantsPresenter', () => {
    // Given
    const navigation: Navigation = new FakeNavigation()
    const store: Store<Tenant> = new TenantStore()
    const factory = new TenantsControllerFactory(
      new GetTenantsUseCaseBuilder().build(),
      navigation,
      store
    )
    // When
    const presenter = factory.build()

    // Then
    expect(presenter).not.toBeNull()
  })
})
