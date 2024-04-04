import {
  AddAclErrors,
  AddAclPresentation,
  NewAclFields,
  AddAclRequest,
  AddAclUseCase
} from '@mood/domain'

export class AddAclUseCaseBuilder {
  private execute: (addAclRequest: AddAclRequest, presenter: AddAclPresentation) => Promise<void> =
    () => Promise.resolve()
  private validate: (addAclRequest: AddAclRequest, presenter: AddAclPresentation) => AddAclErrors =
    () => new Map<NewAclFields, string>()

  withExecute(
    execute: (addAclRequest: AddAclRequest, presenter: AddAclPresentation) => Promise<void>
  ) {
    this.execute = execute
    return this
  }

  withValidate(
    validate: (addAclRequest: AddAclRequest, presenter: AddAclPresentation) => AddAclErrors
  ) {
    this.validate = validate
    return this
  }

  build(): AddAclUseCase {
    return {
      execute: this.execute,
      validate: this.validate
    } as AddAclUseCase
  }
}
