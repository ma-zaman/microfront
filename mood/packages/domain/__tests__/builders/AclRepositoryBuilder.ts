import { Acl, AclRepository } from '@mood/domain'

export class AclRepositoryBuilder {
  private listAcl: (tenantName: string) => Promise<Acl[]> = () => Promise.resolve([])
  private addAcl: (acl: Acl) => Promise<void> = () => Promise.resolve()
  private updateAcl: (acl: Acl) => Promise<void> = () => Promise.resolve()
  private deleteAcl: (acl: Acl) => Promise<void> = () => Promise.resolve()

  withGetAcls(listAcl: (tenantName: string) => Promise<Acl[]>) {
    this.listAcl = listAcl
    return this
  }

  withAddAcl(addAcl: (acl: Acl) => Promise<void>) {
    this.addAcl = addAcl
    return this
  }

  withUpdateAcl(updateAcl: (acl: Acl) => Promise<void>) {
    this.updateAcl = updateAcl
    return this
  }

  withDeleteAcl(deleteAcl: (acl: Acl) => Promise<void>) {
    this.deleteAcl = deleteAcl
    return this
  }

  build(): AclRepository {
    return {
      getAcls: this.listAcl,
      addAcl: this.addAcl,
      updateAcl: this.updateAcl,
      deleteAcl: this.deleteAcl
    }
  }
}
