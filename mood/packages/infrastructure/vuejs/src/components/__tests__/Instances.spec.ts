import {
  TenantsController,
  TenantsControllerBuilder,
  TenantsControllerFactory,
  TenantsPresenterVM,
  InstancesController,
  InstancesControllerBuilder,
  InstancesControllerFactory,
  InstancesPresenterVM
} from '@mood/web-adapters'
import { InstanceBuilder } from '@mood/domain'
import { TENANTS_CONTROLLER_FACTORY, INSTANCES_CONTROLLER_FACTORY } from '@/DependencyInjection'
import { render, RenderResult } from '@testing-library/vue'
import InstanceManagerComponent from '@/views/ManageInstance.vue'
import { describe, test, expect } from 'vitest'
import i18n from '@/plugins/i18n'
import vuetify from '@/plugins/vuetify'
import { UUID } from 'crypto'
global.ResizeObserver = await require('resize-observer-polyfill')

describe('ManageInstance component', () => {
  function givenControllers() {
    const instancesVm = new InstancesPresenterVM()
    const newLocal = { id: '00000000-0000-0000-0000-000000000000' as UUID, name: '' }
    const instancesController = new InstancesControllerBuilder(instancesVm)
      .withPopStoredTenant(() => Promise.resolve(newLocal))
      .build()

    const tenantsVm = new TenantsPresenterVM()
    const tenantsController = new TenantsControllerBuilder(tenantsVm).build()

    return { instancesController, tenantsController }
  }

  function whenCreateComponent(
    instancesController: InstancesController,
    tenantsController: TenantsController
  ) {
    return new InstancesComponentBuilder()
      .withInstancesController(instancesController)
      .withTenantsController(tenantsController)
      .build()
  }

  test('Check loading display when the loading flag is true', () => {
    // Given
    const { instancesController, tenantsController } = givenControllers()
    instancesController.vm.loading = true

    // When
    const ui = whenCreateComponent(instancesController, tenantsController)

    // Then
    expect(ui.isDisplayingLoading()).toBeTruthy()
  })

  test('Check loading display when the loading flag is false', () => {
    // Given
    const { instancesController, tenantsController } = givenControllers()
    instancesController.vm.loading = false

    // When
    const ui = whenCreateComponent(instancesController, tenantsController)

    // Then
    expect(ui.isDisplayingLoading()).toBeFalsy()
  })

  test('Display instances', () => {
    // Given
    const tenantsVm = new TenantsPresenterVM()
    const instancesVm = new InstancesPresenterVM()
    const instanceBuilder = new InstanceBuilder()

    const instance0 = instanceBuilder
      .withName('prom-test-release')
      .withInstanceType('prometheus')
      .withDescription('desc prom')
      .withVisibility('private')
      .withTenantName('tenant0')
      .withTenantId('33333333-3333-3333-3333-333333333333')
      .build()

    const instance1 = instanceBuilder
      .withName('am-test-release')
      .withInstanceType('alertmanager')
      .withDescription('desc am')
      .withVisibility('internal')
      .withTenantName('tenant0')
      .withTenantId('33333333-3333-3333-3333-333333333333')
      .build()

    instancesVm.tenantName = 'tenant0'
    instancesVm.tenantId = '33333333-3333-3333-3333-333333333333'
    instancesVm.instances = [instance0, instance1]
    instancesVm.loading = false
    const newLocal = { id: '33333333-3333-3333-3333-333333333333' as UUID, name: 'tenant0' }
    const instancesController = new InstancesControllerBuilder(instancesVm)
      .withPopStoredTenant(() => Promise.resolve(newLocal))
      .build()
    const tenantsController = new TenantsControllerBuilder(tenantsVm).build()

    // When
    const ui = whenCreateComponent(instancesController, tenantsController)

    // Then
    const instancesName = ui.getInstancesDisplay()
    ui.isContainingColumns(['test'])
    expect(instancesName).toEqual([
      'prometheus',
      'prom-test-release',
      'desc prom',
      'private',
      'alertmanager',
      'am-test-release',
      'desc am',
      'internal'
    ])
  })

  test('2 columns utilisateur and role are on the table', () => {
    const { instancesController, tenantsController } = givenControllers()
    const ui = whenCreateComponent(instancesController, tenantsController)

    // Then
    expect(ui.isContainingColumns(['Utilisateur', 'Role'])).toBeTruthy()
  })

  test('research field is displayed', () => {
    const { instancesController, tenantsController } = givenControllers()
    const ui = whenCreateComponent(instancesController, tenantsController)

    // Then
    expect(ui.isDisplayingResearch()).toBeTruthy()
  })

  test('sort by ascending or descending is possible', () => {
    const { instancesController, tenantsController } = givenControllers()
    const ui = whenCreateComponent(instancesController, tenantsController)

    // Then
    expect(ui.isColumnsSortable(['Utilisateur', 'Role'])).toBeTruthy()
  })

  test('Pagination on table is done', () => {
    const { instancesController, tenantsController } = givenControllers()
    const ui = whenCreateComponent(instancesController, tenantsController)

    // Then
    expect(ui.isContainingPagination()).toBeTruthy()
  })

  test('Link to instance interface is displaying', () => {
    // Given
    const tenantsVm = new TenantsPresenterVM()
    const instancesVm = new InstancesPresenterVM()
    const instanceBuilder = new InstanceBuilder()

    const instance0 = instanceBuilder.withUrls(['https://my-url.com']).build()

    instancesVm.tenantName = 'tenant0'
    instancesVm.tenantId = '33333333-3333-3333-3333-333333333333'
    instancesVm.instances = [instance0]
    instancesVm.loading = false
    const newLocal = { id: '33333333-3333-3333-3333-333333333333' as UUID, name: 'tenant0' }
    const instancesController = new InstancesControllerBuilder(instancesVm)
      .withPopStoredTenant(() => Promise.resolve(newLocal))
      .build()
    const tenantsController = new TenantsControllerBuilder(tenantsVm).build()

    // When
    const ui = whenCreateComponent(instancesController, tenantsController)
    // Then
    expect(ui.isDisplayInstanceURL()).toBeTruthy()
  })

  test('Link to instance interface is hidden if no instance is displayed', () => {
    const { instancesController, tenantsController } = givenControllers()
    const ui = whenCreateComponent(instancesController, tenantsController)

    // Then
    expect(ui.isDisplayInstanceURL()).toBeFalsy()
  })
})

