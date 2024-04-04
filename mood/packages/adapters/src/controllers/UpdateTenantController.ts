import { Tenant, UpdateTenantRequest, UpdateTenantUseCase } from '@mood/domain'
import { Controller, UpdateTenantPresenter, UpdateTenantPresenterVM } from '@mood/web-adapters'

export class UpdateTenantController extends Controller<UpdateTenantPresenterVM> {
  constructor(
    private updateTenantUseCase: UpdateTenantUseCase,
    private presenter: UpdateTenantPresenter
  ) {
    super(presenter)
  }

  validateTenant(tenant: Tenant) {
    this.presenter.vm.tenant = tenant
    this.presenter.vm.tenantTouched = true
    this.validate()
  }

  update() {
    this.updateTenantUseCase.execute(
      new UpdateTenantRequest(this.presenter.vm.tenant),
      this.presenter
    )
  }

  private validate() {
    this.updateTenantUseCase.validate(
      new UpdateTenantRequest(this.presenter.vm.tenant),
      this.presenter
    )
  }
}
