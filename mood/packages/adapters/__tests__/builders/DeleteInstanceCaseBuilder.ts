import {
  DeleteInstanceUseCase,
  DeleteInstanceRequest,
  DeleteInstanceErrors,
  DeleteInstancePresentation,
  DeleteInstanceFields
} from '@mood/domain'

export class DeleteInstanceUseCaseBuilder {
  private execute: (
    deleteInstanceRequest: DeleteInstanceRequest,
    presenter: DeleteInstancePresentation
  ) => Promise<void> = () => Promise.resolve()

  private validate: (
    deleteInstanceRequest: DeleteInstanceRequest,
    presenter: DeleteInstancePresentation
  ) => DeleteInstanceErrors = () => new Map<DeleteInstanceFields, string>()

  withExecute(
    execute: (
      deleteInstanceRequest: DeleteInstanceRequest,
      presenter: DeleteInstancePresentation
    ) => Promise<void>
  ) {
    this.execute = execute
    return this
  }

  withValidate(
    validate: (
      deleteInstanceRequest: DeleteInstanceRequest,
      presenter: DeleteInstancePresentation
    ) => DeleteInstanceErrors
  ) {
    this.validate = validate
    return this
  }

  build(): DeleteInstanceUseCase {
    return {
      execute: this.execute,
      validate: this.validate
    } as DeleteInstanceUseCase
  }
}
