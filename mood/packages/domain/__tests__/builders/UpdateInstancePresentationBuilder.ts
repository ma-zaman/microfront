import { UpdateInstanceErrors, UpdateInstancePresentation, Instance } from '@mood/domain'

export class UpdateInstancePresentationBuilder {
  private notifyUpdateInstanceFieldError: (errors: UpdateInstanceErrors) => void = () => null
  private notifyInstanceUpdated: (instance: Instance) => void = () => null
  private notifyUpdateInstanceError: (error: string) => void = () => null
  private notifyUpdatingInstanceInfo: () => void = () => null

  withNotifyInstanceUpdated(notifyInstanceUpdated: (instance: Instance) => void) {
    this.notifyInstanceUpdated = notifyInstanceUpdated
    return this
  }

  withNotifyUpdateInstanceFieldError(
    notifyUpdateInstanceFieldError: (errors: UpdateInstanceErrors) => void
  ) {
    this.notifyUpdateInstanceFieldError = notifyUpdateInstanceFieldError
    return this
  }

  withNotifyUpdateInstanceError(notifyUpdateInstanceError: (error: string) => void) {
    this.notifyUpdateInstanceError = notifyUpdateInstanceError
    return this
  }

  withNotifyUpdatingInstanceInfo(notifyUpdatingInstanceInfo: () => void) {
    this.notifyUpdatingInstanceInfo = notifyUpdatingInstanceInfo
    return this
  }

  build(): UpdateInstancePresentation {
    return {
      notifyUpdateInstanceError: this.notifyUpdateInstanceError,
      notifyUpdateInstanceFieldError: this.notifyUpdateInstanceFieldError,
      notifyInstanceUpdated: this.notifyInstanceUpdated,
      notifyUpdatingInstanceInfo: this.notifyUpdatingInstanceInfo
    }
  }
}
