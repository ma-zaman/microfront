import { AddAclErrors, AddAclPresentation, Acl } from '@mood/domain'

export class AddAclPresentationBuilder {
  private notifyNewAclFieldError: (errors: AddAclErrors) => void = () => null
  private notifyAclAdded: (tenant: Acl) => void = () => null
  private notifyAddAclError: (error: string) => void = () => null
  private notifyCreatingAclInfo: () => void = () => null

  withNotifyAclAdded(notifyAclAdded: (tenant: Acl) => void) {
    this.notifyAclAdded = notifyAclAdded
    return this
  }

  withNotifyNewAclFieldError(notifyNewAclFieldError: (errors: AddAclErrors) => void) {
    this.notifyNewAclFieldError = notifyNewAclFieldError
    return this
  }

  withNotifyAddAclError(notifyAddAclError: (error: string) => void) {
    this.notifyAddAclError = notifyAddAclError
    return this
  }

  withNotifyCreatingAclInfo(notifyCreatingAclInfo: () => void) {
    this.notifyCreatingAclInfo = notifyCreatingAclInfo
    return this
  }

  build(): AddAclPresentation {
    return {
      notifyNewAclFieldError: this.notifyNewAclFieldError,
      notifyAclAdded: this.notifyAclAdded,
      notifyAddAclError: this.notifyAddAclError,
      notifyCreatingAclInfo: this.notifyCreatingAclInfo
    }
  }
}
