import { AddInstanceErrors, AddInstancePresentation, Instance } from '@mood/domain'

export class AddInstancePresentationBuilder {
  private notifyNewInstanceFieldError: (errors: AddInstanceErrors) => void = () => null
  private notifyInstanceAdded: (instance: Instance) => void = () => null
  private notifyAddInstanceError: (error: string) => void = () => null
  private notifyCreatingInstanceInfo: () => void = () => null

  withNotifyInstanceAdded(notifyInstanceAdded: (instance: Instance) => void) {
    this.notifyInstanceAdded = notifyInstanceAdded
    return this
  }

  withNotifyNewInstanceFieldError(
    notifyNewInstanceFieldError: (errors: AddInstanceErrors) => void
  ) {
    this.notifyNewInstanceFieldError = notifyNewInstanceFieldError
    return this
  }

  withNotifyAddInstanceError(notifyAddInstanceError: (error: string) => void) {
    this.notifyAddInstanceError = notifyAddInstanceError
    return this
  }

  withNotifyCreatingInstanceInfo(notifyCreatingInstanceInfo: () => void) {
    this.notifyCreatingInstanceInfo = notifyCreatingInstanceInfo
    return this
  }

  build(): AddInstancePresentation {
    return {
      notifyNewInstanceFieldError: this.notifyNewInstanceFieldError,
      notifyInstanceAdded: this.notifyInstanceAdded,
      notifyAddInstanceError: this.notifyAddInstanceError,
      notifyCreatingInstanceInfo: this.notifyCreatingInstanceInfo
    }
  }
}
