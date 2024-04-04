import { UUID } from "crypto";

export class GetInstancesRequest {
  constructor(
    public tenantId: UUID,
    public tenantName: string
  ) {}
}
