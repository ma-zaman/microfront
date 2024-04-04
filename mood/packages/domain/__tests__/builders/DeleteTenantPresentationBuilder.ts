import { DeleteTenantErrors, DeleteTenantPresentation, Tenant } from '@mood/domain'

export class DeleteTenantPresentationBuilder {
  private notifyDeleteTenantFieldError: (errors: DeleteTenantErrors) => void = () => null
  private notifyDeleteTenantError: (error: string) => void = () => null
  private notifyTenantDeleted: (tenant: Tenant) => void = () => null
  private notifyDeletingTenantInfo: () => void = () => null

  withNotifyTenantDeleted(notifyTenantDeleted: (tenant: Tenant) => void) {
    this.notifyTenantDeleted = notifyTenantDeleted
    return this
  }

  withNotifyDeletingTenantInfo(notifyDeletingTenantInfo: () => void) {
    this.notifyDeletingTenantInfo = notifyDeletingTenantInfo
    return this
  }

  withNotifyDeleteTenantFieldError(
    notifyDeleteTenantFieldError: (errors: DeleteTenantErrors) => void
  ) {
    this.notifyDeleteTenantFieldError = notifyDeleteTenantFieldError
    return this
  }

  withNotifyDeleteTenantError(notifyDeleteTenantError: (error: string) => void) {
    this.notifyDeleteTenantError = notifyDeleteTenantError
    return this
  }

  build(): DeleteTenantPresentation {
    return {
      notifyDeleteTenantError: this.notifyDeleteTenantError,
      notifyDeleteTenantFieldError: this.notifyDeleteTenantFieldError,
      notifyTenantDeleted: this.notifyTenantDeleted,
      notifyDeletingTenantInfo: this.notifyDeletingTenantInfo
    }
  }
}
