import { Instance } from '@mood/domain'

export enum NewInstanceFields {
  instanceType = 'instanceType',
  name = 'name',
  visibility = 'visibility',
  tenantName = 'tenantName',
  tenantId = 'tenantId'
}

export type AddInstanceErrors = Map<NewInstanceFields, string>

export interface AddInstancePresentation {
  notifyNewInstanceFieldError(errors: AddInstanceErrors): void
  notifyInstanceAdded(instance: Instance): void
  notifyAddInstanceError(error: string): void
  notifyCreatingInstanceInfo(): void
}
