import { GetAclsPresentation, GetAclsRequest, GetAclsUseCase } from '@mood/domain'

export class GetAclsUseCaseBuilder {
  private execute: (request: GetAclsRequest, presenter: GetAclsPresentation) => Promise<void> =
    () => Promise.resolve()

  withExecute(execute: (request: GetAclsRequest, presenter: GetAclsPresentation) => Promise<void>) {
    this.execute = execute
    return this
  }

  build(): GetAclsUseCase {
    return { execute: this.execute } as GetAclsUseCase
  }
}
