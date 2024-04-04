import {
  AddInstancePresentation,
  AddInstanceRequest,
  NewInstanceFields,
  InstanceBuilder,
  InstanceRepository
} from '@mood/domain'

export class AddInstanceUseCase {
  constructor(private instanceRepository: InstanceRepository) {}

  async execute(request: AddInstanceRequest, presenter: AddInstancePresentation): Promise<void> {
    const errors = this.validate(request, presenter)

    if (errors.size) {
      return
    }

    const instance = new InstanceBuilder()
      .withInstanceType(request.instanceType)
      .withName(request.name)
      .withTenantName(request.tenantName)
      .withTenantId(request.tenantId)
      .withVisibility(request.visibility)
      .withDescription(request.description)
      .build()

    presenter.notifyCreatingInstanceInfo()

    this.instanceRepository
      .addInstance(instance)
      .then(() => presenter.notifyInstanceAdded(instance))
      .catch((err: Error) => presenter.notifyAddInstanceError(err.message))
  }

  validate(
    request: AddInstanceRequest,
    presenter: AddInstancePresentation
  ): Map<NewInstanceFields, string> {
    const errors = new Map<NewInstanceFields, string>()
    // TODO: Refactor test
    if (!request.name || request.name.trim().length < 3 || request.name.length > 30) {
      errors.set(NewInstanceFields.name, 'thisFieldMustContainBetween3And30Characters')
    } else if (
      request.name &&
      !/(?!^all$)(^[0-9a-zA-Z][0-9a-zA-Z-]+[0-9a-zA-Z]$)/.test(request.name)
    ) {
      errors.set(NewInstanceFields.name, 'onlyHyphenIsAllowed')
    }

    if (!request.instanceType) {
      errors.set(NewInstanceFields.instanceType, 'instanceTypeIsRequired')
    }

    if (!request.visibility) {
      errors.set(NewInstanceFields.visibility, 'visibilityIsRequired')
    }

    if (!request.tenantName) {
      errors.set(NewInstanceFields.tenantName, 'tenantNameIsRequired')
    }

    if (!request.tenantId) {
      errors.set(NewInstanceFields.tenantId, 'tenantIdIsRequired')
    }

    presenter.notifyNewInstanceFieldError(errors)
    return errors
  }
}
