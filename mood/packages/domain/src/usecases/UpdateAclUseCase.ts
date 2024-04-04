import {
  UpdateAclPresentation,
  UpdateAclRequest,
  UpdateAclFields,
  AclRepository,
  AclBuilder
} from '@mood/domain'

export class UpdateAclUseCase {
  constructor(private aclRepository: AclRepository) {}

  async execute(request: UpdateAclRequest, presenter: UpdateAclPresentation): Promise<void> {
    const errors = this.validate(request, presenter)
    if (errors.size) {
      return
    }

    presenter.notifyUpdatingAclInfo()

    const acl = new AclBuilder()
      .withId(request.id)
      .withOwner(request.owner)
      .withOwnerType(request.ownerType)
      .withRole(request.role)
      .withTenantId(request.tenantId)
      .withTenantName(request.tenantName)
      .build()

    this.aclRepository
      .updateAcl(acl)
      .then(() => presenter.notifyAclUpdated(acl))
      .catch((err: Error) => presenter.notifyUpdateAclError(err.message))
  }

  validate(
    request: UpdateAclRequest,
    presenter: UpdateAclPresentation
  ): Map<UpdateAclFields, string> {
    const errors = new Map<UpdateAclFields, string>()
    if (!request.id) {
      errors.set(UpdateAclFields.id, 'thisFieldIsRequired')
    }

    if (!request.owner) {
      errors.set(UpdateAclFields.owner, 'thisFieldIsRequired')
    }

    if (!request.ownerType) {
      errors.set(UpdateAclFields.ownerType, 'OwnerTypeIsRequired')
    }

    if (!request.role) {
      errors.set(UpdateAclFields.role, 'RoleIsRequired')
    }

    if (!request.tenantId) {
      errors.set(UpdateAclFields.tenantId, 'tenantIdIsRequired')
    }

    if (!request.tenantName) {
      errors.set(UpdateAclFields.tenantName, 'tenantNameIsRequired')
    }
    presenter.notifyUpdateAclFieldError(errors)
    return errors
  }
}
