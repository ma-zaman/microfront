import { describe, test, expect, vi } from 'vitest'
import { fireEvent, render, RenderResult } from '@testing-library/vue'

import {
  AddInstanceController,
  AddInstanceControllerBuilder,
  AddInstanceControllerFactory,
  AddInstancePresenterVM,
  Alerter
} from '@mood/web-adapters'

import AddInstance from '@/components/InstanceForm.vue'
import { ADD_INSTANCE_CONTROLLER_FACTORY, ALERT } from '@/DependencyInjection'
import i18n from '@/plugins/i18n'

describe('AddInstanceComponent', () => {
  test('create instance on form submit', async () => {
    const isInstanceCreated = await new Promise((resolve) => {
      // Given

      const AddInstanceVm = new AddInstancePresenterVM()
      const controller = new AddInstanceControllerBuilder(AddInstanceVm)
        .withCreate(() => {
          resolve(true)
          return Promise.resolve()
        })
        .build()
      const ui = new AddInstanceComponentBuilder().withController(controller).build()
      // When
      ui.submitForm()

      // Check alert has been triggered
      expect(ui.triggeredAlert).toHaveBeenCalled()
    })
    // Then
    expect(isInstanceCreated).toBeTruthy()
  })

  test('display error on instance name input', () => {
    // Given
    const AddInstanceVm = new AddInstancePresenterVM()
    AddInstanceVm.instanceNameError = 'Name required'
    const controller = new AddInstanceControllerBuilder(AddInstanceVm).build()

    // When
    const ui = new AddInstanceComponentBuilder().withController(controller).build()

    // Then
    const error = ui.getInstanceNameError()
    expect(error).toBe('Name required')
  })

  test('cannot submit form on error', () => {
    // Given
    const AddInstanceVm = new AddInstancePresenterVM()
    AddInstanceVm.canCreateInstance = false
    const controller = new AddInstanceControllerBuilder(AddInstanceVm).build()

    // When
    const ui = new AddInstanceComponentBuilder().withController(controller).build()

    // Then
    expect(ui.isFormDisabled()).toBeTruthy()
  })
})

class AddInstanceComponentBuilder {
  private controller!: AddInstanceController
  private fakeAlert = { triggerAlert: vi.fn() }

  withController(controller: AddInstanceController) {
    this.controller = controller
    return this
  }

  build() {
    const presenterFactory = { build: () => this.controller } as AddInstanceControllerFactory
    const screen = render(AddInstance, {
      global: {
        provide: {
          [ADD_INSTANCE_CONTROLLER_FACTORY as symbol]: presenterFactory,
          [ALERT as symbol]: this.fakeAlert
        },
        plugins: [i18n]
      }
    })
    return new AddInstanceComponentWrapper(screen, this.fakeAlert)
  }
}

class AddInstanceComponentWrapper {
  constructor(
    private readonly component: RenderResult,
    private alert: Alerter
  ) {}

  triggeredAlert() {
    return this.alert.triggerAlert
  }

  getInstanceNameError() {
    return this.component.getByTestId('instanceNameError').textContent
  }

  isFormDisabled() {
    return this.component.getByTestId('submitBtn').hasAttribute('disabled')
  }

  submitForm() {
    return fireEvent.submit(this.component.getByRole('form', { hidden: true }))
  }
}
