import { UpdateInstanceUseCase } from '@mood/domain'
import { UpdateInstanceController, UpdateInstancePresenter, Navigation } from '@mood/web-adapters'

export class UpdateInstanceControllerFactory {
  constructor(
    private updateNewInstanceUseCase: UpdateInstanceUseCase,
    private navigation: Navigation
  ) {}

  build(): UpdateInstanceController {
    const presenter = new UpdateInstancePresenter(this.navigation)
    return new UpdateInstanceController(this.updateNewInstanceUseCase, presenter)
  }
}
