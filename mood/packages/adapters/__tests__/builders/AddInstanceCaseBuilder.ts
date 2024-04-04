import {
  AddInstanceErrors,
  AddInstancePresentation,
  NewInstanceFields,
  AddInstanceRequest,
  AddInstanceUseCase
} from '@mood/domain'

export class AddInstanceUseCaseBuilder {
  private execute: (
    addInstanceRequest: AddInstanceRequest,
    presenter: AddInstancePresentation
  ) => Promise<void> = () => Promise.resolve()
  private validate: (
    addInstanceRequest: AddInstanceRequest,
    presenter: AddInstancePresentation
  ) => AddInstanceErrors = () => new Map<NewInstanceFields, string>()

  withExecute(
    execute: (
      addInstanceRequest: AddInstanceRequest,
      presenter: AddInstancePresentation
    ) => Promise<void>
  ) {
    this.execute = execute
    return this
  }

  withValidate(
    validate: (
      addInstanceRequest: AddInstanceRequest,
      presenter: AddInstancePresentation
    ) => AddInstanceErrors
  ) {
    this.validate = validate
    return this
  }

  build(): AddInstanceUseCase {
    return {
      execute: this.execute,
      validate: this.validate
    } as AddInstanceUseCase
  }
}
