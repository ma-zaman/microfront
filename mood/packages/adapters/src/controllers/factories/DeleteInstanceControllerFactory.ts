import { DeleteInstanceUseCase } from '@mood/domain'
import { DeleteInstanceController, DeleteInstancePresenter, Navigation } from '@mood/web-adapters'

export class DeleteInstanceControllerFactory {
  constructor(
    private deleteInstanceUseCase: DeleteInstanceUseCase,
    private navigation: Navigation
  ) {}

  build(): DeleteInstanceController {
    return new DeleteInstanceController(
      this.deleteInstanceUseCase,
      new DeleteInstancePresenter(this.navigation)
    )
  }
}
