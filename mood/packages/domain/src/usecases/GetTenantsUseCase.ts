import { GetTenantsPresentation, TenantRepository } from '@mood/domain'

export class GetTenantsUseCase {
  constructor(private tenantRepository: TenantRepository) {}

  async execute(presenter: GetTenantsPresentation) {
    presenter.loadingTenants()
    this.tenantRepository
      .getTenants()
      .then((tenants) => presenter.displayTenants(tenants))
      .catch((err: Error) => presenter.notifyTenantsError(err.message))
  }
}
