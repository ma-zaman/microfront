import { GetTenantsUseCase, Tenant } from '@mood/domain'
import { Controller, TenantsPresenter, TenantsPresenterVM } from '@mood/web-adapters'

export class TenantsController extends Controller<TenantsPresenterVM> {
  constructor(
    private readonly getTenantsUseCase: GetTenantsUseCase,
    private readonly presenter: TenantsPresenter
  ) {
    super(presenter)
  }

  fetchTenants() {
    this.getTenantsUseCase.execute(this.presenter)
  }

  displayTenantAcl(tenant: Tenant) {
    this.presenter.displayTenantAcl(tenant)
  }

  displayTenantInstance(tenant: Tenant) {
    this.presenter.displayTenantInstance(tenant)
  }
}
