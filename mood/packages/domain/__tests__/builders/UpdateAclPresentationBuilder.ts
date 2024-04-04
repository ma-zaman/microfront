import { UpdateAclErrors, UpdateAclPresentation, Acl } from '@mood/domain'

export class UpdateAclPresentationBuilder {
  private notifyUpdateAclFieldError: (errors: UpdateAclErrors) => void = () => null
  private notifyAclUpdated: (acl: Acl) => void = () => null
  private notifyUpdateAclError: (error: string) => void = () => null
  private notifyUpdatingAclInfo: () => void = () => null

  withNotifyAclUpdated(notifyAclUpdated: (acl: Acl) => void) {
    this.notifyAclUpdated = notifyAclUpdated
    return this
  }

  withNotifyUpdateAclFieldError(notifyUpdateAclFieldError: (errors: UpdateAclErrors) => void) {
    this.notifyUpdateAclFieldError = notifyUpdateAclFieldError
    return this
  }

  withNotifyUpdateAclError(notifyUpdateAclError: (error: string) => void) {
    this.notifyUpdateAclError = notifyUpdateAclError
    return this
  }

  withNotifyUpdatingAclInfo(notifyUpdatingAclInfo: () => void) {
    this.notifyUpdatingAclInfo = notifyUpdatingAclInfo
    return this
  }

  build(): UpdateAclPresentation {
    return {
      notifyUpdateAclError: this.notifyUpdateAclError,
      notifyUpdateAclFieldError: this.notifyUpdateAclFieldError,
      notifyAclUpdated: this.notifyAclUpdated,
      notifyUpdatingAclInfo: this.notifyUpdatingAclInfo
    }
  }
}
