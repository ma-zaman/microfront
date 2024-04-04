import { GetTenantsPresentation, Tenant } from '@mood/domain'

export class GetTenantsPresentationBuilder {
  private loadingTenants: () => void = () => null
  private notifyTenantsError: (message: string) => void = () => null
  private displayTenants: (tenants: Tenant[]) => void = () => null
  private displayTenantAcl: (tenants: Tenant) => void = () => null

  withDisplayTenants(displayTenants: (tenants: Tenant[]) => void) {
    this.displayTenants = displayTenants
    return this
  }

  withLoadingTenants(loadingTenants: () => void) {
    this.loadingTenants = loadingTenants
    return this
  }

  withNotifyTenantsError(notifyTenantsError: (message: string) => void) {
    this.notifyTenantsError = notifyTenantsError
    return this
  }

  withDisplayTenantAcl(displayTenantAcl: (tenant: Tenant) => void) {
    this.displayTenantAcl = displayTenantAcl
    return this
  }

  build(): GetTenantsPresentation {
    return {
      displayTenants: this.displayTenants,
      loadingTenants: this.loadingTenants,
      notifyTenantsError: this.notifyTenantsError,
      displayTenantAcl: this.displayTenantAcl
    }
  }
}
