import { Instance } from '@mood/domain'

export enum DeleteInstanceFields {
  id = 'id',
  name = 'name',
  instanceToDelete = 'instanceToDelete',
  instanceType = 'instanceType',
  tenantName = 'tenantName',
  tenantId = 'tenantId'
}

export type DeleteInstanceErrors = Map<DeleteInstanceFields, string>

export interface DeleteInstancePresentation {
  notifyDeleteInstanceFieldError(errors: DeleteInstanceErrors): void
  notifyDeleteInstanceError(error: string): void
  notifyInstanceDeleted(instance: Instance): void
  notifyDeletingInstanceInfo(): void
}
