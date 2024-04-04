import {
  AddAclPresentation,
  AddAclRequest,
  NewAclFields,
  AclBuilder,
  AclRepository
} from '@mood/domain'

export class AddAclUseCase {
  constructor(private aclRepository: AclRepository) {}

  async execute(request: AddAclRequest, presenter: AddAclPresentation): Promise<void> {
    const errors = this.validate(request, presenter)

    if (errors.size) {
      return
    }

    const acl = new AclBuilder()
      .withOwner(request.owner)
      .withOwnerType(request.ownerType)
      .withRole(request.role)
      .withTenantId(request.tenantId)
      .withTenantName(request.tenantName)
      .build()

    presenter.notifyCreatingAclInfo()

    this.aclRepository
      .addAcl(acl)
      .then(() => presenter.notifyAclAdded(acl))
      .catch((err: Error) => presenter.notifyAddAclError(err.message))
  }

  validate(request: AddAclRequest, presenter: AddAclPresentation): Map<NewAclFields, string> {
    const errors = new Map<NewAclFields, string>()
    if (!request.owner) {
      errors.set(NewAclFields.owner, 'thisFieldIsRequired')
    }

    if (!request.ownerType) {
      errors.set(NewAclFields.ownerType, 'OwnerTypeIsRequired')
    }

    if (!request.role) {
      errors.set(NewAclFields.role, 'RoleIsRequired')
    }

    if (!request.tenantName) {
      errors.set(NewAclFields.tenantName, 'tenantNameIsRequired')
    }

    if (!request.tenantId) {
      errors.set(NewAclFields.tenantId, 'tenantIdIsRequired')
    }
    presenter.notifyNewAclFieldError(errors)
    return errors
  }
}
