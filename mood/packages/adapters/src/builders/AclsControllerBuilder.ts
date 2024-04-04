import { Subscriber, AclsController, AclsPresenterVM } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class AclsControllerBuilder {
  private fetchAcls: () => void = () => {}
  private popStoredTenant: () => void = () => {}
  private onVmUpdate: (subscriber: Subscriber<AclsPresenterVM>) => void = (subscriber) =>
    subscriber(this.vm)

  constructor(private vm: AclsPresenterVM = new AclsPresenterVM()) {}

  withFetchAcls(fetchAcls: () => Promise<void>) {
    this.fetchAcls = fetchAcls
    return this
  }

  withPopStoredTenant(popStoredTenant: () => Promise<{id: UUID | undefined, name: string | undefined} >) {
    this.popStoredTenant = popStoredTenant
    return this
  }

  build(): AclsController {
    return {
      vm: this.vm,
      subscribeVM: this.onVmUpdate,
      fetchAcls: this.fetchAcls,
      popStoredTenant: this.popStoredTenant
    } as AclsController
  }
}
