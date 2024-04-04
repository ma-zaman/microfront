import { AclOwnerTypes, RoleTypes } from '@mood/domain'
import { Subscriber, AddAclPresenterVM, AddAclController } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class AddAclControllerBuilder {
  private subscribeVM: (subscriber: Subscriber<AddAclPresenterVM>) => void = (subscriber) =>
    subscriber(this.vm)
  private validateAclOwner: (aclOwner: string) => void = () => null
  private validateAclOwnerType: (aclOwnerType: AclOwnerTypes) => void = () => null
  private validateAclRole: (aclRole: RoleTypes) => void = () => null
  private validateAclTenantName: (aclTenantName: string) => void = () => null
  private validateAclTenantId: (aclTenantId: UUID) => void = () => null
  private create: () => void = () => null

  constructor(private vm: AddAclPresenterVM = new AddAclPresenterVM()) {}

  withValidateAclOwner(validateAclOwner: (aclOwner: string) => Promise<void>) {
    this.validateAclOwner = validateAclOwner
    return this
  }

  withValidateAclOwnerType(validateAclOwnerType: (aclOwnerType: AclOwnerTypes) => Promise<void>) {
    this.validateAclOwnerType = validateAclOwnerType
    return this
  }

  withValidateAclRole(validateAclRole: (aclRole: RoleTypes) => Promise<void>) {
    this.validateAclRole = validateAclRole
    return this
  }

  withValidateAclTenantName(validateAclTenantName: (aclTenantName: string) => Promise<void>) {
    this.validateAclTenantName = validateAclTenantName
    return this
  }

  withValidateAclTenantId(validateAclTenantId: (aclTenantId: UUID) => Promise<void>) {
    this.validateAclTenantId = validateAclTenantId
    return this
  }

  withCreate(create: () => Promise<void>) {
    this.create = create
    return this
  }

  build(): AddAclController {
    return {
      vm: this.vm,
      subscribeVM: this.subscribeVM,
      validateAclOwner: this.validateAclOwner,
      validateAclOwnerType: this.validateAclOwnerType,
      validateAclRole: this.validateAclRole,
      validateAclTenantName: this.validateAclTenantName,
      validateAclTenantId: this.validateAclTenantId,
      create: this.create
    } as AddAclController
  }
}
