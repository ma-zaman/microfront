import { Tenant, TenantRepository } from '@mood/domain';

export class TenantRepositoryBuilder {
  private addTenant: (tenant: Tenant) => Promise<void> = () => Promise.resolve();
  private updateTenant: (tenant: Tenant) => Promise<void> = () => Promise.resolve();
  private deleteTenant: (tenant: Tenant) => Promise<void> = () => Promise.resolve();
  private listTenant: () => Promise<Tenant[]> = () => Promise.resolve([]);

  withAddTenant(addTenant: (tenant: Tenant) => Promise<void>) {
    this.addTenant = addTenant
    return this
  }

  withUpdateTenant(updateTenant: (tenant: Tenant) => Promise<void>) {
    this.updateTenant = updateTenant
    return this
  }

  withDeleteTenant(deleteTenant: (tenant: Tenant) => Promise<void>) {
    this.deleteTenant = deleteTenant
    return this
  }

  withGetTenants(listTenant: () => Promise<Tenant[]>) {
    this.listTenant = listTenant
    return this
  }

  build(): TenantRepository {
    return {
      addTenant: this.addTenant,
      updateTenant: this.updateTenant,
      deleteTenant: this.deleteTenant,
      getTenants: this.listTenant
    }
  }
}
