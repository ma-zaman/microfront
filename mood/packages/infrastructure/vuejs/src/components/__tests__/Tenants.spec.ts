import {
  DeleteTenantController,
  DeleteTenantControllerBuilder,
  DeleteTenantControllerFactory,
  DeleteTenantPresenterVM,
  TenantsController,
  TenantsControllerBuilder,
  TenantsControllerFactory,
  TenantsPresenterVM
} from '@mood/web-adapters'
import { TenantBuilder } from '@mood/domain'
import { DELETE_TENANT_CONTROLLER_FACTORY, TENANTS_CONTROLLER_FACTORY } from '@/DependencyInjection'
import { fireEvent, render, RenderResult } from '@testing-library/vue'
import TenantManagerComponent from '@/views/ManageTenant.vue'
import { describe, test, expect } from 'vitest'
import i18n from '@/plugins/i18n'
import vuetify from '@/plugins/vuetify'

global.ResizeObserver = await require('resize-observer-polyfill')

describe('ManageTenant component', () => {
  function givenTenantControllers() {
    const tenantsVm = new TenantsPresenterVM()
    const deleteTenantVm = new DeleteTenantPresenterVM()

    const tenantsController = new TenantsControllerBuilder(tenantsVm).build()
    const deleteTenantController = new DeleteTenantControllerBuilder(deleteTenantVm).build()
    return { tenantsController, deleteTenantController }
  }

  function whenCreateTenantsComponent(
    tenantsController: TenantsController,
    deleteTenantController: DeleteTenantController
  ) {
    return new TenantsComponentBuilder()
      .withTenantsController(tenantsController)
      .withDeleteTenantController(deleteTenantController)
      .build()
  }

  test('Display loading when fetch data', () => {
    // Given
    const tenantsVm = new TenantsPresenterVM()
    const deleteTenantVm = new DeleteTenantPresenterVM()
    const deleteTenantController = new DeleteTenantControllerBuilder(deleteTenantVm).build()

    // When
    tenantsVm.loading = true
    const tenantsController = new TenantsControllerBuilder(tenantsVm).build()
    const ui = new TenantsComponentBuilder()
      .withTenantsController(tenantsController)
      .withDeleteTenantController(deleteTenantController)
      .build()

    // Then
    expect(ui.isDisplayingLoading()).toBeTruthy()
  })

  test('Display tenants', () => {
    // Given
    const tenantsVm = new TenantsPresenterVM()

    const deleteTenantVm = new DeleteTenantPresenterVM()

    const tenantBuilder = new TenantBuilder()

    const tenant0 = tenantBuilder
      .withName('tenant0')
      .withDescription('desc0')
      .withLabels({ 'com.orange.repository.orangecarto/id': '00000' })
      .build()

    const tenant1 = tenantBuilder
      .withName('tenant1')
      .withDescription('desc1')
      .withLabels({ 'com.orange.repository.orangecarto/id': '11111' })
      .build()

    tenantsVm.tenants = [tenant0, tenant1]
    tenantsVm.loading = false
    const tenantsController = new TenantsControllerBuilder(tenantsVm).build()
    const deleteTenantController = new DeleteTenantControllerBuilder(deleteTenantVm).build()

    // When
    const ui = whenCreateTenantsComponent(tenantsController, deleteTenantController)

    // Then
    const tenantsName = ui.getTenantsDisplay()
    ui.isContainingColumns(['test'])
    expect(tenantsName).toEqual(['tenant0', 'desc0', '00000', 'tenant1', 'desc1', '11111'])
  })

  test('fetch tenants on init', async () => {
    const hasFetch = await new Promise<boolean>((resolve) => {
      // Given
      const controller = new TenantsControllerBuilder()
        .withFetchTenants(() => {
          resolve(true)
          return Promise.resolve()
        })
        .build()

      // When
      new TenantsComponentBuilder().withTenantsController(controller).build()
    })

    // Then
    expect(hasFetch).toBeTruthy()
  })

  test('3 columns name, orange carto id and description are on the table', () => {
    const { tenantsController, deleteTenantController } = givenTenantControllers()
    const ui = whenCreateTenantsComponent(tenantsController, deleteTenantController)

    // Then
    expect(ui.isContainingColumns(['Tenant', 'Description', 'ID Orange Carto'])).toBeTruthy()
  })

  test('research field is displayed', () => {
    const { tenantsController, deleteTenantController } = givenTenantControllers()
    const ui = whenCreateTenantsComponent(tenantsController, deleteTenantController)

    // Then
    expect(ui.isDisplayingResearch()).toBeTruthy()
  })

  test('sort by ascending or descending is possible', () => {
    const { tenantsController, deleteTenantController } = givenTenantControllers()
    const ui = whenCreateTenantsComponent(tenantsController, deleteTenantController)

    // Then
    expect(ui.isColumnsSortable(['Tenant', 'Description', 'ID Orange Carto'])).toBeTruthy()
  })

  test('Pagination on table is done', () => {
    const { tenantsController, deleteTenantController } = givenTenantControllers()
    const ui = whenCreateTenantsComponent(tenantsController, deleteTenantController)

    // Then
    expect(ui.isContainingPagination()).toBeTruthy()
  })

  test('A button + to add tenant is displayed', () => {
    // Given
    const { tenantsController, deleteTenantController } = givenTenantControllers()
    const ui = whenCreateTenantsComponent(tenantsController, deleteTenantController)

    // Then
    expect(ui.isDisplayButtonToAddTenant()).toBeTruthy()
  })

  test('Click on add tenant button must open a modal', async () => {
    // Given
    const { tenantsController, deleteTenantController } = givenTenantControllers()

    // When
    const ui = whenCreateTenantsComponent(tenantsController, deleteTenantController)
    const addTenantButton = ui.buttonToAddTenant()

    // Then
    expect(ui.isModalOpen()).toBeFalsy()
    expect(addTenantButton).toBeDefined()
    await fireEvent.click(addTenantButton!)
    // TODO
    // await waitFor(() => {
    //   expect(ui.isModalOpen()).toBeTruthy()
    // })
  })

  test('Edit button is available', async () => {
    // Given

    const tenantsVm = new TenantsPresenterVM()

    const deleteTenantVm = new DeleteTenantPresenterVM()

    const tenantBuilder = new TenantBuilder()
    const tenant0 = tenantBuilder
      .withName('tenant0')
      .withDescription('desc0')
      .withLabels({ 'com.orange.repository.orangecarto/id': '00000' })
      .build()

    const tenant1 = tenantBuilder
      .withName('tenant1')
      .withDescription('desc1')
      .withLabels({ 'com.orange.repository.orangecarto/id': '11111' })
      .build()

    tenantsVm.tenants = [tenant0, tenant1]
    tenantsVm.loading = false
    const tenantsController = new TenantsControllerBuilder(tenantsVm).build()
    const deleteTenantController = new DeleteTenantControllerBuilder(deleteTenantVm).build()
    // When
    const ui = whenCreateTenantsComponent(tenantsController, deleteTenantController)

    // Then
    expect(ui.isDisplayEditButton()).toBeTruthy()
    expect(ui.isDisplayEditButton(2)).toBeTruthy()
  })

  test('Delete button is available', async () => {
    const tenantsVm = new TenantsPresenterVM()

    const deleteTenantVm = new DeleteTenantPresenterVM()

    const tenantBuilder = new TenantBuilder()
    const tenant0 = tenantBuilder
      .withName('tenant0')
      .withDescription('desc0')
      .withLabels({ 'com.orange.repository.orangecarto/id': '00000' })
      .build()

    const tenant1 = tenantBuilder
      .withName('tenant1')
      .withDescription('desc1')
      .withLabels({ 'com.orange.repository.orangecarto/id': '11111' })
      .build()

    tenantsVm.tenants = [tenant0, tenant1]
    tenantsVm.loading = false
    const tenantsController = new TenantsControllerBuilder(tenantsVm).build()
    const deleteTenantController = new DeleteTenantControllerBuilder(deleteTenantVm).build()
    // When
    const ui = whenCreateTenantsComponent(tenantsController, deleteTenantController)

    // Then
    expect(ui.isDisplayTrashButton()).toBeTruthy()
    expect(ui.isDisplayTrashButton(2)).toBeTruthy()
  })

  test('Edit button is not available if no tenants are on the list', async () => {
    // Given
    const { tenantsController, deleteTenantController } = givenTenantControllers()

    // When
    const ui = whenCreateTenantsComponent(tenantsController, deleteTenantController)

    // Then
    expect(ui.isDisplayEditButton()).toBeFalsy()
  })

  test('Delete button is not available if no tenants are on the list', async () => {
    const { tenantsController, deleteTenantController } = givenTenantControllers()

    // When
    const ui = whenCreateTenantsComponent(tenantsController, deleteTenantController)

    // Then
    expect(ui.isDisplayTrashButton()).toBeFalsy()
  })
  test('Grafana button is available', async () => {
    const tenantsVm = new TenantsPresenterVM()

    const deleteTenantVm = new DeleteTenantPresenterVM()

    const tenantBuilder = new TenantBuilder()
    const tenant0 = tenantBuilder
      .withName('tenant0')
      .withDescription('desc0')
      .withLabels({ 'com.orange.repository.orangecarto/id': '00000' })
      .withUrl({ grafana: 'http://grafana_url' })
      .build()

    const tenant1 = tenantBuilder
      .withName('tenant1')
      .withDescription('desc1')
      .withLabels({ 'com.orange.repository.orangecarto/id': '11111' })
      .withUrl({ grafana: 'http://grafana_url_2' })
      .build()

    tenantsVm.tenants = [tenant0, tenant1]
    tenantsVm.loading = false
    const tenantsController = new TenantsControllerBuilder(tenantsVm).build()
    const deleteTenantController = new DeleteTenantControllerBuilder(deleteTenantVm).build()
    // When
    const ui = whenCreateTenantsComponent(tenantsController, deleteTenantController)

    // Then
    expect(ui.isDisplayGrafanaButton()).toBeTruthy()
    expect(ui.isDisplayGrafanaButton(2)).toBeTruthy()
  })
  test('Grafana button is not available if no tenants are on the list', async () => {
    const { tenantsController, deleteTenantController } = givenTenantControllers()

    // When
    const ui = whenCreateTenantsComponent(tenantsController, deleteTenantController)

    // Then
    expect(ui.isDisplayGrafanaButton()).toBeFalsy()
  })

  test('Redirect to manage acl correctly when click on tenant manage user', () => {
    const tenantsVm = new TenantsPresenterVM()

    const deleteTenantVm = new DeleteTenantPresenterVM()

    const tenantBuilder = new TenantBuilder()
    const tenant0 = tenantBuilder
      .withName('tenant0')
      .withDescription('desc0')
      .withLabels({ 'com.orange.repository.orangecarto/id': '00000' })
      .withUrl({ grafana: 'http://grafana_url' })
      .build()

    const tenant1 = tenantBuilder
      .withName('tenant1')
      .withDescription('desc1')
      .withLabels({ 'com.orange.repository.orangecarto/id': '11111' })
      .withUrl({ grafana: 'http://grafana_url_2' })
      .build()

    tenantsVm.tenants = [tenant0, tenant1]
    tenantsVm.loading = false
    const tenantsController = new TenantsControllerBuilder(tenantsVm).build()
    const deleteTenantController = new DeleteTenantControllerBuilder(deleteTenantVm).build()
    // When
    const ui = whenCreateTenantsComponent(tenantsController, deleteTenantController)

    // Then
    expect(ui.isDisplayManagementUser()).toBeTruthy()
    expect(ui.isDisplayManagementUser(2)).toBeTruthy()
  })
})

