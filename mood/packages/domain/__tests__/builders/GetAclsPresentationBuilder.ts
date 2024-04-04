import { GetAclsPresentation, Acl } from '@mood/domain'

export class GetAclsPresentationBuilder {
  private loadingAcls: () => void = () => null
  private notifyAclsError: (message: string) => void = () => null
  private displayAcls: (acls: Acl[]) => void = () => null

  withDisplayAcls(displayAcls: (acls: Acl[]) => void) {
    this.displayAcls = displayAcls
    return this
  }

  withLoadingAcls(loadingAcls: () => void) {
    this.loadingAcls = loadingAcls
    return this
  }

  withNotifyAclsError(notifyAclsError: (message: string) => void) {
    this.notifyAclsError = notifyAclsError
    return this
  }

  build(): GetAclsPresentation {
    return {
      displayAcls: this.displayAcls,
      loadingAcls: this.loadingAcls,
      notifyAclsError: this.notifyAclsError
    }
  }
}
