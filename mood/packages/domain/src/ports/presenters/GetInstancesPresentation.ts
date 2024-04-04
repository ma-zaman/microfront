import { Instance } from '@mood/domain'

export interface GetInstancesPresentation {
  loadingInstances(): void
  notifyInstancesError(message: string): any
  displayInstances(acls: Instance[]): void
}
