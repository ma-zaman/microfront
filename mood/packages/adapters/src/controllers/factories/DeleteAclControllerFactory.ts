import { DeleteAclUseCase } from '@mood/domain'
import { DeleteAclController, DeleteAclPresenter, Navigation } from '@mood/web-adapters'

export class DeleteAclControllerFactory {
  constructor(
    private deleteAclUseCase: DeleteAclUseCase,
    private navigation: Navigation
  ) {}

  build(): DeleteAclController {
    return new DeleteAclController(this.deleteAclUseCase, new DeleteAclPresenter(this.navigation))
  }
}
