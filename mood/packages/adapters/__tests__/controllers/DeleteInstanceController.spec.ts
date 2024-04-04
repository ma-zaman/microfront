import {
  DeleteInstancePresentation,
  DeleteInstanceRequest,
  InstanceBuilder,
  DeleteInstanceFields
} from '@mood/domain'
import {
  DeleteInstanceController,
  DeleteInstancePresenter,
  FakeNavigation,
  NavigationRoute
} from '@mood/web-adapters'
import { describe, test, expect } from 'vitest'
import { DeleteInstanceUseCaseBuilder } from '../builders/DeleteInstanceCaseBuilder'
import { UUID } from 'crypto'

describe('DeleteInstanceController', () => {
  test('display instance error on validate id', () => {
    // Given
    const useCase = new DeleteInstanceUseCaseBuilder()
      .withValidate((_: DeleteInstanceRequest, presenter: DeleteInstancePresentation) => {
        const errors = new Map<DeleteInstanceFields, string>()
        errors.set(DeleteInstanceFields.id, 'Instance id required')
        presenter.notifyDeleteInstanceFieldError(errors)
        return errors
      })
      .build()

    const controller = new DeleteInstanceController(
      useCase,
      new DeleteInstancePresenter(new FakeNavigation())
    )

    // When
    controller.validateInstanceId('' as UUID)

    // Then
    expect(controller.vm.instanceIdError).toBe('Instance id required')
    expect(controller.vm.instanceIdTouched).toBeTruthy()
    expect(controller.vm.canDeleteInstance).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display instance error on delete', () => {
    // Given
    const useCase = new DeleteInstanceUseCaseBuilder()
      .withExecute((_: DeleteInstanceRequest, presenter: DeleteInstancePresentation) => {
        const errors = new Map<DeleteInstanceFields, string>()
        errors.set(DeleteInstanceFields.name, 'Instance name required')
        presenter.notifyDeleteInstanceFieldError(errors)
        return Promise.resolve()
      })
      .build()
    const controller = new DeleteInstanceController(
      useCase,
      new DeleteInstancePresenter(new FakeNavigation())
    )

    // When
    controller.delete()

    // Then
    expect(controller.vm.canDeleteInstance).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('check redirection after deleting instance with success', async () => {
    // Given
    const instance = new InstanceBuilder()
      .withName('instance-test-x')
      .withDescription('description')
      .withVisibility('internal')
      .withInstanceType('prometheus')
      .withTenantName('tenant0')
      .withTenantId(crypto.randomUUID())
      .build()
    const navigation = new FakeNavigation()

    await new Promise<void>((resolve) => {
      const useCase = new DeleteInstanceUseCaseBuilder()
        .withExecute((_: DeleteInstanceRequest, presenter: DeleteInstancePresentation) => {
          presenter.notifyInstanceDeleted(instance)
          return Promise.resolve().then(() => resolve())
        })
        .build()
      const controller = new DeleteInstanceController(
        useCase,
        new DeleteInstancePresenter(navigation)
      )

      // When
      controller.delete()
    })

    // Then
    expect(navigation.currentRoute).toBe(NavigationRoute.INSTANCES)
  })

  test('Alert is triggered when deleting instance with success', async () => {
    // Given
    const instance = new InstanceBuilder()
      .withName('instance-test-x')
      .withDescription('description')
      .withVisibility('internal')
      .withInstanceType('prometheus')
      .withTenantName('tenant0')
      .withTenantId(crypto.randomUUID())
      .build()
    const navigation = new FakeNavigation()

    await new Promise<void>((resolve) => {
      const useCase = new DeleteInstanceUseCaseBuilder()
        .withExecute((_: DeleteInstanceRequest, presenter: DeleteInstancePresentation) => {
          presenter.notifyInstanceDeleted(instance)
          return Promise.resolve().then(() => resolve())
        })
        .build()
      const controller = new DeleteInstanceController(
        useCase,
        new DeleteInstancePresenter(navigation)
      )

      // When
      controller.delete()
      // Then
      expect(controller.vm.displayAlert).toBeTruthy()
      expect(controller.vm.alert.details).toBe('theInstanceHasBeenDeleted')
    })
  })
})