class TenantsComponentBuilder {
  private tenantsController!: TenantsController
  private deleteTenantController!: DeleteTenantController

  withTenantsController(tenantsController: TenantsController) {
    this.tenantsController = tenantsController
    return this
  }

  withDeleteTenantController(deleteTenantController: DeleteTenantController) {
    this.deleteTenantController = deleteTenantController
    return this
  }

  build() {
    const tenantsControllerFactory = {
      build: () => this.tenantsController
    } as TenantsControllerFactory

    const deleteTenantControllerFactory = {
      build: () => this.deleteTenantController
    } as DeleteTenantControllerFactory

    const screen: RenderResult = render(TenantManagerComponent, {
      global: {
        provide: {
          [TENANTS_CONTROLLER_FACTORY as symbol]: tenantsControllerFactory,
          [DELETE_TENANT_CONTROLLER_FACTORY as symbol]: deleteTenantControllerFactory
        },
        stubs: ['TenantForm'],
        plugins: [i18n, vuetify]
      }
    })

    return new TenantsComponentWrapper(screen)
  }
}

class TenantsComponentWrapper {
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

  isDisplayingLoading(): boolean {
    return this.component.baseElement.getElementsByClassName('v-data-table-progress').length !== 0
  }

  buttonToAddTenant(): Element | null {
    return this.component.baseElement.querySelector('[data-testid="add-tenant-btn"]')
  }

  isDisplayButtonToAddTenant(): boolean {
    return this.buttonToAddTenant() !== null
  }

  isModalOpen(): boolean {
    const classModalOpen = this.component.baseElement.getElementsByClassName('modal fade show')
    return classModalOpen.length !== 0
  }

  getTenantsDisplay() {
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

  private isDisplaying(dataTestID: string, numberOfTimes?: number): boolean {
    const element = this.component.baseElement.querySelectorAll(`[data-testid="${dataTestID}"]`)
    if (numberOfTimes === undefined) {
      return element.length !== 0
    }
    return element.length === numberOfTimes
  }

  isDisplayEditButton(numberOfTimes?: number): boolean {
    return this.isDisplaying('edit-tenant-button', numberOfTimes)
  }

  isDisplayGrafanaButton(numberOfTimes?: number): boolean {
    return this.isDisplaying('grafana-tenant-button', numberOfTimes)
  }

  isDisplayManagementUser(numberOfTimes?: number): boolean {
    return this.isDisplaying('manage-acl-tenant-button', numberOfTimes)
  }

  isDisplayTrashButton(numberOfTimes?: number): boolean {
    return this.isDisplaying('delete-tenant-button', numberOfTimes)
  }
}
