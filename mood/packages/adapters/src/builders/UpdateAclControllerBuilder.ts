import { Acl, AclOwnerTypes, RoleTypes } from '@mood/domain'
import { Subscriber, UpdateAclPresenterVM, UpdateAclController } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class UpdateAclControllerBuilder {
  private subscribeVM: (subscriber: Subscriber<UpdateAclPresenterVM>) => void = (subscriber) =>
    subscriber(this.vm)
  private validateAclId: (aclId: UUID) => void = () => null
  private validateAclOwner: (aclOwner: string) => void = () => null
  private validateAclOwnerType: (aclOwnerType: AclOwnerTypes) => void = () => null
  private validateAclRole: (aclRole: RoleTypes) => void = () => null
  private validateAclTenantName: (aclTenantName: string) => void = () => null
  private validateAclTenantId: (aclTenantId: UUID) => void = () => null
  private update: () => void = () => null

  constructor(private vm: UpdateAclPresenterVM = new UpdateAclPresenterVM()) {}

  withValidateAclId(validateAclId: (aclId: UUID) => Promise<void>) {
    this.validateAclId = validateAclId
    return this
  }

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

  withUpdate(update: () => Promise<void>) {
    this.update = update
    return this
  }

  build(): UpdateAclController {
    return {
      vm: this.vm,
      subscribeVM: this.subscribeVM,
      validateAclId: this.validateAclId,
      validateAclOwner: this.validateAclOwner,
      validateAclOwnerType: this.validateAclOwnerType,
      validateAclRole: this.validateAclRole,
      validateAclTenantName: this.validateAclTenantName,
      update: this.update
    } as UpdateAclController
  }
}
