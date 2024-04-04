import { Acl, AclOwnerTypes, RoleTypes } from '@mood/domain'
import { Subscriber, DeleteAclController, DeleteAclPresenterVM } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class DeleteAclControllerBuilder {
  private subscribeVM: (subscriber: Subscriber<DeleteAclPresenterVM>) => void = (subscriber) =>
    subscriber(this.vm)
  private validateAcls: (acls: Acl[]) => void = () => null
  private validateAclId: (aclId: UUID) => void = () => null
  private validateAclOwner: (aclOwner: string) => void = () => null
  private validateAclOwnerType: (aclOwnerType: AclOwnerTypes) => void = () => null
  private validateAclRole: (aclRole: RoleTypes) => void = () => null
  private validateAclTenantName: (aclTenantName: string) => void = () => null
  private delete: () => void = () => null

  constructor(private vm: DeleteAclPresenterVM = new DeleteAclPresenterVM()) {}

  withValidateAcls(validateAcls: (acls: Acl[]) => Promise<void>) {
    this.validateAcls = validateAcls
    return this
  }

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

  withDelete(deleteAcl: () => Promise<void>) {
    this.delete = deleteAcl
    return this
  }

  build(): DeleteAclController {
    return {
      vm: this.vm,
      subscribeVM: this.subscribeVM,
      validateAcls: this.validateAcls,
      validateAclId: this.validateAclId,
      validateAclOwner: this.validateAclOwner,
      validateAclOwnerType: this.validateAclOwnerType,
      validateAclRole: this.validateAclRole,
      validateAclTenantName: this.validateAclTenantName,
      delete: this.delete
    } as DeleteAclController
  }
}
