import { GetAclsRequest, GetAclsPresentation, AclRepository } from '@mood/domain'

export class GetAclsUseCase {
  constructor(private aclRepository: AclRepository) {}

  async execute(request: GetAclsRequest, presenter: GetAclsPresentation) {
    presenter.loadingAcls()
    this.aclRepository
      .getAcls(request.tenantId, request.tenantName)
      .then((acls) => presenter.displayAcls(acls))
      .catch((err: Error) => presenter.notifyAclsError(err.message))
  }
}
