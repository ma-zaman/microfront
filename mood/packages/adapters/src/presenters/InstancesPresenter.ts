import { GetInstancesPresentation, Instance, Tenant } from '@mood/domain'
import { Alert, AlertPresenterVM, AlertTypes, Presenter, Store } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class InstancesPresenterVM extends AlertPresenterVM {
  tenantName: string | undefined
  tenantId: UUID | undefined
  instances: Instance[] | undefined
  loading = false
}

const errorInstancesAlert: (err: string) => Alert = (err) => ({
  title: 'error',
  details: err,
  type: AlertTypes.danger,
  params: {}
})

export class InstancesPresenter
  extends Presenter<InstancesPresenterVM>
  implements GetInstancesPresentation
{
  constructor(private store: Store<Tenant>) {
    super(new InstancesPresenterVM())
  }

  loadingInstances() {
    this.vm.loading = true
  }

  notifyInstancesError(error: string): void {
    this.vm.loading = false
    this.vm.alert = errorInstancesAlert(error)
    this.vm.displayAlert = true
    this.notifyVM()
  }

  displayInstances(instances: Instance[]): void {
    this.vm.instances = instances
    this.vm.loading = false
    this.notifyVM()
  }

  updateWithStoredTenant(): void {
    this.vm.tenantId = this.store.get()?.id
    this.vm.tenantName = this.store.get()?.name
  }

  clearStoredTenant(): void {
    this.store.clear()
  }

}
