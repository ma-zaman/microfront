import { GetInstancesUseCase, Tenant } from '@mood/domain'
import { InstancesController, InstancesPresenter, Store } from '@mood/web-adapters'

export class InstancesControllerFactory {
  constructor(private getInstancesUseCase: GetInstancesUseCase, private store: Store<Tenant>) {}

  build(): InstancesController {
    return new InstancesController(this.getInstancesUseCase, new InstancesPresenter(this.store))
  }
}
