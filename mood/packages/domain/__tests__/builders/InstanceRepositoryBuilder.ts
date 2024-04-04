import { Instance, InstanceRepository } from '@mood/domain'
import { UUID } from 'crypto'

export class InstanceRepositoryBuilder {
  private listInstance: (tenantId: UUID, tenantName: string) => Promise<Instance[]> = () =>
    Promise.resolve([])
  private addInstance: (instance: Instance) => Promise<void> = () => Promise.resolve()
  private updateInstance: (instance: Instance) => Promise<void> = () => Promise.resolve()
  private deleteInstance: (instance: Instance) => Promise<void> = () => Promise.resolve()

  withGetInstances(listInstance: (tenantId: UUID, tenantName: string) => Promise<Instance[]>) {
    this.listInstance = listInstance
    return this
  }
  withAddInstance(addInstance: (instance: Instance) => Promise<void>) {
    this.addInstance = addInstance
    return this
  }

  withUpdateInstance(updateInstance: (instance: Instance) => Promise<void>) {
    this.updateInstance = updateInstance
    return this
  }

  withDeleteInstance(deleteInstance: (instance: Instance) => Promise<void>) {
    this.deleteInstance = deleteInstance
    return this
  }

  build(): InstanceRepository {
    return {
      getInstances: this.listInstance,
      addInstance: this.addInstance,
      updateInstance: this.updateInstance,
      deleteInstance: this.deleteInstance
    }
  }
}
