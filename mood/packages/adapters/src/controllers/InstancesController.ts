import { GetInstancesRequest, GetInstancesUseCase } from '@mood/domain'
import { Controller, InstancesPresenter, InstancesPresenterVM } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class InstancesController extends Controller<InstancesPresenterVM> {
  constructor(
    private readonly getInstancesUseCase: GetInstancesUseCase,
    private readonly presenter: InstancesPresenter
  ) {
    super(presenter)
  }

  fetchInstances() {
    this.getInstancesUseCase.execute(new GetInstancesRequest(this.vm.tenantId!, this.vm.tenantName!), this.presenter)
  }

  popStoredTenant(): {id: UUID | undefined, name: string | undefined} {
    this.presenter.updateWithStoredTenant()
    const id = this.presenter.vm.tenantId
    const name = this.presenter.vm.tenantName
    this.presenter.clearStoredTenant()
    return {id, name}
  }

}
