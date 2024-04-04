import { Instance } from '@mood/domain'
import { UUID } from 'crypto'

export interface InstanceRepository {
  getInstances(instanceId: UUID, instanceName: string): Promise<Instance[]>
  addInstance(instance: Instance): Promise<void>
  updateInstance(instance: Instance): Promise<void>
  deleteInstance(instance: Instance): Promise<void>
}
