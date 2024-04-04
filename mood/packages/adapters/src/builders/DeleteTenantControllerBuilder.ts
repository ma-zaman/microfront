import { Subscriber } from '@mood/web-adapters'
import { DeleteTenantController, DeleteTenantPresenterVM } from '@mood/web-adapters'

export class DeleteTenantControllerBuilder {
  private subscribeVM: (subscriber: Subscriber<DeleteTenantPresenterVM>) => void = (subscriber) =>
    subscriber(this.vm)
  private validateTenantName: (tenantName: string) => void = () => null
  private delete: () => void = () => null

  constructor(private vm: DeleteTenantPresenterVM = new DeleteTenantPresenterVM()) { }

  withValidateTenantName(validateTenantName: (tenantName: string) => Promise<void>) {
    this.validateTenantName = validateTenantName
    return this
  }

  withDelete(deleteTenant: () => Promise<void>) {
    this.delete = deleteTenant
    return this
  }

  build(): DeleteTenantController {
    return {
      vm: this.vm,
      subscribeVM: this.subscribeVM,
      validateTenantName: this.validateTenantName,
      delete: this.delete
    } as DeleteTenantController
  }
}
