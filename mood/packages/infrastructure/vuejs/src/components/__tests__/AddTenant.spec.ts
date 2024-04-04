import { describe, test, expect, vi } from 'vitest'
import { fireEvent, render, RenderResult } from '@testing-library/vue'

import {
  AddTenantController,
  AddTenantControllerBuilder,
  AddTenantControllerFactory,
  AddTenantPresenterVM,
  Alerter
} from '@mood/web-adapters'

import AddTenant from '@/components/TenantForm.vue'
import { ADD_TENANT_CONTROLLER_FACTORY, ALERT } from '@/DependencyInjection'
import i18n from '@/plugins/i18n'

describe('AddTenantComponent', () => {
  test('create tenant on form submit', async () => {
    const isTenantCreated = await new Promise((resolve) => {
      // Given

      const AddTenantVm = new AddTenantPresenterVM()
      const controller = new AddTenantControllerBuilder(AddTenantVm)
        .withCreate(() => {
          resolve(true)
          return Promise.resolve()
        })
        .build()
      const ui = new AddTenantComponentBuilder().withController(controller).build()
      // When
      ui.submitForm()

      // Check alert has been triggered
      expect(ui.triggeredAlert).toHaveBeenCalled()
    })
    // Then
    expect(isTenantCreated).toBeTruthy()
  })

  test('display error on tenant name', () => {
    // Given
    const AddTenantVm = new AddTenantPresenterVM()
    AddTenantVm.tenantNameError = 'Tenant required'
    const controller = new AddTenantControllerBuilder(AddTenantVm).build()

    // When
    const ui = new AddTenantComponentBuilder().withController(controller).build()

    // Then
    const error = ui.getTenantNameError()
    expect(error).toBe('Tenant required')
  })

  test('display error on tenant description', () => {
    // Given
    const AddTenantVm = new AddTenantPresenterVM()
    AddTenantVm.tenantDescriptionError = 'Description required'
    const controller = new AddTenantControllerBuilder(AddTenantVm).build()

    // When
    const ui = new AddTenantComponentBuilder().withController(controller).build()

    // Then
    const error = ui.getDescriptionError()
    expect(error).toBe('Description required')
  })

  test('display error on tenant labels', () => {
    // Given
    const AddTenantVm = new AddTenantPresenterVM()
    AddTenantVm.tenantLabelsError = 'Labels required'
    const controller = new AddTenantControllerBuilder(AddTenantVm).build()

    // When
    const ui = new AddTenantComponentBuilder().withController(controller).build()

    // Then
    const error = ui.getLabelsError()
    expect(error).toBe('Labels required')
  })

  test('cannot submit form on error', () => {
    // Given
    const AddTenantVm = new AddTenantPresenterVM()
    AddTenantVm.canCreateTenant = false
    const controller = new AddTenantControllerBuilder(AddTenantVm).build()

    // When
    const ui = new AddTenantComponentBuilder().withController(controller).build()

    // Then
    expect(ui.isFormDisabled()).toBeTruthy()
  })

  test('validate tenant name on input change', async () => {
    const updatedTenantName = await new Promise((resolve) => {
      // Given
      const controller = new AddTenantControllerBuilder()
        .withValidateTenantName((tenantName: string) => {
          resolve(tenantName)
          return Promise.resolve()
        })
        .build()
      const ui = new AddTenantComponentBuilder().withController(controller).build()

      // When
      ui.updateTenantName('my-new-tenant')
    })

    // Then
    expect(updatedTenantName).toBe('my-new-tenant')
  })

  test('validate tenant description on input change', async () => {
    const updatedDescription = await new Promise((resolve) => {
      // Given
      const controller = new AddTenantControllerBuilder()
        .withValidateTenantDescription((tenantDescription: string) => {
          resolve(tenantDescription)
          return Promise.resolve()
        })
        .build()
      const ui = new AddTenantComponentBuilder().withController(controller).build()

      // When
      ui.updateDescription('My new description')
    })

    // Then
    expect(updatedDescription).toBe('My new description')
  })

  test('validate tenant labels on input change', async () => {
    const updatedLabels = await new Promise((resolve) => {
      // Given
      const controller = new AddTenantControllerBuilder()
        .withValidateTenantLabels((tenantLabels: Map<string, string>) => {
          resolve(tenantLabels)
          return Promise.resolve()
        })
        .build()
      const ui = new AddTenantComponentBuilder().withController(controller).build()

      // When
      ui.updateLabels('123456')
    })

    // Then
    expect(updatedLabels).toStrictEqual(
      new Map<string, string>().set('com.orange.repository.orangecarto/id', '123456')
    )
  })
})

class AddTenantComponentBuilder {
  private controller!: AddTenantController
  private fakeAlert = { triggerAlert: vi.fn() }

  withController(controller: AddTenantController) {
    this.controller = controller
    return this
  }

  build() {
    const presenterFactory = { build: () => this.controller } as AddTenantControllerFactory
    const screen = render(AddTenant, {
      global: {
        provide: {
          [ADD_TENANT_CONTROLLER_FACTORY as symbol]: presenterFactory,
          [ALERT as symbol]: this.fakeAlert
        },
        plugins: [i18n]
      }
    })
    return new AddTenantComponentWrapper(screen, this.fakeAlert)
  }
}

class AddTenantComponentWrapper {
  constructor(
    private readonly component: RenderResult,
    private alert: Alerter
  ) {}

  triggeredAlert() {
    return this.alert.triggerAlert
  }

  getDescriptionError() {
    return this.component.getByLabelText('description error').textContent
  }

  getTenantNameError() {
    return this.component.getByLabelText('tenant name error').textContent
  }

  getLabelsError() {
    return this.component.getByLabelText('labels error').textContent
  }

  isFormDisabled() {
    return this.component.getByTestId('submitBtn').hasAttribute('disabled')
  }

  updateTenantName(value: string) {
    this.updateInput('tenantNameField', value)
  }

  updateDescription(value: string) {
    this.updateInput('tenantDescriptionField', value)
  }

  updateLabels(value: string) {
    this.updateInput('tenantLabelField', value)
  }

  private updateInput(selector: string, value: string) {
    fireEvent.update(this.component.getByTestId(selector), value)
  }

  submitForm() {
    return fireEvent.submit(this.component.getByRole('form', { hidden: true }))
  }
}
