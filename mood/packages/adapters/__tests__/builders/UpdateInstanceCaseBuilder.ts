import {
  UpdateInstanceErrors,
  UpdateInstancePresentation,
  UpdateInstanceRequest,
  UpdateInstanceUseCase,
  UpdateInstanceFields
} from '@mood/domain'

export class UpdateInstanceUseCaseBuilder {
  private execute: (
    updateInstanceRequest: UpdateInstanceRequest,
    presenter: UpdateInstancePresentation
  ) => Promise<void> = () => Promise.resolve()
  private validate: (
    updateInstanceRequest: UpdateInstanceRequest,
    presenter: UpdateInstancePresentation
  ) => UpdateInstanceErrors = () => new Map<UpdateInstanceFields, string>()

  withExecute(
    execute: (
      updateInstanceRequest: UpdateInstanceRequest,
      presenter: UpdateInstancePresentation
    ) => Promise<void>
  ) {
    this.execute = execute
    return this
  }

  withValidate(
    validate: (
      updateInstanceRequest: UpdateInstanceRequest,
      presenter: UpdateInstancePresentation
    ) => UpdateInstanceErrors
  ) {
    this.validate = validate
    return this
  }

  build(): UpdateInstanceUseCase {
    return {
      execute: this.execute,
      validate: this.validate
    } as UpdateInstanceUseCase
  }
}
