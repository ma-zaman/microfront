import {
  AddInstanceRequest,
  AddInstanceUseCase,
  InstanceVisibility,
  InstanceTypes
} from '@mood/domain'
import { Controller, AddInstancePresenter, AddInstancePresenterVM } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class AddInstanceController extends Controller<AddInstancePresenterVM> {
  constructor(
    private addInstanceUseCase: AddInstanceUseCase,
    private presenter: AddInstancePresenter
  ) {
    super(presenter)
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

  clearInstanceName() {
    this.presenter.vm.instanceName = undefined
    this.presenter.vm.instanceNameTouched = false
    this.validate()
  }

  clearInstanceVisibility() {
    this.presenter.vm.instanceVisibility = 'private'
    this.presenter.vm.instanceVisibilityTouched = false
    this.validate()
  }

  clearInstanceInstanceType() {
    this.presenter.vm.instanceType = 'prometheus'
    this.presenter.vm.instanceTypeTouched = false
    this.validate()
  }

  clearInstanceDescription() {
    this.presenter.vm.instanceDescription = ''
    this.presenter.vm.instanceDescriptionTouched = false
    this.validate()
  }

  create() {
    this.addInstanceUseCase.execute(
      new AddInstanceRequest(
        this.presenter.vm.instanceType || 'prometheus',
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
    this.presenter.vm.instanceCreated = false
    this.addInstanceUseCase.validate(
      new AddInstanceRequest(
        this.presenter.vm.instanceType || 'prometheus',
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
