import { Subscriber } from '@mood/web-adapters'
import { DeleteInstanceController, DeleteInstancePresenterVM } from '@mood/web-adapters'

export class DeleteInstanceControllerBuilder {
  private subscribeVM: (subscriber: Subscriber<DeleteInstancePresenterVM>) => void = (subscriber) =>
    subscriber(this.vm)
  private validateInstanceName: (instanceName: string) => void = () => null
  private delete: () => void = () => null

  constructor(private vm: DeleteInstancePresenterVM = new DeleteInstancePresenterVM()) { }

  withValidateInstanceName(validateInstanceName: (instanceName: string) => Promise<void>) {
    this.validateInstanceName = validateInstanceName
    return this
  }

  withDelete(deleteInstance: () => Promise<void>) {
    this.delete = deleteInstance
    return this
  }

  build(): DeleteInstanceController {
    return {
      vm: this.vm,
      subscribeVM: this.subscribeVM,
      validateInstanceName: this.validateInstanceName,
      delete: this.delete
    } as DeleteInstanceController
  }
}
