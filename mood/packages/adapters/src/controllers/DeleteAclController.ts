import { Acl, AclOwnerTypes, DeleteAclRequest, DeleteAclUseCase, RoleTypes } from '@mood/domain'
import { Controller, DeleteAclPresenter, DeleteAclPresenterVM } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class DeleteAclController extends Controller<DeleteAclPresenterVM> {
  constructor(
    private deleteAclUseCase: DeleteAclUseCase,
    private presenter: DeleteAclPresenter
  ) {
    super(presenter)
  }

  validateAcls(acls: Acl[]) {
    this.presenter.vm.acls = acls
    this.presenter.vm.aclsTouched = true
    this.validate()
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

  delete() {
    this.deleteAclUseCase.execute(
      new DeleteAclRequest(
        this.presenter.vm.acls || [],
        this.presenter.vm.aclId || ('' as UUID),
        this.presenter.vm.aclOwner || '',
        this.presenter.vm.aclOwnerType || 'user',
        this.presenter.vm.aclRole || 'viewer',
        this.presenter.vm.aclTenantName || '',
        this.presenter.vm.aclTenantId || ('' as UUID)
      ),
      this.presenter
    )
  }

  private validate() {
    this.deleteAclUseCase.validate(
      new DeleteAclRequest(
        this.presenter.vm.acls || [],
        this.presenter.vm.aclId || ('' as UUID),
        this.presenter.vm.aclOwner || '',
        this.presenter.vm.aclOwnerType || 'user',
        this.presenter.vm.aclRole || 'viewer',
        this.presenter.vm.aclTenantName || '',
        this.presenter.vm.aclTenantId || ('' as UUID)
      ),
      this.presenter
    )
  }
}
