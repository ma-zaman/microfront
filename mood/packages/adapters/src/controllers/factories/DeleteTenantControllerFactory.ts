import { DeleteTenantUseCase } from '@mood/domain'
import { DeleteTenantController, DeleteTenantPresenter, Navigation } from '@mood/web-adapters'

export class DeleteTenantControllerFactory {
  constructor(private deleteTenantUseCase: DeleteTenantUseCase, private navigation: Navigation) { }

  build(): DeleteTenantController {
    return new DeleteTenantController(
      this.deleteTenantUseCase,
      new DeleteTenantPresenter(this.navigation)
    )
  }
}
