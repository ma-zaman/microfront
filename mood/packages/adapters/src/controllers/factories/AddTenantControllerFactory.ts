import { AddTenantUseCase } from '@mood/domain'
import { AddTenantController, AddTenantPresenter, Navigation } from '@mood/web-adapters'

export class AddTenantControllerFactory {
  constructor(
    private addNewTenantUseCase: AddTenantUseCase,
    private navigation: Navigation
  ) {}

  build(): AddTenantController {
    const presenter = new AddTenantPresenter(this.navigation)
    return new AddTenantController(this.addNewTenantUseCase, presenter)
  }
}
