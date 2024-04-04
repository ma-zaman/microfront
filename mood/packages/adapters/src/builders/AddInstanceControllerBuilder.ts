import { InstanceTypes, InstanceVisibility } from '@mood/domain'
import { Subscriber, AddInstancePresenterVM, AddInstanceController } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class AddInstanceControllerBuilder {
  private subscribeVM: (subscriber: Subscriber<AddInstancePresenterVM>) => void = (subscriber) =>
    subscriber(this.vm)
  private validateInstanceName: (name: string) => void = () => null
  private validateInstanceDescription: (description: string) => void = () => null
  private validateInstanceTenantName: (tenantName: string) => void = () => null
  private validateInstanceTenantId: (tenantId: UUID) => void = () => null
  private validateInstanceVisibility: (visibility: InstanceVisibility) => void = () => null
  private validateInstanceType: (type: InstanceTypes) => void = () => null
  private create: () => void = () => null

  constructor(private vm: AddInstancePresenterVM = new AddInstancePresenterVM()) {}

  withValidateInstanceName(validateInstanceName: (name: string) => Promise<void>) {
    this.validateInstanceName = validateInstanceName
    return this
  }

  withValidateInstanceDescription(
    validateInstanceDescription: (description: string) => Promise<void>
  ) {
    this.validateInstanceDescription = validateInstanceDescription
    return this
  }

  withValidateInstanceTenantName(
    validateInstanceTenantName: (tenantName: string) => Promise<void>
  ) {
    this.validateInstanceTenantName = validateInstanceTenantName
    return this
  }

  withValidateInstanceTenantId(validateInstanceTenantId: (tenantId: UUID) => Promise<void>) {
    this.validateInstanceTenantId = validateInstanceTenantId
    return this
  }

  withValidateInstanceVisibility(
    validateInstanceVisibility: (visibility: InstanceVisibility) => Promise<void>
  ) {
    this.validateInstanceVisibility = validateInstanceVisibility
    return this
  }

  withValidateInstanceType(validateInstanceType: (type: InstanceTypes) => Promise<void>) {
    this.validateInstanceType = validateInstanceType
    return this
  }

  withCreate(create: () => Promise<void>) {
    this.create = create
    return this
  }

  build(): AddInstanceController {
    return {
      vm: this.vm,
      subscribeVM: this.subscribeVM,
      validateInstanceName: this.validateInstanceName,
      validateInstanceDescription: this.validateInstanceDescription,
      validateInstanceTenantName: this.validateInstanceTenantName,
      validateInstanceTenantId: this.validateInstanceTenantId,
      validateInstanceVisibility: this.validateInstanceVisibility,
      validateInstanceType: this.validateInstanceType,
      create: this.create
    } as AddInstanceController
  }
}
