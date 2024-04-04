import {
  DeleteAclErrors,
  DeleteAclPresentation,
  DeleteAclRequest,
  DeleteAclUseCase,
  DeleteAclFields
} from '@mood/domain'

export class DeleteAclUseCaseBuilder {
  private execute: (
    updateAclRequest: DeleteAclRequest,
    presenter: DeleteAclPresentation
  ) => Promise<void> = () => Promise.resolve()
  private validate: (
    updateAclRequest: DeleteAclRequest,
    presenter: DeleteAclPresentation
  ) => DeleteAclErrors = () => new Map<DeleteAclFields, string>()

  withExecute(
    execute: (updateAclRequest: DeleteAclRequest, presenter: DeleteAclPresentation) => Promise<void>
  ) {
    this.execute = execute
    return this
  }

  withValidate(
    validate: (
      updateAclRequest: DeleteAclRequest,
      presenter: DeleteAclPresentation
    ) => DeleteAclErrors
  ) {
    this.validate = validate
    return this
  }

  build(): DeleteAclUseCase {
    return {
      execute: this.execute,
      validate: this.validate
    } as DeleteAclUseCase
  }
}
