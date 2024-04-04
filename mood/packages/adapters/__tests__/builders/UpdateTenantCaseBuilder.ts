import {
  UpdateTenantUseCase,
  UpdateTenantRequest,
  UpdateTenantErrors,
  UpdateTenantPresentation,
  UpdateTenantFields
} from '@mood/domain'

export class UpdateTenantUseCaseBuilder {
  private execute: (
    updateTenantRequest: UpdateTenantRequest,
    presenter: UpdateTenantPresentation
  ) => Promise<void> = () => Promise.resolve()
  private validate: (
    updateTenantRequest: UpdateTenantRequest,
    presenter: UpdateTenantPresentation
  ) => UpdateTenantErrors = () => new Map<UpdateTenantFields, string>()

  withExecute(
    execute: (
      updateTenantRequest: UpdateTenantRequest,
      presenter: UpdateTenantPresentation
    ) => Promise<void>
  ) {
    this.execute = execute
    return this
  }

  withValidate(
    validate: (
      updateTenantRequest: UpdateTenantRequest,
      presenter: UpdateTenantPresentation
    ) => UpdateTenantErrors
  ) {
    this.validate = validate
    return this
  }

  build(): UpdateTenantUseCase {
    return {
      execute: this.execute,
      validate: this.validate
    } as UpdateTenantUseCase
  }
}
