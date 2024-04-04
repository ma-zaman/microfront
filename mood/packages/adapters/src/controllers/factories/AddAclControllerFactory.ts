import { AddAclUseCase } from '@mood/domain'
import { AddAclController, AddAclPresenter, Navigation } from '@mood/web-adapters'

export class AddAclControllerFactory {
  constructor(
    private addNewAclUseCase: AddAclUseCase,
    private navigation: Navigation
  ) {}

  build(): AddAclController {
    const presenter = new AddAclPresenter(this.navigation)
    return new AddAclController(this.addNewAclUseCase, presenter)
  }
}
