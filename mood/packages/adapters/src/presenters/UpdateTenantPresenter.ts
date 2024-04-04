import {
  UpdateTenantErrors,
  UpdateTenantPresentation,
  Tenant,
  UpdateTenantFields,
  TenantBuilder
} from '@mood/domain'
import {
  Presenter,
  Navigation,
  NavigationRoute,
  AlertPresenterVM,
  AlertTypes,
  Alert
} from '@mood/web-adapters'

export class UpdateTenantPresenterVM extends AlertPresenterVM {
  tenant: Tenant = new TenantBuilder().build()

  tenantNameError: string | undefined
  tenantLabelsError: string | undefined
  tenantDescriptionError: string | undefined

  tenantTouched = false
  canUpdateTenant = false

  updatingTenant = false
  tenantUpdated = false
}

const tenantUpdatedAlert: (tenantName: string) => Alert = () => ({
  title: 'success',
  details: 'yourTenantHasBeenUpdated',
  type: AlertTypes.success,
  params: {}
})

const tenantUpdatingAlert: () => Alert = () => ({
  title: 'information',
  details: 'updatingTenant',
  type: AlertTypes.info,
  showCloseBtn: false,
  params: {}
})

const errorTenantUpdateAlert: (err: string) => Alert = (err) => ({
  title: 'error',
  details: err,
  type: AlertTypes.danger,
  params: {}
})

export class UpdateTenantPresenter
  extends Presenter<UpdateTenantPresenterVM>
  implements UpdateTenantPresentation
{
  constructor(private navigator: Navigation) {
    super(new UpdateTenantPresenterVM())
  }

  notifyUpdatingTenantInfo(): void {
    this.vm.updatingTenant = true
    this.vm.tenantUpdated = false
    this.vm.alert = tenantUpdatingAlert()
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyUpdateTenantError(error: string): void {
    this.vm.updatingTenant = false
    this.vm.tenantUpdated = false
    this.vm.alert = errorTenantUpdateAlert(error)
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyTenantUpdated(tenant: Tenant): void {
    this.vm.updatingTenant = false
    this.vm.tenantUpdated = true
    this.vm.alert = tenantUpdatedAlert(tenant.name)
    this.vm.displayAlert = true
    this.notifyVM()
    this.navigator.navigate(NavigationRoute.TENANTS)
  }

  notifyUpdateTenantFieldError(errors: UpdateTenantErrors): void {
    this.vm.tenantNameError = this.vm.tenantTouched ? errors.get(UpdateTenantFields.name) : ''
    this.vm.tenantDescriptionError = this.vm.tenantTouched
      ? errors.get(UpdateTenantFields.description)
      : ''
    this.vm.tenantLabelsError = this.vm.tenantTouched ? errors.get(UpdateTenantFields.appId) : ''
    this.vm.canUpdateTenant = errors.size == 0
    this.notifyVM()
  }
}
