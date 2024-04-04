import {
  UpdateInstancePresentation,
  UpdateInstanceRequest,
  InstanceBuilder,
  UpdateInstanceFields,
  Instance,
  InstanceTypes
} from '@mood/domain'
import {
  UpdateInstanceController,
  UpdateInstancePresenter,
  FakeNavigation,
  NavigationRoute
} from '@mood/web-adapters'
import { UpdateInstanceUseCaseBuilder } from '../builders/UpdateInstanceCaseBuilder'
import { describe, test, expect } from 'vitest'
import { UUID } from 'crypto'

describe('UpdateInstanceController', () => {
  test('display instance error on validate Name', () => {
    // Given
    const useCase = new UpdateInstanceUseCaseBuilder()
      .withValidate((_: UpdateInstanceRequest, presenter: UpdateInstancePresentation) => {
        const errors = new Map<UpdateInstanceFields, string>()
        errors.set(UpdateInstanceFields.name, 'Instance Name required')
        presenter.notifyUpdateInstanceFieldError(errors)
        return errors
      })
      .build()

    const controller = new UpdateInstanceController(
      useCase,
      new UpdateInstancePresenter(new FakeNavigation())
    )

    // When
    controller.validateInstanceName('')

    // Then
    expect(controller.vm.instanceNameError).toBe('Instance Name required')
    expect(controller.vm.instanceNameTouched).toBeTruthy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display instance error on validate InstanceType', () => {
    // Given
    const useCase = new UpdateInstanceUseCaseBuilder()
      .withValidate((_: UpdateInstanceRequest, presenter: UpdateInstancePresentation) => {
        const errors = new Map<UpdateInstanceFields, string>()
        errors.set(UpdateInstanceFields.instanceType, 'InstanceType required')
        presenter.notifyUpdateInstanceFieldError(errors)
        return errors
      })
      .build()
    const controller = new UpdateInstanceController(
      useCase,
      new UpdateInstancePresenter(new FakeNavigation())
    )

    // When
    controller.validateInstanceType('' as InstanceTypes)

    // Then
    expect(controller.vm.instanceTypeError).toBe('InstanceType required')
    expect(controller.vm.instanceTypeTouched).toBeTruthy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display instance error on validate TenantName', () => {
    // Given
    const useCase = new UpdateInstanceUseCaseBuilder()
      .withValidate((_: UpdateInstanceRequest, presenter: UpdateInstancePresentation) => {
        const errors = new Map<UpdateInstanceFields, string>()
        errors.set(UpdateInstanceFields.tenantName, 'TenantName required')
        presenter.notifyUpdateInstanceFieldError(errors)
        return errors
      })
      .build()
    const controller = new UpdateInstanceController(
      useCase,
      new UpdateInstancePresenter(new FakeNavigation())
    )

    // When
    controller.validateInstanceTenantName('')

    // Then
    expect(controller.vm.instanceTenantNameError).toBe('TenantName required')
    expect(controller.vm.instanceTenantNameTouched).toBeTruthy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display instance error on validate TenantId', () => {
    // Given
    const useCase = new UpdateInstanceUseCaseBuilder()
      .withValidate((_: UpdateInstanceRequest, presenter: UpdateInstancePresentation) => {
        const errors = new Map<UpdateInstanceFields, string>()
        errors.set(UpdateInstanceFields.tenantId, 'TenantId required')
        presenter.notifyUpdateInstanceFieldError(errors)
        return errors
      })
      .build()
    const controller = new UpdateInstanceController(
      useCase,
      new UpdateInstancePresenter(new FakeNavigation())
    )

    // When
    controller.validateInstanceTenantId('' as UUID)

    // Then
    expect(controller.vm.instanceTenantIdError).toBe('TenantId required')
    expect(controller.vm.instanceTenantIdTouched).toBeTruthy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display instance error on update', () => {
    // Given
    const useCase = new UpdateInstanceUseCaseBuilder()
      .withExecute((_: UpdateInstanceRequest, presenter: UpdateInstancePresentation) => {
        const errors = new Map<UpdateInstanceFields, string>()
        errors.set(UpdateInstanceFields.name, 'Instance name required')
        errors.set(UpdateInstanceFields.instanceType, 'InstanceType required')
        errors.set(UpdateInstanceFields.tenantId, 'TenantId required')
        errors.set(UpdateInstanceFields.tenantName, 'TenantName required')
        presenter.notifyUpdateInstanceFieldError(errors)
        return Promise.resolve()
      })
      .build()
    const controller = new UpdateInstanceController(
      useCase,
      new UpdateInstancePresenter(new FakeNavigation())
    )

    // When
    controller.update()

    // Then
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display instance notification on update', () => {
    // Given
    const useCase = new UpdateInstanceUseCaseBuilder()
      .withExecute((_: UpdateInstanceRequest, presenter: UpdateInstancePresentation) => {
        const instance: Instance = new InstanceBuilder()
          .withName('vm-00')
          .withInstanceType('victoria')
          .withDescription('desc vm-00')
          .withVisibility('internal')
          .withTenantName('tenant-test')
          .withTenantId('00000000-0000-0000-0000-000000000000')
          .build()
        presenter.notifyInstanceUpdated(instance)
        return Promise.resolve()
      })
      .build()

    const controller = new UpdateInstanceController(
      useCase,
      new UpdateInstancePresenter(new FakeNavigation())
    )

    // When
    controller.update()

    // Then
    expect(controller.vm.displayAlert).toBeTruthy()
    expect(controller.vm.alert.title).toBe('success')
    expect(controller.vm.alert.details).toBe('yourInstanceHasBeenUpdated')
  })

  test('display notification on repository error', () => {
    // Given
    const useCase = new UpdateInstanceUseCaseBuilder()
      .withExecute((_: UpdateInstanceRequest, presenter: UpdateInstancePresentation) => {
        const instance: Instance = new InstanceBuilder().build()
        presenter.notifyUpdateInstanceError('API Error !')
        return Promise.resolve()
      })
      .build()

    const controller = new UpdateInstanceController(
      useCase,
      new UpdateInstancePresenter(new FakeNavigation())
    )

    // When
    controller.update()

    // Then
    expect(controller.vm.displayAlert).toBeTruthy()
    expect(controller.vm.alert.title).toBe('error')
    expect(controller.vm.alert.details).toBe('API Error !')
  })
})
