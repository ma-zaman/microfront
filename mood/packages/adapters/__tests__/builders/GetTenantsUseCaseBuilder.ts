import { GetTenantsPresentation, GetTenantsUseCase } from '@mood/domain'

export class GetTenantsUseCaseBuilder {
  private execute: (presenter: GetTenantsPresentation) => Promise<void> = () => Promise.resolve();

  withExecute(execute: (presenter: GetTenantsPresentation) => Promise<void>) {
    this.execute = execute;
    return this;
  }

  build(): GetTenantsUseCase {
    return { execute: this.execute } as GetTenantsUseCase
  }
}
