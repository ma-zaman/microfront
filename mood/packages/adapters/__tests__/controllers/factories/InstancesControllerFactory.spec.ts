import { Tenant } from '@mood/domain'
import { InstancesControllerFactory, Store, TenantStore } from '@mood/web-adapters'
import { GetInstancesUseCaseBuilder } from '__tests__/builders/GetInstancesUseCaseBuilder'
import { expect, test, describe } from 'vitest'

describe('InstancesPresenterFactory', () => {
  test('create a InstancesPresenter', () => {
    // Given
    const store: Store<Tenant> = new TenantStore()
    const factory = new InstancesControllerFactory(new GetInstancesUseCaseBuilder().build(), store)

    // When
    const presenter = factory.build()

    // Then
    expect(presenter).not.toBeNull()
  })
})
