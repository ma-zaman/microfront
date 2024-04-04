import {
  DeleteTenantErrors,
  DeleteTenantPresentation,
  Tenant,
  DeleteTenantFields
} from '@mood/domain'
import {
  Presenter,
  Navigation,
  NavigationRoute,
  AlertPresenterVM,
  AlertTypes,
  Alert
} from '@mood/web-adapters'
import { UUID } from 'crypto'

export class DeleteTenantPresenterVM extends AlertPresenterVM {
  tenantToDelete: string | undefined
  tenantToDeleteError: string | undefined
  tenantToDeleteTouched = false

  tenantId: UUID | undefined
  tenantIdError: string | undefined
  tenantIdTouched = false

  tenantName: string | undefined
  tenantNameError: string | undefined
  tenantNameTouched = false

  canDeleteTenant = false
  deletingTenant = false
  tenantDeleted = false
}
const tenantDeletedAlert: (name: string) => Alert = (tenantName) => ({
  title: 'success',
  details: 'theTenantHasBeenDeleted',
  type: AlertTypes.success,
  params: { tenantName: tenantName }
})

const tenantDeletingAlert: () => Alert = () => ({
  title: 'information',
  details: 'deletingTenant',
  type: AlertTypes.info,
  showCloseBtn: false,
  params: {}
})

const errorTenantDeleteAlert: (err: string) => Alert = (err) => ({
  title: 'error',
  details: err,
  type: AlertTypes.danger,
  params: {}
})

export class DeleteTenantPresenter
  extends Presenter<DeleteTenantPresenterVM>
  implements DeleteTenantPresentation
{
  constructor(private navigator: Navigation) {
    super(new DeleteTenantPresenterVM())
  }

  notifyDeletingTenantInfo(): void {
    this.vm.deletingTenant = true
    this.vm.tenantDeleted = false
    this.vm.alert = tenantDeletingAlert()
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyDeleteTenantError(error: string): void {
    this.vm.deletingTenant = false
    this.vm.alert = errorTenantDeleteAlert(error)
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyTenantDeleted(tenant: Tenant): void {
    this.vm.deletingTenant = false
    this.vm.tenantDeleted = true
    this.vm.alert = tenantDeletedAlert(tenant.name)
    this.vm.displayAlert = true
    this.notifyVM()
    this.navigator.navigate(NavigationRoute.TENANTS)
  }

  notifyDeleteTenantFieldError(errors: DeleteTenantErrors): void {
    this.vm.tenantNameError = this.vm.tenantNameTouched ? errors.get(DeleteTenantFields.name) : ''
    this.vm.tenantToDeleteError = this.vm.tenantToDeleteTouched
      ? errors.get(DeleteTenantFields.tenantToDelete)
      : ''
    this.vm.canDeleteTenant = errors.size == 0
    this.notifyVM()
  }
}
