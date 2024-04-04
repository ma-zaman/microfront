import {
  AddTenantErrors,
  AddTenantPresentation,
  NewTenantFields,
  AddTenantRequest,
  AddTenantUseCase
} from '@mood/domain'

export class AddTenantUseCaseBuilder {
  private execute: (
    addTenantRequest: AddTenantRequest,
    presenter: AddTenantPresentation
  ) => Promise<void> = () => Promise.resolve()
  private validate: (
    addTenantRequest: AddTenantRequest,
    presenter: AddTenantPresentation
  ) => AddTenantErrors = () => new Map<NewTenantFields, string>()

  withExecute(
    execute: (addTenantRequest: AddTenantRequest, presenter: AddTenantPresentation) => Promise<void>
  ) {
    this.execute = execute
    return this
  }

  withValidate(
    validate: (
      addTenantRequest: AddTenantRequest,
      presenter: AddTenantPresentation
    ) => AddTenantErrors
  ) {
    this.validate = validate
    return this
  }

  build(): AddTenantUseCase {
    return {
      execute: this.execute,
      validate: this.validate
    } as AddTenantUseCase
  }
}
