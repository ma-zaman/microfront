import {
  AddTenantPresentation,
  AddTenantRequest,
  TenantBuilder,
  NewTenantFields,
  Tenant
} from '@mood/domain'
import {
  AddTenantController,
  AddTenantPresenter,
  FakeNavigation,
  NavigationRoute
} from '@mood/web-adapters'
import { AddTenantUseCaseBuilder } from '../builders/AddTenantCaseBuilder'
import { describe, test, expect } from 'vitest'

describe('AddTenantController', () => {
  test('display tenant error on validate name', () => {
    // Given
    const useCase = new AddTenantUseCaseBuilder()
      .withValidate((_: AddTenantRequest, presenter: AddTenantPresentation) => {
        const errors = new Map<NewTenantFields, string>()
        errors.set(NewTenantFields.name, 'Tenant name required')
        presenter.notifyNewTenantFieldError(errors)
        return errors
      })
      .build()

    const controller = new AddTenantController(
      useCase,
      new AddTenantPresenter(new FakeNavigation())
    )

    // When
    controller.validateTenantName('')

    // Then
    expect(controller.vm.tenantNameError).toBe('Tenant name required')
    expect(controller.vm.tenantNameTouched).toBeTruthy()
    expect(controller.vm.canCreateTenant).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display tenant error on validate description', () => {
    // Given
    const useCase = new AddTenantUseCaseBuilder()
      .withValidate((_: AddTenantRequest, presenter: AddTenantPresentation) => {
        const errors = new Map<NewTenantFields, string>()
        errors.set(NewTenantFields.description, 'Description required')
        presenter.notifyNewTenantFieldError(errors)
        return errors
      })
      .build()
    const controller = new AddTenantController(
      useCase,
      new AddTenantPresenter(new FakeNavigation())
    )

    // When
    controller.validateTenantDescription('')

    // Then
    expect(controller.vm.tenantDescriptionError).toBe('Description required')
    expect(controller.vm.tenantDescriptionTouched).toBeTruthy()
    expect(controller.vm.canCreateTenant).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display tenant error on validate app id', () => {
    // Given
    const useCase = new AddTenantUseCaseBuilder()
      .withValidate((_: AddTenantRequest, presenter: AddTenantPresentation) => {
        const errors = new Map<NewTenantFields, string>()
        errors.set(NewTenantFields.appId, 'Labels required')
        presenter.notifyNewTenantFieldError(errors)
        return errors
      })
      .build()
    const controller = new AddTenantController(
      useCase,
      new AddTenantPresenter(new FakeNavigation())
    )

    // When
    controller.validateTenantLabels(new Map().set('com.orange.repository.orangecarto/id', ''))

    // Then
    expect(controller.vm.tenantLabelsError).toBe('Labels required')
    expect(controller.vm.tenantLabelsTouched).toBeTruthy()
    expect(controller.vm.canCreateTenant).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display tenant error on create', () => {
    // Given
    const useCase = new AddTenantUseCaseBuilder()
      .withExecute((_: AddTenantRequest, presenter: AddTenantPresentation) => {
        const errors = new Map<NewTenantFields, string>()
        errors.set(NewTenantFields.name, 'Tenant name required')
        errors.set(NewTenantFields.description, 'Description required')
        errors.set(NewTenantFields.appId, 'Labels required')
        presenter.notifyNewTenantFieldError(errors)
        return Promise.resolve()
      })
      .build()
    const controller = new AddTenantController(
      useCase,
      new AddTenantPresenter(new FakeNavigation())
    )

    // When
    controller.create()

    // Then
    expect(controller.vm.canCreateTenant).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display tenant notification on create', () => {
    // Given
    const tenantName = 'tenant-test'
    const useCase = new AddTenantUseCaseBuilder()
      .withExecute((_: AddTenantRequest, presenter: AddTenantPresentation) => {
        const tenant: Tenant = new TenantBuilder().withName(tenantName).build()
        presenter.notifyTenantAdded(tenant)
        return Promise.resolve()
      })
      .build()

    const controller = new AddTenantController(
      useCase,
      new AddTenantPresenter(new FakeNavigation())
    )

    // When
    controller.create()

    // Then
    expect(controller.vm.displayAlert).toBeTruthy()
    expect(controller.vm.alert.title).toBe('success')
    expect(controller.vm.alert.details).toBe('yourTenantHasBeenCreated')
  })

  test('display notification on repository error', () => {
    // Given
    const useCase = new AddTenantUseCaseBuilder()
      .withExecute((_: AddTenantRequest, presenter: AddTenantPresentation) => {
        const tenant: Tenant = new TenantBuilder().withName('tenant-test').build()
        presenter.notifyAddTenantError('API Error !')
        return Promise.resolve()
      })
      .build()

    const controller = new AddTenantController(
      useCase,
      new AddTenantPresenter(new FakeNavigation())
    )

    // When
    controller.create()

    // Then
    expect(controller.vm.displayAlert).toBeTruthy()
    expect(controller.vm.alert.title).toBe('error')
    expect(controller.vm.alert.details).toBe('API Error !')
  })

  test('redirect to tenant on create success', async () => {
    // Given
    const tenant = new TenantBuilder()
      .withName('tenant-test-x')
      .withLabels(new Map().set('com.orange.repository.orangecarto/id', '10'))
      .withDescription('description')
      .build()
    const navigation = new FakeNavigation()

    await new Promise<void>((resolve) => {
      const useCase = new AddTenantUseCaseBuilder()
        .withExecute((_: AddTenantRequest, presenter: AddTenantPresentation) => {
          presenter.notifyTenantAdded(tenant)
          return Promise.resolve().then(() => resolve())
        })
        .build()
      const controller = new AddTenantController(useCase, new AddTenantPresenter(navigation))

      // When
      controller.create()
    })

    // Then
    expect(navigation.currentRoute).toBe(NavigationRoute.TENANTS)
  })
})
