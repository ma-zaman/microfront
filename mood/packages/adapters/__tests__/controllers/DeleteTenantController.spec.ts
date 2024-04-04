import {
  DeleteTenantPresentation,
  DeleteTenantRequest,
  TenantBuilder,
  DeleteTenantFields
} from '@mood/domain'
import {
  DeleteTenantController,
  DeleteTenantPresenter,
  FakeNavigation,
  NavigationRoute
} from '@mood/web-adapters'
import { describe, test, expect } from 'vitest'
import { DeleteTenantUseCaseBuilder } from '../builders/DeleteTenantCaseBuilder'

describe('DeleteTenantController', () => {
  test('display tenant error on validate name', () => {
    // Given
    const useCase = new DeleteTenantUseCaseBuilder()
      .withValidate((_: DeleteTenantRequest, presenter: DeleteTenantPresentation) => {
        const errors = new Map<DeleteTenantFields, string>()
        errors.set(DeleteTenantFields.name, 'Tenant name required')
        presenter.notifyDeleteTenantFieldError(errors)
        return errors
      })
      .build()

    const controller = new DeleteTenantController(
      useCase,
      new DeleteTenantPresenter(new FakeNavigation())
    )

    // When
    controller.validateTenantName('')

    // Then
    expect(controller.vm.tenantNameError).toBe('Tenant name required')
    expect(controller.vm.tenantNameTouched).toBeTruthy()
    expect(controller.vm.canDeleteTenant).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display tenant error on delete', () => {
    // Given
    const useCase = new DeleteTenantUseCaseBuilder()
      .withExecute((_: DeleteTenantRequest, presenter: DeleteTenantPresentation) => {
        const errors = new Map<DeleteTenantFields, string>()
        errors.set(DeleteTenantFields.name, 'Tenant name required')
        presenter.notifyDeleteTenantFieldError(errors)
        return Promise.resolve()
      })
      .build()
    const controller = new DeleteTenantController(
      useCase,
      new DeleteTenantPresenter(new FakeNavigation())
    )

    // When
    controller.delete()

    // Then
    expect(controller.vm.canDeleteTenant).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('check redirection after deleting tenant with success', async () => {
    // Given
    const tenant = new TenantBuilder()
      .withName('tenant-test-x')
      .withLabels(new Map().set('com.orange.repository.orangecarto/id', '10'))
      .withDescription('description')
      .build()
    const navigation = new FakeNavigation()

    await new Promise<void>((resolve) => {
      const useCase = new DeleteTenantUseCaseBuilder()
        .withExecute((_: DeleteTenantRequest, presenter: DeleteTenantPresentation) => {
          presenter.notifyTenantDeleted(tenant)
          return Promise.resolve().then(() => resolve())
        })
        .build()
      const controller = new DeleteTenantController(useCase, new DeleteTenantPresenter(navigation))

      // When
      controller.delete()
    })

    // Then
    expect(navigation.currentRoute).toBe(NavigationRoute.TENANTS)
  })

  test('Alert is triggered when deleting tenant with success', async () => {
    // Given
    const tenant = new TenantBuilder()
      .withName('tenant-test-x')
      .withLabels(new Map().set('com.orange.repository.orangecarto/id', '10'))
      .withDescription('description')
      .build()
    const navigation = new FakeNavigation()

    await new Promise<void>((resolve) => {
      const useCase = new DeleteTenantUseCaseBuilder()
        .withExecute((_: DeleteTenantRequest, presenter: DeleteTenantPresentation) => {
          presenter.notifyTenantDeleted(tenant)
          return Promise.resolve().then(() => resolve())
        })
        .build()
      const controller = new DeleteTenantController(useCase, new DeleteTenantPresenter(navigation))

      // When
      controller.delete()
      // Then
      expect(controller.vm.displayAlert).toBeTruthy()
      expect(controller.vm.alert.details).toBe('theTenantHasBeenDeleted')
    })
  })
})
