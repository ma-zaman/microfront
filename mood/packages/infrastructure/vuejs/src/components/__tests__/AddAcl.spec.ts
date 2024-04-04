import { describe, test, expect, vi } from 'vitest'
import { fireEvent, render, RenderResult } from '@testing-library/vue'

import {
  AddAclController,
  AddAclControllerBuilder,
  AddAclControllerFactory,
  AddAclPresenterVM,
  Alerter
} from '@mood/web-adapters'

import AddAcl from '@/components/AclForm.vue'
import { ADD_ACL_CONTROLLER_FACTORY, ALERT } from '@/DependencyInjection'
import i18n from '@/plugins/i18n'

describe('AddAclComponent', () => {
  test('create acl on form submit', async () => {
    const isAclCreated = await new Promise((resolve) => {
      // Given

      const AddAclVm = new AddAclPresenterVM()
      const controller = new AddAclControllerBuilder(AddAclVm)
        .withCreate(() => {
          resolve(true)
          return Promise.resolve()
        })
        .build()
      const ui = new AddAclComponentBuilder().withController(controller).build()
      // When
      ui.submitForm()

      // Check alert has been triggered
      expect(ui.triggeredAlert).toHaveBeenCalled()
    })
    // Then
    expect(isAclCreated).toBeTruthy()
  })

  test('display error on acl input', () => {
    // Given
    const AddAclVm = new AddAclPresenterVM()
    AddAclVm.aclOwnerError = 'Owner required'
    const controller = new AddAclControllerBuilder(AddAclVm).build()

    // When
    const ui = new AddAclComponentBuilder().withController(controller).build()

    // Then
    const error = ui.getAclOwnerError()
    expect(error).toBe('Owner required')
  })

  test('cannot submit form on error', () => {
    // Given
    const AddAclVm = new AddAclPresenterVM()
    AddAclVm.canCreateAcl = false
    const controller = new AddAclControllerBuilder(AddAclVm).build()

    // When
    const ui = new AddAclComponentBuilder().withController(controller).build()

    // Then
    expect(ui.isFormDisabled()).toBeTruthy()
  })
})

class AddAclComponentBuilder {
  private controller!: AddAclController
  private fakeAlert = { triggerAlert: vi.fn() }

  withController(controller: AddAclController) {
    this.controller = controller
    return this
  }

  build() {
    const presenterFactory = { build: () => this.controller } as AddAclControllerFactory
    const screen = render(AddAcl, {
      global: {
        provide: {
          [ADD_ACL_CONTROLLER_FACTORY as symbol]: presenterFactory,
          [ALERT as symbol]: this.fakeAlert
        },
        plugins: [i18n]
      }
    })
    return new AddAclComponentWrapper(screen, this.fakeAlert)
  }
}

class AddAclComponentWrapper {
  constructor(
    private readonly component: RenderResult,
    private alert: Alerter
  ) {}

  triggeredAlert() {
    return this.alert.triggerAlert
  }

  getAclOwnerError() {
    return this.component.getByTestId('aclOwnerError').textContent
  }

  isFormDisabled() {
    return this.component.getByTestId('submitBtn').hasAttribute('disabled')
  }

  submitForm() {
    return fireEvent.submit(this.component.getByRole('form', { hidden: true }))
  }
}
