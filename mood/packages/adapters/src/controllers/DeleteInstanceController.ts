import { DeleteInstanceRequest, DeleteInstanceUseCase, InstanceTypes } from '@mood/domain'
import { Controller, DeleteInstancePresenter, DeleteInstancePresenterVM } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class DeleteInstanceController extends Controller<DeleteInstancePresenterVM> {
  constructor(
    private deleteInstanceUseCase: DeleteInstanceUseCase,
    private presenter: DeleteInstancePresenter
  ) {
    super(presenter)
  }

  validateInstanceToDelete(instanceToDelete: string) {
    this.presenter.vm.instanceToDelete = instanceToDelete
    this.presenter.vm.instanceName = ''

    this.presenter.vm.instanceToDeleteTouched = true
    this.presenter.vm.instanceNameTouched = false

    this.presenter.vm.instanceDeleted = false
    this.validate()
  }

  validateInstanceName(instanceName: string) {
    this.presenter.vm.instanceName = instanceName
    this.presenter.vm.instanceNameTouched = true
    this.validate()
  }

  validateInstanceId(instanceId: UUID) {
    this.presenter.vm.instanceId = instanceId
    this.presenter.vm.instanceIdTouched = true
    this.validate()
  }

  validateInstanceType(instanceType: InstanceTypes) {
    this.presenter.vm.instanceType = instanceType
    this.presenter.vm.instanceTypeTouched = true
    this.validate()
  }

  validateInstanceTenantName(instanceTenantName: string) {
    this.presenter.vm.instanceTenantName = instanceTenantName
    this.presenter.vm.instanceTenantNameTouched = true
    this.validate()
  }

  validateInstanceTenantId(instanceTenantId: UUID) {
    this.presenter.vm.instanceTenantId = instanceTenantId
    this.presenter.vm.instanceTenantIdTouched = true
    this.validate()
  }

  delete() {
    this.deleteInstanceUseCase.execute(
      new DeleteInstanceRequest(
        this.presenter.vm.instanceId || ('' as UUID),
        this.presenter.vm.instanceName || '',
        this.presenter.vm.instanceToDelete || '',
        this.presenter.vm.instanceType || ('' as InstanceTypes),
        this.presenter.vm.instanceTenantName || '',
        this.presenter.vm.instanceTenantId || ('' as UUID)
      ),
      this.presenter
    )
  }

  private validate() {
    this.deleteInstanceUseCase.validate(
      new DeleteInstanceRequest(
        this.presenter.vm.instanceId || ('' as UUID),
        this.presenter.vm.instanceName || '',
        this.presenter.vm.instanceToDelete || '',
        this.presenter.vm.instanceType || ('' as InstanceTypes),
        this.presenter.vm.instanceTenantName || '',
        this.presenter.vm.instanceTenantId || ('' as UUID)
      ),
      this.presenter
    )
  }
}
