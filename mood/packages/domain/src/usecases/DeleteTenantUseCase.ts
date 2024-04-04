import {
  TenantRepository,
  DeleteTenantRequest,
  DeleteTenantPresentation,
  DeleteTenantFields,
  TenantBuilder
} from '@mood/domain'
import { UUID } from 'crypto'

export class DeleteTenantUseCase {
  constructor(private tenantRepository: TenantRepository) {}

  async execute(request: DeleteTenantRequest, presenter: DeleteTenantPresentation) {
    const errors = this.validate(request, presenter)

    if (errors.size) {
      return
    }

    const tenant = new TenantBuilder().withName(request.name).withId(request.id).build()

    presenter.notifyDeletingTenantInfo()

    this.tenantRepository
      .deleteTenant(tenant)
      .then(() => presenter.notifyTenantDeleted(tenant))
      .catch((err: Error) => presenter.notifyDeleteTenantError(err.message))
  }

  validate(
    request: DeleteTenantRequest,
    presenter: DeleteTenantPresentation
  ): Map<DeleteTenantFields, string> {
    const errors = new Map<DeleteTenantFields, string>()
    if (request.id == ('' as UUID)) {
      errors.set(DeleteTenantFields.tenantToDelete, 'tenantIdRequiredError')
    }
    if (!request.tenantToDeleteName || request.tenantToDeleteName.trim().length < 3) {
      errors.set(DeleteTenantFields.tenantToDelete, 'tenantNameLengthUnder3Error')
    }
    if (request.tenantToDeleteName && request.tenantToDeleteName.length > 30) {
      errors.set(DeleteTenantFields.tenantToDelete, 'tenantNameLengthUpper30Error')
    }
    if (
      !request.name ||
      (request.name && request.tenantToDeleteName && request.name !== request.tenantToDeleteName)
    ) {
      errors.set(DeleteTenantFields.name, 'tenantNameDoesNtMatch')
    }

    presenter.notifyDeleteTenantFieldError(errors)
    return errors
  }
}
