import { AclOwnerTypes, AddAclRequest, AddAclUseCase, RoleTypes } from '@mood/domain'
import { Controller, AddAclPresenter, AddAclPresenterVM } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class AddAclController extends Controller<AddAclPresenterVM> {
  constructor(
    private addAclUseCase: AddAclUseCase,
    private presenter: AddAclPresenter
  ) {
    super(presenter)
  }

  validateAclOwner(aclOwner: string) {
    this.presenter.vm.aclOwner = aclOwner
    this.presenter.vm.aclOwnerTouched = true
    this.validate()
  }

  validateAclOwnerType(aclOwnerType: AclOwnerTypes) {
    this.presenter.vm.aclOwnerType = aclOwnerType
    this.presenter.vm.aclOwnerTypeTouched = true
    this.validate()
  }

  validateAclRole(aclRole: RoleTypes) {
    this.presenter.vm.aclRole = aclRole
    this.presenter.vm.aclRoleTouched = true
    this.validate()
  }

  validateAclTenantName(aclTenantName: string) {
    this.presenter.vm.aclTenantName = aclTenantName
    this.presenter.vm.aclTenantNameTouched = true
    this.validate()
  }

  validateAclTenantId(aclTenantId: UUID) {
    this.presenter.vm.aclTenantId = aclTenantId
    this.presenter.vm.aclTenantIdTouched = true
    this.validate()
  }

  clearAclOwner() {
    this.presenter.vm.aclOwner = undefined
    this.presenter.vm.aclOwnerTouched = false
    this.validate()
  }

  clearAclOwnerType() {
    this.presenter.vm.aclOwnerType = 'user'
    this.presenter.vm.aclOwnerTypeTouched = false
    this.validate()
  }

  clearAclRole() {
    this.presenter.vm.aclRole = 'viewer'
    this.presenter.vm.aclRoleTouched = false
    this.validate()
  }

  create() {
    this.addAclUseCase.execute(
      new AddAclRequest(
        this.presenter.vm.aclOwner || '',
        this.presenter.vm.aclOwnerType || 'user',
        this.presenter.vm.aclRole || 'viewer',
        this.presenter.vm.aclTenantId || ('' as UUID),
        this.presenter.vm.aclTenantName || ''
      ),
      this.presenter
    )
  }

  private validate() {
    this.presenter.vm.aclCreated = false
    this.addAclUseCase.validate(
      new AddAclRequest(
        this.presenter.vm.aclOwner || '',
        this.presenter.vm.aclOwnerType || 'user',
        this.presenter.vm.aclRole || 'viewer',
        this.presenter.vm.aclTenantId || ('' as UUID),
        this.presenter.vm.aclTenantName || ''
      ),
      this.presenter
    )
  }
}
