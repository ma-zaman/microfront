import { Tenant } from '@mood/domain'

export class UpdateTenantRequest {
  constructor(public tenant: Tenant) {}
}
