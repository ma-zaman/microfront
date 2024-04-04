import { describe, test, expect } from 'vitest'

import {
  UpdateTenantPresentation,
  UpdateTenantRequest,
  TenantBuilder,
  UpdateTenantFields
} from '@mood/domain'
import { UpdateTenantController, UpdateTenantPresenter, FakeNavigation } from '@mood/web-adapters'

import { UpdateTenantUseCaseBuilder } from '../builders/UpdateTenantCaseBuilder'

describe('UpdateTenantController', () => {
  test('display tenant error on validate name', () => {
    // Given
    const useCase = new UpdateTenantUseCaseBuilder()
      .withValidate((_: UpdateTenantRequest, presenter: UpdateTenantPresentation) => {
        const errors = new Map<UpdateTenantFields, string>()
        errors.set(UpdateTenantFields.name, 'Tenant name required')
        presenter.notifyUpdateTenantFieldError(errors)
        return errors
      })
      .build()

    const controller = new UpdateTenantController(
      useCase,
      new UpdateTenantPresenter(new FakeNavigation())
    )

    const tenant = new TenantBuilder().build()

    // When
    controller.validateTenant(tenant)

    // Then
    expect(controller.vm.tenantNameError).toBe('Tenant name required')
    expect(controller.vm.canUpdateTenant).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display tenant error on validate description', () => {
    // Given
    const useCase = new UpdateTenantUseCaseBuilder()
      .withValidate((_: UpdateTenantRequest, presenter: UpdateTenantPresentation) => {
        const errors = new Map<UpdateTenantFields, string>()
        errors.set(UpdateTenantFields.description, 'Description required')
        presenter.notifyUpdateTenantFieldError(errors)
        return errors
      })
      .build()

    const controller = new UpdateTenantController(
      useCase,
      new UpdateTenantPresenter(new FakeNavigation())
    )

    const tenant = new TenantBuilder().build()

    // When
    controller.validateTenant(tenant)

    // Then
    expect(controller.vm.tenantDescriptionError).toBe('Description required')
    expect(controller.vm.canUpdateTenant).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display tenant error on validate app id', () => {
    // Given
    const useCase = new UpdateTenantUseCaseBuilder()
      .withValidate((_: UpdateTenantRequest, presenter: UpdateTenantPresentation) => {
        const errors = new Map<UpdateTenantFields, string>()
        errors.set(UpdateTenantFields.appId, 'Labels required')
        presenter.notifyUpdateTenantFieldError(errors)
        return errors
      })
      .build()
    const controller = new UpdateTenantController(
      useCase,
      new UpdateTenantPresenter(new FakeNavigation())
    )

    const tenant = new TenantBuilder().build()

    // When
    controller.validateTenant(tenant)

    // Then
    expect(controller.vm.tenantLabelsError).toBe('Labels required')
    expect(controller.vm.canUpdateTenant).toBeFalsy()
  })
  test('display tenant error on create', () => {
    // Given
    const useCase = new UpdateTenantUseCaseBuilder()
      .withExecute((_: UpdateTenantRequest, presenter: UpdateTenantPresentation) => {
        const errors = new Map<UpdateTenantFields, string>()
        errors.set(UpdateTenantFields.name, 'Tenant name required')
        errors.set(UpdateTenantFields.description, 'Description required')
        errors.set(UpdateTenantFields.appId, 'Labels required')
        presenter.notifyUpdateTenantFieldError(errors)
        return Promise.resolve()
      })
      .build()
    const controller = new UpdateTenantController(
      useCase,
      new UpdateTenantPresenter(new FakeNavigation())
    )

    // When
    controller.update()

    // Then
    expect(controller.vm.canUpdateTenant).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('Alert when tenant is updated', () => {
    // Given
    const useCase = new UpdateTenantUseCaseBuilder()
      .withExecute((_: UpdateTenantRequest, presenter: UpdateTenantPresentation) => {
        const tenant = new TenantBuilder().build()
        presenter.notifyTenantUpdated(tenant)
        return Promise.resolve()
      })
      .build()
    const controller = new UpdateTenantController(
      useCase,
      new UpdateTenantPresenter(new FakeNavigation())
    )

    // When
    controller.update()

    // Then
    expect(controller.vm.displayAlert).toBeTruthy()
    expect(controller.vm.alert.details).toBe('yourTenantHasBeenUpdated')
  })
})
