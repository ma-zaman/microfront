import { InstanceTypes, InstanceVisibility } from '@mood/domain'
import { UUID } from 'crypto'

export class UpdateInstanceRequest {
  constructor(
    public id: UUID,
    public instanceType: InstanceTypes,
    public name: string,
    public visibility: InstanceVisibility,
    public description: string,
    public tenantName: string,
    public tenantId: UUID
  ) {}
}
