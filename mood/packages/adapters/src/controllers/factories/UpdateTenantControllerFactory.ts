import { UpdateTenantUseCase } from '@mood/domain'
import { UpdateTenantController, UpdateTenantPresenter, Navigation } from '@mood/web-adapters'

export class UpdateTenantControllerFactory {
  constructor(private updateTenantUseCase: UpdateTenantUseCase, private navigation: Navigation) {}

  build(): UpdateTenantController {
    return new UpdateTenantController(
      this.updateTenantUseCase,
      new UpdateTenantPresenter(this.navigation)
    )
  }
}
