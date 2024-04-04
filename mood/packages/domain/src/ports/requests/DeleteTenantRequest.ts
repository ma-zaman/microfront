import { UUID } from "crypto";

export class DeleteTenantRequest {
  constructor(
    public id: UUID,
    public name: string,
    public tenantToDeleteName: string
  ) {}
}
