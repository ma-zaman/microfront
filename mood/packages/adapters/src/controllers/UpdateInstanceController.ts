import {
  InstanceTypes,
  InstanceVisibility,
  UpdateInstanceRequest,
  UpdateInstanceUseCase
} from '@mood/domain'
import { Controller, UpdateInstancePresenter, UpdateInstancePresenterVM } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class UpdateInstanceController extends Controller<UpdateInstancePresenterVM> {
  constructor(
    private updateInstanceUseCase: UpdateInstanceUseCase,
    private presenter: UpdateInstancePresenter
  ) {
    super(presenter)
  }

  validateInstanceId(id: UUID) {
    this.presenter.vm.instanceId = id
    this.presenter.vm.instanceIdTouched = true
    this.validate()
  }

  validateInstanceName(name: string) {
    this.presenter.vm.instanceName = name
    this.presenter.vm.instanceNameTouched = true
    this.validate()
  }

  validateInstanceDescription(description: string) {
    this.presenter.vm.instanceDescription = description
    this.presenter.vm.instanceDescriptionTouched = true
    this.validate()
  }

  validateInstanceTenantName(tenantName: string) {
    this.presenter.vm.instanceTenantName = tenantName
    this.presenter.vm.instanceTenantNameTouched = true
    this.validate()
  }

  validateInstanceTenantId(tenantId: UUID) {
    this.presenter.vm.instanceTenantId = tenantId
    this.presenter.vm.instanceTenantIdTouched = true
    this.validate()
  }

  validateInstanceVisibility(visibility: InstanceVisibility) {
    this.presenter.vm.instanceVisibility = visibility
    this.presenter.vm.instanceVisibilityTouched = true
    this.validate()
  }

  validateInstanceType(type: InstanceTypes) {
    this.presenter.vm.instanceType = type
    this.presenter.vm.instanceTypeTouched = true
    this.validate()
  }

  update() {
    this.updateInstanceUseCase.execute(
      new UpdateInstanceRequest(
        this.presenter.vm.instanceId || ('' as UUID),
        this.presenter.vm.instanceType || ('' as InstanceTypes),
        this.presenter.vm.instanceName || '',
        this.presenter.vm.instanceVisibility || 'private',
        this.presenter.vm.instanceDescription || '',
        this.presenter.vm.instanceTenantName || '',
        this.presenter.vm.instanceTenantId || ('' as UUID)
      ),
      this.presenter
    )
  }

  private validate() {
    this.updateInstanceUseCase.validate(
      new UpdateInstanceRequest(
        this.presenter.vm.instanceId || ('' as UUID),
        this.presenter.vm.instanceType || ('' as InstanceTypes),
        this.presenter.vm.instanceName || '',
        this.presenter.vm.instanceVisibility || 'private',
        this.presenter.vm.instanceDescription || '',
        this.presenter.vm.instanceTenantName || '',
        this.presenter.vm.instanceTenantId || ('' as UUID)
      ),
      this.presenter
    )
  }
}
