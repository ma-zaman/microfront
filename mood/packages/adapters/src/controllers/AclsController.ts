import { GetAclsRequest, GetAclsUseCase } from '@mood/domain'
import { Controller, AclsPresenter, AclsPresenterVM } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class AclsController extends Controller<AclsPresenterVM> {
  constructor(
    private readonly getAclsUseCase: GetAclsUseCase,
    private readonly presenter: AclsPresenter
  ) {
    super(presenter)
  }

  fetchAcls() {
    this.getAclsUseCase.execute(
      new GetAclsRequest(this.vm.tenantId!, this.vm.tenantName!),
      this.presenter
    )
  }

  popStoredTenant(): {id: UUID | undefined, name: string | undefined} {
    this.presenter.updateWithStoredTenant()
    const id = this.presenter.vm.tenantId
    const name = this.presenter.vm.tenantName
    this.presenter.clearStoredTenant()
    return {id, name}
  }
}
