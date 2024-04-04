import { Acl } from '@mood/domain'

export interface GetAclsPresentation {
  loadingAcls(): void
  notifyAclsError(message: string): any
  displayAcls(acls: Acl[]): void
}
