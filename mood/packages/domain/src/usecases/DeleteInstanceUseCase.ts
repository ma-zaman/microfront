import {
  InstanceRepository,
  DeleteInstanceRequest,
  DeleteInstancePresentation,
  DeleteInstanceFields,
  InstanceBuilder,
  InstanceTypes
} from '@mood/domain'
import { UUID } from 'crypto'

export class DeleteInstanceUseCase {
  constructor(private instanceRepository: InstanceRepository) {}

  async execute(request: DeleteInstanceRequest, presenter: DeleteInstancePresentation) {
    const errors = this.validate(request, presenter)

    if (errors.size) {
      return
    }

    const instance = new InstanceBuilder()
      .withName(request.name)
      .withId(request.id)
      .withTenantId(request.tenantId)
      .withTenantName(request.tenantName)
      .withInstanceType(request.instanceType)
      .build()

    presenter.notifyDeletingInstanceInfo()

    this.instanceRepository
      .deleteInstance(instance)
      .then(() => presenter.notifyInstanceDeleted(instance))
      .catch((err: Error) => presenter.notifyDeleteInstanceError(err.message))
  }

  validate(
    request: DeleteInstanceRequest,
    presenter: DeleteInstancePresentation
  ): Map<DeleteInstanceFields, string> {
    const errors = new Map<DeleteInstanceFields, string>()
    if (request.id == ('' as UUID)) {
      errors.set(DeleteInstanceFields.instanceToDelete, 'instanceIdRequiredError')
    }
    if (!request.instanceToDeleteName || request.instanceToDeleteName.trim().length < 3) {
      errors.set(DeleteInstanceFields.instanceToDelete, 'instanceNameLengthUnder3Error')
    }
    if (request.instanceToDeleteName && request.instanceToDeleteName.length > 30) {
      errors.set(DeleteInstanceFields.instanceToDelete, 'instanceNameLengthUpper30Error')
    }
    if (
      !request.name ||
      (request.name &&
        request.instanceToDeleteName &&
        request.name !== request.instanceToDeleteName)
    ) {
      errors.set(DeleteInstanceFields.name, 'instanceNameDoesNtMatch')
    }

    if (!request.instanceType || request.instanceType == ('' as InstanceTypes)) {
      errors.set(DeleteInstanceFields.tenantId, 'tenantIdIsRequired')
    }

    if (!request.tenantId) {
      errors.set(DeleteInstanceFields.tenantId, 'tenantIdIsRequired')
    }

    presenter.notifyDeleteInstanceFieldError(errors)
    return errors
  }
}
