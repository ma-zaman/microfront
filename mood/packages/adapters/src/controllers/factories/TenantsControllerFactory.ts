import { GetTenantsUseCase, Tenant } from '@mood/domain'
import { TenantsController, Navigation, TenantsPresenter, Store } from '@mood/web-adapters'

export class TenantsControllerFactory {
  constructor(
    private getTenantsUseCase: GetTenantsUseCase,
    private navigation: Navigation,
    private store: Store<Tenant>
  ) {}

  build(): TenantsController {
    const presenter = new TenantsPresenter(this.navigation, this.store)
    return new TenantsController(this.getTenantsUseCase, presenter)
  }
}
