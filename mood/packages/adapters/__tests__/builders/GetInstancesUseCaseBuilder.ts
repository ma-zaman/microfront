import { GetInstancesPresentation, GetInstancesRequest, GetInstancesUseCase } from '@mood/domain'

export class GetInstancesUseCaseBuilder {
  private execute: (
    request: GetInstancesRequest,
    presenter: GetInstancesPresentation
  ) => Promise<void> = () => Promise.resolve()

  withExecute(
    execute: (request: GetInstancesRequest, presenter: GetInstancesPresentation) => Promise<void>
  ) {
    this.execute = execute
    return this
  }

  build(): GetInstancesUseCase {
    return { execute: this.execute } as GetInstancesUseCase
  }
}
