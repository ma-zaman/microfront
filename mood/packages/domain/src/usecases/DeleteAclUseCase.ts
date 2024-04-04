import {
  AclRepository,
  DeleteAclRequest,
  DeleteAclPresentation,
  DeleteAclFields,
  AclBuilder
} from '@mood/domain'

export class DeleteAclUseCase {
  constructor(private aclRepository: AclRepository) {}

  async execute(request: DeleteAclRequest, presenter: DeleteAclPresentation) {
    const errors = this.validate(request, presenter)

    if (errors.size) {
      return
    }

    const acl = new AclBuilder()
      .withId(request.id)
      .withOwner(request.owner)
      .withOwnerType(request.ownerType)
      .withRole(request.role)
      .withTenantName(request.tenantName)
      .withTenantId(request.tenantId)
      .build()

    presenter.notifyDeletingAclInfo()

    this.aclRepository
      .deleteAcl(acl)
      .then(() => presenter.notifyAclDeleted(acl))
      .catch((err: Error) => presenter.notifyDeleteAclError(err.message))
  }

  validate(
    request: DeleteAclRequest,
    presenter: DeleteAclPresentation
  ): Map<DeleteAclFields, string> {
    const errors = new Map<DeleteAclFields, string>()
    if (!request.id) {
      errors.set(DeleteAclFields.id, 'thisFieldIsRequired')
    }

    if (!request.owner) {
      errors.set(DeleteAclFields.owner, 'thisFieldIsRequired')
    }

    if (!request.ownerType) {
      errors.set(DeleteAclFields.ownerType, 'OwnerTypeIsRequired')
    }

    if (!request.role) {
      errors.set(DeleteAclFields.role, 'RoleIsRequired')
    }

    if (!request.acls) {
      errors.set(DeleteAclFields.acls, 'aclsArrayNotInitialized')
    }

    const admins = request.acls.filter((acl) => acl.role === 'administrator')
    if (request.role === 'administrator' && admins.length <= 1) {
      errors.set(DeleteAclFields.acls, 'canTDeleteLastAdmin')
    }

    if (!request.tenantId) {
      errors.set(DeleteAclFields.tenantId, 'tenantIdIsRequired')
    }

    presenter.notifyDeleteAclFieldError(errors)
    return errors
  }
}
