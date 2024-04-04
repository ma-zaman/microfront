import { DeleteAclErrors, DeleteAclPresentation, Acl } from '@mood/domain'

export class DeleteAclPresentationBuilder {
  private notifyDeleteAclFieldError: (errors: DeleteAclErrors) => void = () => null
  private notifyDeleteAclError: (error: string) => void = () => null
  private notifyAclDeleted: (acl: Acl) => void = () => null
  private notifyDeletingAclInfo: () => void = () => null

  withNotifyAclDeleted(notifyAclDeleted: (acl: Acl) => void) {
    this.notifyAclDeleted = notifyAclDeleted
    return this
  }

  withNotifyDeletingAclInfo(notifyDeletingAclInfo: () => void) {
    this.notifyDeletingAclInfo = notifyDeletingAclInfo
    return this
  }

  withNotifyDeleteAclFieldError(notifyDeleteAclFieldError: (errors: DeleteAclErrors) => void) {
    this.notifyDeleteAclFieldError = notifyDeleteAclFieldError
    return this
  }

  withNotifyDeleteAclError(notifyDeleteAclError: (error: string) => void) {
    this.notifyDeleteAclError = notifyDeleteAclError
    return this
  }

  build(): DeleteAclPresentation {
    return {
      notifyDeleteAclError: this.notifyDeleteAclError,
      notifyDeleteAclFieldError: this.notifyDeleteAclFieldError,
      notifyAclDeleted: this.notifyAclDeleted,
      notifyDeletingAclInfo: this.notifyDeletingAclInfo
    }
  }
}
