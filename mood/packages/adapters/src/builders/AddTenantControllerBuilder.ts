import { Subscriber, AddTenantPresenterVM, AddTenantController } from '@mood/web-adapters'

export class AddTenantControllerBuilder {
  private subscribeVM: (subscriber: Subscriber<AddTenantPresenterVM>) => void = (subscriber) =>
    subscriber(this.vm)
  private validateTenantName: (tenantName: string) => void = () => null
  private validateTenantDescription: (tenantDescription: string) => void = () => null
  private validateTenantLabels: (tenantLabels: Map<string, string>) => void = () => null
  private create: () => void = () => null

  constructor(private vm: AddTenantPresenterVM = new AddTenantPresenterVM()) {}

  withValidateTenantName(validateTenantName: (tenantName: string) => Promise<void>) {
    this.validateTenantName = validateTenantName
    return this
  }

  withValidateTenantDescription(
    validateTenantDescription: (tenantDescription: string) => Promise<void>
  ) {
    this.validateTenantDescription = validateTenantDescription
    return this
  }

  withValidateTenantLabels(
    validateTenantLabels: (tenantLabels: Map<string, string>) => Promise<void>
  ) {
    this.validateTenantLabels = validateTenantLabels
    return this
  }

  withCreate(create: () => Promise<void>) {
    this.create = create
    return this
  }

  build(): AddTenantController {
    return {
      vm: this.vm,
      subscribeVM: this.subscribeVM,
      validateTenantName: this.validateTenantName,
      validateTenantDescription: this.validateTenantDescription,
      validateTenantLabels: this.validateTenantLabels,
      create: this.create
    } as AddTenantController
  }
}
