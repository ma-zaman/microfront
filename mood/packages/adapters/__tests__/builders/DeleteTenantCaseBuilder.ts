import { DeleteTenantUseCase, DeleteTenantRequest, DeleteTenantErrors, DeleteTenantPresentation, DeleteTenantFields } from '@mood/domain'

export class DeleteTenantUseCaseBuilder {
  private execute: (
    deleteTenantRequest: DeleteTenantRequest,
    presenter: DeleteTenantPresentation
  ) => Promise<void> = () => Promise.resolve()

  private validate: (
    deleteTenantRequest: DeleteTenantRequest,
    presenter: DeleteTenantPresentation
  ) => DeleteTenantErrors = () => new Map<DeleteTenantFields, string>()

  withExecute(
    execute: (deleteTenantRequest: DeleteTenantRequest, presenter: DeleteTenantPresentation) => Promise<void>
  ) {
    this.execute = execute
    return this
  }

  withValidate(
    validate: (
      deleteTenantRequest: DeleteTenantRequest,
      presenter: DeleteTenantPresentation
    ) => DeleteTenantErrors
  ) {
    this.validate = validate
    return this
  }

  build(): DeleteTenantUseCase {
    return {
      execute: this.execute,
      validate: this.validate
    } as DeleteTenantUseCase
  }
}
