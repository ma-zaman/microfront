import {
  UpdateAclErrors,
  UpdateAclPresentation,
  UpdateAclRequest,
  UpdateAclUseCase,
  UpdateAclFields
} from '@mood/domain'

export class UpdateAclUseCaseBuilder {
  private execute: (
    updateAclRequest: UpdateAclRequest,
    presenter: UpdateAclPresentation
  ) => Promise<void> = () => Promise.resolve()
  private validate: (
    updateAclRequest: UpdateAclRequest,
    presenter: UpdateAclPresentation
  ) => UpdateAclErrors = () => new Map<UpdateAclFields, string>()

  withExecute(
    execute: (updateAclRequest: UpdateAclRequest, presenter: UpdateAclPresentation) => Promise<void>
  ) {
    this.execute = execute
    return this
  }

  withValidate(
    validate: (
      updateAclRequest: UpdateAclRequest,
      presenter: UpdateAclPresentation
    ) => UpdateAclErrors
  ) {
    this.validate = validate
    return this
  }

  build(): UpdateAclUseCase {
    return {
      execute: this.execute,
      validate: this.validate
    } as UpdateAclUseCase
  }
}
