import { DeleteInstanceErrors, DeleteInstancePresentation, Instance } from '@mood/domain'

export class DeleteInstancePresentationBuilder {
  private notifyDeleteInstanceFieldError: (errors: DeleteInstanceErrors) => void = () => null
  private notifyDeleteInstanceError: (error: string) => void = () => null
  private notifyInstanceDeleted: (instance: Instance) => void = () => null
  private notifyDeletingInstanceInfo: () => void = () => null

  withNotifyInstanceDeleted(notifyInstanceDeleted: (instance: Instance) => void) {
    this.notifyInstanceDeleted = notifyInstanceDeleted
    return this
  }

  withNotifyDeletingInstanceInfo(notifyDeletingInstanceInfo: () => void) {
    this.notifyDeletingInstanceInfo = notifyDeletingInstanceInfo
    return this
  }

  withNotifyDeleteInstanceFieldError(
    notifyDeleteInstanceFieldError: (errors: DeleteInstanceErrors) => void
  ) {
    this.notifyDeleteInstanceFieldError = notifyDeleteInstanceFieldError
    return this
  }

  withNotifyDeleteInstanceError(notifyDeleteInstanceError: (error: string) => void) {
    this.notifyDeleteInstanceError = notifyDeleteInstanceError
    return this
  }

  build(): DeleteInstancePresentation {
    return {
      notifyDeleteInstanceError: this.notifyDeleteInstanceError,
      notifyDeleteInstanceFieldError: this.notifyDeleteInstanceFieldError,
      notifyInstanceDeleted: this.notifyInstanceDeleted,
      notifyDeletingInstanceInfo: this.notifyDeletingInstanceInfo
    }
  }
}
