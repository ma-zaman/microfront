import { UUID } from 'crypto'

export class GetAclsRequest {
  constructor(
    public tenantId: UUID,
    public tenantName: string
  ) {}
}
