import {
  AddInstancePresentation,
  AddInstanceRequest,
  InstanceBuilder,
  NewInstanceFields,
  Instance,
  InstanceTypes,
  InstanceVisibility
} from '@mood/domain'
import { AddInstanceController, AddInstancePresenter, FakeNavigation } from '@mood/web-adapters'
import { AddInstanceUseCaseBuilder } from '../builders/AddInstanceCaseBuilder'
import { describe, test, expect } from 'vitest'

describe('AddInstanceController', () => {
  test('display instance error on validate name', () => {
    // Given
    const useCase = new AddInstanceUseCaseBuilder()
      .withValidate((_: AddInstanceRequest, presenter: AddInstancePresentation) => {
        const errors = new Map<NewInstanceFields, string>()
        errors.set(NewInstanceFields.name, 'Instance Name required')
        presenter.notifyNewInstanceFieldError(errors)
        return errors
      })
      .build()

    const controller = new AddInstanceController(
      useCase,
      new AddInstancePresenter(new FakeNavigation())
    )

    // When
    controller.validateInstanceName('')

    // Then
    expect(controller.vm.instanceNameError).toBe('Instance Name required')
    expect(controller.vm.instanceNameTouched).toBeTruthy()
    expect(controller.vm.canCreateInstance).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display instance error on validate instanceType', () => {
    // Given
    const useCase = new AddInstanceUseCaseBuilder()
      .withValidate((_: AddInstanceRequest, presenter: AddInstancePresentation) => {
        const errors = new Map<NewInstanceFields, string>()
        errors.set(NewInstanceFields.instanceType, 'instanceType required')
        presenter.notifyNewInstanceFieldError(errors)
        return errors
      })
      .build()
    const controller = new AddInstanceController(
      useCase,
      new AddInstancePresenter(new FakeNavigation())
    )

    // When
    controller.validateInstanceType('' as InstanceTypes)

    // Then
    expect(controller.vm.instanceTypeError).toBe('instanceType required')
    expect(controller.vm.instanceTypeTouched).toBeTruthy()
    expect(controller.vm.canCreateInstance).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display instance error on validate visibility', () => {
    // Given
    const useCase = new AddInstanceUseCaseBuilder()
      .withValidate((_: AddInstanceRequest, presenter: AddInstancePresentation) => {
        const errors = new Map<NewInstanceFields, string>()
        errors.set(NewInstanceFields.visibility, 'Visibility required')
        presenter.notifyNewInstanceFieldError(errors)
        return errors
      })
      .build()
    const controller = new AddInstanceController(
      useCase,
      new AddInstancePresenter(new FakeNavigation())
    )

    // When
    controller.validateInstanceVisibility('' as InstanceVisibility)

    // Then
    expect(controller.vm.instanceVisibilityError).toBe('Visibility required')
    expect(controller.vm.instanceVisibilityTouched).toBeTruthy()
    expect(controller.vm.canCreateInstance).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display instance error on validate TenantName', () => {
    // Given
    const useCase = new AddInstanceUseCaseBuilder()
      .withValidate((_: AddInstanceRequest, presenter: AddInstancePresentation) => {
        const errors = new Map<NewInstanceFields, string>()
        errors.set(NewInstanceFields.tenantName, 'TenantName required')
        presenter.notifyNewInstanceFieldError(errors)
        return errors
      })
      .build()
    const controller = new AddInstanceController(
      useCase,
      new AddInstancePresenter(new FakeNavigation())
    )

    // When
    controller.validateInstanceTenantName('')

    // Then
    expect(controller.vm.instanceTenantNameError).toBe('TenantName required')
    expect(controller.vm.instanceTenantNameTouched).toBeTruthy()
    expect(controller.vm.canCreateInstance).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display instance error on create', () => {
    // Given
    const useCase = new AddInstanceUseCaseBuilder()
      .withExecute((_: AddInstanceRequest, presenter: AddInstancePresentation) => {
        const errors = new Map<NewInstanceFields, string>()
        errors.set(NewInstanceFields.name, 'Instance Name required')
        errors.set(NewInstanceFields.instanceType, 'instanceType required')
        errors.set(NewInstanceFields.visibility, 'Visibility required')
        errors.set(NewInstanceFields.tenantName, 'TenantName required')
        errors.set(NewInstanceFields.tenantName, 'Description required')
        presenter.notifyNewInstanceFieldError(errors)
        return Promise.resolve()
      })
      .build()
    const controller = new AddInstanceController(
      useCase,
      new AddInstancePresenter(new FakeNavigation())
    )

    // When
    controller.create()

    // Then
    expect(controller.vm.canCreateInstance).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display instance notification on create', () => {
    // Given
    const useCase = new AddInstanceUseCaseBuilder()
      .withExecute((_: AddInstanceRequest, presenter: AddInstancePresentation) => {
        const instance: Instance = new InstanceBuilder()
          .withInstanceType('victoria')
          .withName('name')
          .withDescription('description')
          .withVisibility('private')
          .withTenantName('my-tenant')
          .build()
        presenter.notifyInstanceAdded(instance)
        return Promise.resolve()
      })
      .build()

    const controller = new AddInstanceController(
      useCase,
      new AddInstancePresenter(new FakeNavigation())
    )

    // When
    controller.create()

    // Then
    expect(controller.vm.displayAlert).toBeTruthy()
    expect(controller.vm.alert.title).toBe('success')
    expect(controller.vm.alert.details).toBe('yourInstanceHasBeenCreated')
  })

  test('display notification on repository error', () => {
    // Given
    const useCase = new AddInstanceUseCaseBuilder()
      .withExecute((_: AddInstanceRequest, presenter: AddInstancePresentation) => {
        const instance: Instance = new InstanceBuilder().build()
        presenter.notifyAddInstanceError('API Error !')
        return Promise.resolve()
      })
      .build()

    const controller = new AddInstanceController(
      useCase,
      new AddInstancePresenter(new FakeNavigation())
    )

    // When
    controller.create()

    // Then
    expect(controller.vm.displayAlert).toBeTruthy()
    expect(controller.vm.alert.title).toBe('error')
    expect(controller.vm.alert.details).toBe('API Error !')
  })
})
