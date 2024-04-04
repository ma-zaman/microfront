import { InstanceTypes } from '@mood/domain'
import { UUID } from 'crypto'

export class DeleteInstanceRequest {
  constructor(
    public id: UUID,
    public name: string,
    public instanceToDeleteName: string,
    public instanceType: InstanceTypes,
    public tenantName: string,
    public tenantId: UUID
  ) {}
}
