import {
  AddTenantPresentation,
  AddTenantRequest,
  NewTenantFields,
  TenantBuilder,
  TenantRepository
} from '@mood/domain'

export class AddTenantUseCase {
  constructor(private tenantRepository: TenantRepository) {}

  async execute(request: AddTenantRequest, presenter: AddTenantPresentation): Promise<void> {
    const errors = this.validate(request, presenter)

    if (errors.size) {
      return
    }

    const tenant = new TenantBuilder()
      .withName(request.name)
      .withDescription(request.description)
      .withLabels(request.labels)
      .build()

    presenter.notifyCreatingTenantInfo()

    this.tenantRepository
      .addTenant(tenant)
      .then(() => presenter.notifyTenantAdded(tenant))
      .catch((err: Error) => presenter.notifyAddTenantError(err.message))
  }

  validate(
    request: AddTenantRequest,
    presenter: AddTenantPresentation
  ): Map<NewTenantFields, string> {
    const errors = new Map<NewTenantFields, string>()
    if (!request.name || request.name.trim().length < 3 || request.name.length > 30) {
      errors.set(NewTenantFields.name, 'thisFieldMustContainBetween3And30Characters')
    } else if (
      request.name &&
      !/(?!^all$)(^[0-9a-zA-Z][0-9a-zA-Z-]+[0-9a-zA-Z]$)/.test(request.name)
    ) {
      errors.set(NewTenantFields.name, 'onlyHyphenIsAllowed')
    }

    if (!request.description) {
      errors.set(NewTenantFields.description, 'thisFieldIsRequired')
    } else if (request.description.length > 1000) {
      errors.set(NewTenantFields.description, 'thisFieldMustBeLessThan1000Characters')
    }

    const appId = request.labels.get('com.orange.repository.orangecarto/id')
    if (!appId || appId.length > 6 || !/^[0-9]{1,5}$/.test(appId)) {
      errors.set(NewTenantFields.appId, 'thisFieldMustContainBetween1And5Digits')
    }
    presenter.notifyNewTenantFieldError(errors)
    return errors
  }
}
