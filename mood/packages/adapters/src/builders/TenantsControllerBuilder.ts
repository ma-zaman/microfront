import { Subscriber, TenantsController, TenantsPresenterVM } from '@mood/web-adapters'

export class TenantsControllerBuilder {
  private fetchTenants: () => void = () => { }
  private onVmUpdate: (subscriber: Subscriber<TenantsPresenterVM>) => void = subscriber => subscriber(this.vm)

  constructor(private vm: TenantsPresenterVM = new TenantsPresenterVM()) {
  }

  withFetchTenants(fetchTenants: () => Promise<void>) {
    this.fetchTenants = fetchTenants
    return this
  }

  build(): TenantsController {
    return {
      vm: this.vm,
      subscribeVM: this.onVmUpdate,
      fetchTenants: this.fetchTenants
    } as TenantsController
  }
}
