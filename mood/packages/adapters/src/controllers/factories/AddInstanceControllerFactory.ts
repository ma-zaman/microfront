import { AddInstanceUseCase } from '@mood/domain'
import { AddInstanceController, AddInstancePresenter, Navigation } from '@mood/web-adapters'

export class AddInstanceControllerFactory {
  constructor(
    private addNewInstanceUseCase: AddInstanceUseCase,
    private navigation: Navigation
  ) {}

  build(): AddInstanceController {
    const presenter = new AddInstancePresenter(this.navigation)
    return new AddInstanceController(this.addNewInstanceUseCase, presenter)
  }
}
