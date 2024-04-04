import { UpdateTenantErrors, UpdateTenantPresentation, Tenant } from '@mood/domain'

export class UpdateTenantPresentationBuilder {
  private notifyUpdateTenantFieldError: (errors: UpdateTenantErrors) => void = () => null
  private notifyTenantUpdated: (tenant: Tenant) => void = () => null
  private notifyUpdateTenantError: (error: string) => void = () => null
  private notifyUpdatingTenantInfo: () => void = () => null

  withNotifyTenantUpdated(notifyTenantUpdated: (tenant: Tenant) => void) {
    this.notifyTenantUpdated = notifyTenantUpdated
    return this
  }

  withNotifyUpdateTenantFieldError(
    notifyUpdateTenantFieldError: (errors: UpdateTenantErrors) => void
  ) {
    this.notifyUpdateTenantFieldError = notifyUpdateTenantFieldError
    return this
  }

  withNotifyUpdateTenantError(notifyUpdateTenantError: (error: string) => void) {
    this.notifyUpdateTenantError = notifyUpdateTenantError
    return this
  }

  withNotifyUpdatingTenantInfo(notifyUpdatingTenantInfo: () => void) {
    this.notifyUpdatingTenantInfo = notifyUpdatingTenantInfo
    return this
  }

  build(): UpdateTenantPresentation {
    return {
      notifyUpdateTenantError: this.notifyUpdateTenantError,
      notifyUpdateTenantFieldError: this.notifyUpdateTenantFieldError,
      notifyTenantUpdated: this.notifyTenantUpdated,
      notifyUpdatingTenantInfo: this.notifyUpdatingTenantInfo
    }
  }
}
