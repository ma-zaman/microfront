import { Tenant } from '@mood/domain'
import { AclsControllerFactory, TenantStore, Store } from '@mood/web-adapters'
import { GetAclsUseCaseBuilder } from '__tests__/builders/GetAclsUseCaseBuilder'
import { expect, test, describe } from 'vitest'

describe('AclsPresenterFactory', () => {
  test('create a AclsPresenter', () => {
    // Given
    const store: Store<Tenant> = new TenantStore()
    const factory = new AclsControllerFactory(new GetAclsUseCaseBuilder().build(), store)

    // When
    const presenter = factory.build()

    // Then
    expect(presenter).not.toBeNull()
  })
})
