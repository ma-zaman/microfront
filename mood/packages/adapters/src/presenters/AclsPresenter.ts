import { GetAclsPresentation, Acl, Tenant } from '@mood/domain'
import { Alert, AlertPresenterVM, AlertTypes, Presenter, Store } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class AclsPresenterVM extends AlertPresenterVM {
  tenantId: UUID | undefined
  tenantName: string | undefined
  acls: Acl[] | undefined
  loading = false
}

const errorAclsAlert: (err: string) => Alert = (err) => ({
  title: 'error',
  details: err,
  type: AlertTypes.danger,
  params: {}
})

export class AclsPresenter extends Presenter<AclsPresenterVM> implements GetAclsPresentation {
  constructor(private store: Store<Tenant>) {
    super(new AclsPresenterVM())
  }

  loadingAcls() {
    this.vm.loading = true
  }

  notifyAclsError(error: string): void {
    this.vm.loading = false
    this.vm.alert = errorAclsAlert(error)
    this.vm.displayAlert = true
    this.notifyVM()
  }

  displayAcls(acls: Acl[]): void {
    this.vm.acls = acls
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
