import { Instance } from '@mood/domain'

export enum UpdateInstanceFields {
  instanceType = 'instanceType',
  name = 'name',
  visibility = 'visibility',
  description = 'description',
  tenantName = 'tenantName',
  tenantId = 'tenantId'
}

export type UpdateInstanceErrors = Map<UpdateInstanceFields, string>

export interface UpdateInstancePresentation {
  notifyUpdateInstanceFieldError(errors: UpdateInstanceErrors): void
  notifyUpdateInstanceError(error: string): void
  notifyInstanceUpdated(instance: Instance): void
  notifyUpdatingInstanceInfo(): void
}
