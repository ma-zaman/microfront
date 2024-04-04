import {
  TenantsController,
  TenantsControllerBuilder,
  TenantsControllerFactory,
  TenantsPresenterVM,
  AclsController,
  AclsControllerBuilder,
  AclsControllerFactory,
  AclsPresenterVM
} from '@mood/web-adapters'
import { AclBuilder } from '@mood/domain'
import { TENANTS_CONTROLLER_FACTORY, USERS_CONTROLLER_FACTORY } from '@/DependencyInjection'
import { render, RenderResult } from '@testing-library/vue'
import AclManagerComponent from '@/views/ManageAcl.vue'
import { describe, test, expect } from 'vitest'
import i18n from '@/plugins/i18n'
import vuetify from '@/plugins/vuetify'
import { UUID } from 'crypto'
global.ResizeObserver = await require('resize-observer-polyfill')

describe('ManageAcl component', () => {
  function givenControllers() {
    const aclsVm = new AclsPresenterVM()
    const newLocal = { id: '00000000-0000-0000-0000-000000000000' as UUID, name: '' }
    const aclsController = new AclsControllerBuilder(aclsVm)
      .withPopStoredTenant(() => Promise.resolve(newLocal))
      .build()

    const tenantsVm = new TenantsPresenterVM()
    const tenantsController = new TenantsControllerBuilder(tenantsVm).build()

    return { aclsController, tenantsController }
  }

  function whenCreateComponent(
    aclsController: AclsController,
    tenantsController: TenantsController
  ) {
    return new AclsComponentBuilder()
      .withAclsController(aclsController)
      .withTenantsController(tenantsController)
      .build()
  }

  test('Check loading display when the loading flag is true', () => {
    // Given
    const { aclsController, tenantsController } = givenControllers()
    aclsController.vm.loading = true

    // When
    const ui = whenCreateComponent(aclsController, tenantsController)

    // Then
    expect(ui.isDisplayingLoading()).toBeTruthy()
  })

  test('Check loading display when the loading flag is false', () => {
    // Given
    const { aclsController, tenantsController } = givenControllers()
    aclsController.vm.loading = false

    // When
    const ui = whenCreateComponent(aclsController, tenantsController)

    // Then
    expect(ui.isDisplayingLoading()).toBeFalsy()
  })

  test('Display acls', () => {
    // Given
    const tenantsVm = new TenantsPresenterVM()
    const aclsVm = new AclsPresenterVM()
    const aclBuilder = new AclBuilder()

    const acl0 = aclBuilder
      .withOwner('user0')
      .withOwnerType('user')
      .withRole('administrator')
      .withTenantName('tenant0')
      .build()

    const acl1 = aclBuilder
      .withOwner('team0')
      .withOwnerType('team')
      .withRole('member')
      .withTenantName('tenant0')
      .build()

    aclsVm.tenantName = 'tenant0'
    aclsVm.acls = [acl0, acl1]
    aclsVm.loading = false
    const newLocal = { id: '00000000-0000-0000-0000-000000000000' as UUID, name: '' }
    const aclsController = new AclsControllerBuilder(aclsVm)
      .withPopStoredTenant(() => Promise.resolve(newLocal))
      .build()
    const tenantsController = new TenantsControllerBuilder(tenantsVm).build()

    // When
    const ui = whenCreateComponent(aclsController, tenantsController)

    // Then
    const aclsName = ui.getAclsDisplay()
    ui.isContainingColumns(['test'])
    expect(aclsName).toEqual(['Team', 'team0', 'member', 'User', 'user0', 'administrator'])
  })

  test('2 columns utilisateur and role are on the table', () => {
    const { aclsController, tenantsController } = givenControllers()
    const ui = whenCreateComponent(aclsController, tenantsController)

    // Then
    expect(ui.isContainingColumns(['User', 'Role'])).toBeTruthy()
  })

  test('research field is displayed', () => {
    const { aclsController, tenantsController } = givenControllers()
    const ui = whenCreateComponent(aclsController, tenantsController)

    // Then
    expect(ui.isDisplayingResearch()).toBeTruthy()
  })

  test('sort by ascending or descending is possible', () => {
    const { aclsController, tenantsController } = givenControllers()
    const ui = whenCreateComponent(aclsController, tenantsController)

    // Then
    expect(ui.isColumnsSortable(['User', 'Role'])).toBeTruthy()
  })

  test('Pagination on table is done', () => {
    const { aclsController, tenantsController } = givenControllers()
    const ui = whenCreateComponent(aclsController, tenantsController)

    // Then
    expect(ui.isContainingPagination()).toBeTruthy()
  })
})

class AclsComponentBuilder {
  private aclsController!: AclsController
  private tenantsController!: TenantsController

  withAclsController(aclsController: AclsController) {
    this.aclsController = aclsController
    return this
  }

  withTenantsController(tenantsController: TenantsController) {
    this.tenantsController = tenantsController
    return this
  }

  build() {
    const aclsControllerFactory = {
      build: () => this.aclsController
    } as AclsControllerFactory

    const tenantsControllerFactory = {
      build: () => this.tenantsController
    } as TenantsControllerFactory

    const screen: RenderResult = render(AclManagerComponent, {
      global: {
        provide: {
          [USERS_CONTROLLER_FACTORY as symbol]: aclsControllerFactory,
          [TENANTS_CONTROLLER_FACTORY as symbol]: tenantsControllerFactory
        },
        stubs: ['AclForm', 'DeleteAcl'],
        plugins: [i18n, vuetify]
      }
    })

    return new AclsComponentWrapper(screen)
  }
}

class AclsComponentWrapper {
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

  getAclsDisplay() {
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