class InstancesComponentBuilder {
  private instancesController!: InstancesController
  private tenantsController!: TenantsController

  withInstancesController(instancesController: InstancesController) {
    this.instancesController = instancesController
    return this
  }

  withTenantsController(tenantsController: TenantsController) {
    this.tenantsController = tenantsController
    return this
  }

  build() {
    const instancesControllerFactory = {
      build: () => this.instancesController
    } as InstancesControllerFactory

    const tenantsControllerFactory = {
      build: () => this.tenantsController
    } as TenantsControllerFactory

    const screen: RenderResult = render(InstanceManagerComponent, {
      global: {
        provide: {
          [INSTANCES_CONTROLLER_FACTORY as symbol]: instancesControllerFactory,
          [TENANTS_CONTROLLER_FACTORY as symbol]: tenantsControllerFactory
        },
        stubs: ['InstanceForm', 'DeleteInstance'],
        plugins: [i18n, vuetify]
      }
    })

    return new InstancesComponentWrapper(screen)
  }
}

class InstancesComponentWrapper {
  constructor(private readonly component: RenderResult) {}

  isContainingPagination(): boolean {
    return (
      this.component.baseElement.getElementsByClassName('v-data-table-footer__items-per-page')
        .length !== 0
    )
  }

  private checkHTMLInHeaders(
    columns: string[],
    condition: (html: string, column: string) => number
  ): boolean {
    const headers = this.component.baseElement.getElementsByClassName(
      'v-data-table-header__content'
    )
    return Array.from(headers).every((headerElement) => {
      const html = headerElement.innerHTML
      return columns.some((column) => condition(html, column))
    })
  }

  isColumnsSortable(columns: string[]): boolean {
    return this.checkHTMLInHeaders(
      columns,
      (html, column) => html.search(column) && html.search('v-data-table-header__sort')
    )
  }

  isContainingColumns(columns: string[]): boolean {
    return this.checkHTMLInHeaders(columns, (html, column) => html.search(column))
  }

  isDisplayingResearch(): boolean {
    const fields = this.component.baseElement.querySelectorAll('.v-field__field')
    for (const field of fields) {
      if (field.textContent?.includes('Rechercher')) {
        return true
      }
    }
    return false
  }

  private isDisplaying(dataTestID: string, numberOfTimes?: number): boolean {
    const element = this.component.baseElement.querySelectorAll(`[data-testid="${dataTestID}"]`)
    if (numberOfTimes === undefined) {
      return element.length !== 0
    }
    return element.length === numberOfTimes
  }

  isDisplayInstanceURL(numberOfTimes?: number): boolean {
    return this.isDisplaying('instance-external-redirection', numberOfTimes)
  }

  isDisplayingLoading(): boolean {
    return this.component.baseElement.getElementsByClassName('v-data-table-progress').length !== 0
  }

  getInstancesDisplay() {
    const cells: string[] = []
    // Sequential list of values coming from the v-data-table items data
    const rows = this.component.baseElement.getElementsByClassName('v-data-table__tr')
    Array.from(rows).forEach((row) => {
      const cols = row.getElementsByClassName('v-data-table__td')
      Array.from(cols).forEach((col) => {
        if (col.getElementsByClassName('action').length == 0) {
          // If the cell doesn't represent an action (delete...)
          cells.push(col.textContent ?? '')
        }
      })
    })

    return cells
  }
}
