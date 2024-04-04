import { GetTenantsPresentation, Tenant } from '@mood/domain'
import { Alert, AlertPresenterVM, AlertTypes, Navigation, NavigationRoute, Presenter, Store } from '@mood/web-adapters'

export class TenantsPresenterVM extends AlertPresenterVM {
  tenants: Tenant[] | undefined
  loading = true
}

const errorTenantsAlert: (err: string) => Alert = (err) => ({
  title: 'error',
  details: err,
  type: AlertTypes.danger,
  params: {}
})

export class TenantsPresenter
  extends Presenter<TenantsPresenterVM>
  implements GetTenantsPresentation
{
  constructor(private navigator: Navigation, private store: Store<Tenant>) {
    super(new TenantsPresenterVM())
  }

  loadingTenants() {
    this.vm.loading = true
  }

  notifyTenantsError(error: string): void {
    this.vm.loading = false
    this.vm.alert = errorTenantsAlert(error)
    this.vm.displayAlert = true
    this.notifyVM()
  }

  displayTenants(tenants: Tenant[]): void {
    this.vm.tenants = tenants
    this.vm.loading = false
    this.notifyVM()
  }

  displayTenantAcl(tenant: Tenant): void {
    // Perte de la discrimination des méthodes si générisation ?
    this.vm.loading = false
    this.store.set(tenant)
    this.navigator.navigate(NavigationRoute.ACLS)
    this.notifyVM()
  }

  displayTenantInstance(tenant: Tenant): void {
    this.vm.loading = false
    this.store.set(tenant)
    this.navigator.navigate(NavigationRoute.INSTANCES)
    this.notifyVM()
  }

}
