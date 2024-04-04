import { Tenant } from '@mood/domain'
import { Subscriber, UpdateTenantPresenterVM, UpdateTenantController } from '@mood/web-adapters'

export class UpdateTenantControllerBuilder {
  private subscribeVM: (subscriber: Subscriber<UpdateTenantPresenterVM>) => void = (subscriber) =>
    subscriber(this.vm)
  private validateTenant: (tenant: Tenant) => void = () => null
  private update: () => void = () => null

  constructor(private vm: UpdateTenantPresenterVM = new UpdateTenantPresenterVM()) {}

  withValidateTenant(validateTenant: (tenant: Tenant) => Promise<void>) {
    this.validateTenant = validateTenant
    return this
  }

  withUpdate(update: () => Promise<void>) {
    this.update = update
    return this
  }

  build(): UpdateTenantController {
    return {
      vm: this.vm,
      subscribeVM: this.subscribeVM,
      validateTenant: this.validateTenant,
      update: this.update
    } as UpdateTenantController
  }
}
