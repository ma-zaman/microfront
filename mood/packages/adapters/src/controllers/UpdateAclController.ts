import { AclOwnerTypes, RoleTypes, UpdateAclRequest, UpdateAclUseCase } from '@mood/domain'
import { Controller, UpdateAclPresenter, UpdateAclPresenterVM } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class UpdateAclController extends Controller<UpdateAclPresenterVM> {
  constructor(
    private updateAclUseCase: UpdateAclUseCase,
    private presenter: UpdateAclPresenter
  ) {
    super(presenter)
  }

  validateAclId(aclId: UUID) {
    this.presenter.vm.aclId = aclId
    this.presenter.vm.aclIdTouched = true
    this.validate()
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

  validateAclTenantId(aclTenantId: UUID) {
    this.presenter.vm.aclTenantId = aclTenantId
    this.presenter.vm.aclTenantIdTouched = true
    this.validate()
  }

  validateAclTenantName(aclTenantName: string) {
    this.presenter.vm.aclTenantName = aclTenantName
    this.presenter.vm.aclTenantNameTouched = true
    this.validate()
  }

  update() {
    this.updateAclUseCase.execute(
      new UpdateAclRequest(
        this.presenter.vm.aclId || ('' as UUID),
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
    this.updateAclUseCase.validate(
      new UpdateAclRequest(
        this.presenter.vm.aclId || ('' as UUID),
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
