import {
  UpdateInstancePresentation,
  UpdateInstanceRequest,
  UpdateInstanceFields,
  InstanceRepository,
  InstanceBuilder
} from '@mood/domain'

export class UpdateInstanceUseCase {
  constructor(private instanceRepository: InstanceRepository) {}

  async execute(
    request: UpdateInstanceRequest,
    presenter: UpdateInstancePresentation
  ): Promise<void> {
    const errors = this.validate(request, presenter)
    if (errors.size) {
      return
    }

    presenter.notifyUpdatingInstanceInfo()

    const instance = new InstanceBuilder()
      .withId(request.id)
      .withInstanceType(request.instanceType)
      .withName(request.name)
      .withTenantName(request.tenantName)
      .withTenantId(request.tenantId)
      .withVisibility(request.visibility)
      .withDescription(request.description)
      .build()

    this.instanceRepository
      .updateInstance(instance)
      .then(() => presenter.notifyInstanceUpdated(instance))
      .catch((err: Error) => presenter.notifyUpdateInstanceError(err.message))
  }

  validate(
    request: UpdateInstanceRequest,
    presenter: UpdateInstancePresentation
  ): Map<UpdateInstanceFields, string> {
    const errors = new Map<UpdateInstanceFields, string>()
    if (!request.name) {
      errors.set(UpdateInstanceFields.name, 'nameIsRequired')
    }

    if (!request.instanceType) {
      errors.set(UpdateInstanceFields.instanceType, 'instanceTypeIsRequired')
    }

    if (!request.visibility) {
      errors.set(UpdateInstanceFields.visibility, 'visibilityIsRequired')
    }

    if (!request.tenantName) {
      errors.set(UpdateInstanceFields.tenantName, 'tenantNameIsRequired')
    }

    if (!request.tenantId) {
      errors.set(UpdateInstanceFields.tenantId, 'tenantIdIsRequired')
    }
    presenter.notifyUpdateInstanceFieldError(errors)
    return errors
  }
}
