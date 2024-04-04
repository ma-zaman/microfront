import { AddTenantErrors, AddTenantPresentation, Tenant, NewTenantFields } from '@mood/domain'
import {
  Presenter,
  Navigation,
  NavigationRoute,
  AlertPresenterVM,
  Alert,
  AlertTypes
} from '@mood/web-adapters'

export class AddTenantPresenterVM extends AlertPresenterVM {
  tenantName: string | undefined
  tenantDescription: string | undefined
  tenantLabels: Map<string, string> | undefined

  tenantNameError: string | undefined
  tenantLabelsError: string | undefined
  tenantDescriptionError: string | undefined

  tenantNameTouched = false
  tenantDescriptionTouched = false
  tenantLabelsTouched = false

  canCreateTenant = false
  creatingTenant = false
  tenantCreated = false
}

// TODO : i18n - Add tenant name on details
const tenantCreatedAlert: (name: string) => Alert = (tenantName: string) => ({
  title: 'success',
  details: 'yourTenantHasBeenCreated',
  type: AlertTypes.success,
  params: { name: tenantName }
})

const tenantCreatingAlert: () => Alert = () => ({
  title: 'information',
  details: 'creatingTenant',
  type: AlertTypes.info,
  showCloseBtn: false,
  params: {}
})

const errorTenantAlert: (err: string) => Alert = (err) => ({
  title: 'error',
  details: err,
  type: AlertTypes.danger,
  params: {}
})

export class AddTenantPresenter
  extends Presenter<AddTenantPresenterVM>
  implements AddTenantPresentation
{
  constructor(private navigator: Navigation) {
    super(new AddTenantPresenterVM())
  }

  notifyCreatingTenantInfo(): void {
    this.vm.creatingTenant = true
    this.vm.tenantCreated = false
    this.vm.alert = tenantCreatingAlert()
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyAddTenantError(error: string): void {
    this.vm.creatingTenant = false
    this.vm.alert = errorTenantAlert(error)
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyTenantAdded(tenant: Tenant): void {
    this.vm.creatingTenant = false
    this.vm.tenantCreated = true
    this.vm.alert = tenantCreatedAlert(tenant.name)
    this.vm.displayAlert = true
    this.notifyVM()
    this.navigator.navigate(NavigationRoute.TENANTS)
  }

  notifyNewTenantFieldError(errors: AddTenantErrors): void {
    this.vm.tenantNameError = this.vm.tenantNameTouched ? errors.get(NewTenantFields.name) : ''
    this.vm.tenantDescriptionError = this.vm.tenantDescriptionTouched
      ? errors.get(NewTenantFields.description)
      : ''
    this.vm.tenantLabelsError = this.vm.tenantLabelsTouched ? errors.get(NewTenantFields.appId) : ''
    this.vm.canCreateTenant = errors.size == 0
    this.notifyVM()
  }
}
