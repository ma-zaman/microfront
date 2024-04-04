import { Subscriber, InstancesController, InstancesPresenterVM } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class InstancesControllerBuilder {
  private fetchInstances: () => void = () => {}
  private popStoredTenant: () => void = () => {}
  private onVmUpdate: (subscriber: Subscriber<InstancesPresenterVM>) => void = (subscriber) =>
    subscriber(this.vm)

  constructor(private vm: InstancesPresenterVM = new InstancesPresenterVM()) {}

  withPopStoredTenant(popStoredTenant: () => Promise<{id: UUID | undefined, name: string | undefined} >) {
    this.popStoredTenant = popStoredTenant
    return this
  }

  withFetchInstances(fetchInstances: () => Promise<void>) {
    this.fetchInstances = fetchInstances
    return this
  }

  build(): InstancesController {
    return {
      vm: this.vm,
      subscribeVM: this.onVmUpdate,
      fetchInstances: this.fetchInstances,
      popStoredTenant: this.popStoredTenant
    } as InstancesController
  }
}
