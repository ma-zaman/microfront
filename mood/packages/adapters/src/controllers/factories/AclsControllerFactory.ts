import { GetAclsUseCase, Tenant } from '@mood/domain'
import { AclsController, AclsPresenter, Store } from '@mood/web-adapters'

export class AclsControllerFactory {
  constructor(private getAclsUseCase: GetAclsUseCase, private store: Store<Tenant>) {}

  build(): AclsController {
    return new AclsController(this.getAclsUseCase, new AclsPresenter(this.store))
  }
}
