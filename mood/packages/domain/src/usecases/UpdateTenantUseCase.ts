import {
  UpdateTenantPresentation,
  UpdateTenantRequest,
  UpdateTenantFields,
  TenantRepository
} from '@mood/domain'

export class UpdateTenantUseCase {
  constructor(private tenantRepository: TenantRepository) {}

  async execute(request: UpdateTenantRequest, presenter: UpdateTenantPresentation): Promise<void> {
    const errors = this.validate(request, presenter)

    if (errors.size) {
      return
    }

    presenter.notifyUpdatingTenantInfo()

    this.tenantRepository
      .updateTenant(request.tenant)
      .then(() => presenter.notifyTenantUpdated(request.tenant))
      .catch((err: Error) => presenter.notifyUpdateTenantError(err.message))
  }

  validate(
    request: UpdateTenantRequest,
    presenter: UpdateTenantPresentation
  ): Map<UpdateTenantFields, string> {
    const errors = new Map<UpdateTenantFields, string>()
    if (!request.tenant.name || request.tenant.name.trim().length < 3) {
      errors.set(UpdateTenantFields.name, 'tenantNameLengthUnder3Error')
    } else if (request.tenant.name && request.tenant.name.length > 30) {
      errors.set(UpdateTenantFields.name, 'tenantNameLengthUpper30Error')
    } else if (
      request.tenant.name &&
      !/(?!^all$)(^[0-9a-zA-Z][0-9a-zA-Z-]+[0-9a-zA-Z]$)/.test(request.tenant.name)
    ) {
      errors.set(UpdateTenantFields.name, 'tenantNameRegExpError')
    }

    if (!request.tenant.description || request.tenant.description.length > 1000) {
      errors.set(UpdateTenantFields.description, 'tenantDescriptionError')
    }

    const appId = request.tenant.labels?.get('com.orange.repository.orangecarto/id')
    if (!appId || appId.length > 6) {
      errors.set(UpdateTenantFields.appId, 'tenantAppIdLengthError')
    } else if (!appId || !/^[0-9]{1,5}$/.test(appId)) {
      errors.set(UpdateTenantFields.appId, 'tenantAppIdRegExpError')
    }
    presenter.notifyUpdateTenantFieldError(errors)
    return errors
  }
}
