import { UpdateAclUseCase } from '@mood/domain'
import { UpdateAclController, UpdateAclPresenter, Navigation } from '@mood/web-adapters'

export class UpdateAclControllerFactory {
  constructor(
    private updateAclUseCase: UpdateAclUseCase,
    private navigation: Navigation
  ) {}

  build(): UpdateAclController {
    return new UpdateAclController(this.updateAclUseCase, new UpdateAclPresenter(this.navigation))
  }
}
