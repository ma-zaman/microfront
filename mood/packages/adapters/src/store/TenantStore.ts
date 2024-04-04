import { Tenant } from "@mood/domain"
import { Store } from "@mood/web-adapters"
import { UUID } from "crypto"

export class TenantStore implements Store<Tenant> {
  private currentTenant: Tenant = {id: '' as UUID, name: ""} as Tenant 
  get(): Tenant {
    return this.currentTenant
  }
  set(tenant: Tenant): void {
    this.currentTenant = tenant
  }
  clear(): void {
    this.currentTenant = {id: '' as UUID, name: ""} as Tenant
  }
}
