import { AddTenantErrors, AddTenantPresentation, Tenant } from '@mood/domain'

export class AddTenantPresentationBuilder {
  private notifyNewTenantFieldError: (errors: AddTenantErrors) => void = () => null;
  private notifyTenantAdded: (tenant: Tenant) => void = () => null;
  private notifyAddTenantError: (error: string) => void = () => null;
  private notifyCreatingTenantInfo: () => void = () => null;


  withNotifyTenantAdded(notifyTenantAdded: (tenant: Tenant) => void) {
    this.notifyTenantAdded = notifyTenantAdded;
    return this;
  }

  withNotifyNewTenantFieldError(notifyNewTenantFieldError: (errors: AddTenantErrors) => void) {
    this.notifyNewTenantFieldError = notifyNewTenantFieldError;
    return this
  }

  withNotifyAddTenantError(notifyAddTenantError: (error: string) => void) {
    this.notifyAddTenantError = notifyAddTenantError;
    return this;
  }

  withNotifyCreatingTenantInfo(notifyCreatingTenantInfo: () => void) {
    this.notifyCreatingTenantInfo = notifyCreatingTenantInfo;
    return this;
  }

  build(): AddTenantPresentation {
    return {
      notifyNewTenantFieldError: this.notifyNewTenantFieldError,
      notifyTenantAdded: this.notifyTenantAdded,
      notifyAddTenantError: this.notifyAddTenantError,
      notifyCreatingTenantInfo: this.notifyCreatingTenantInfo
    }
  }
}
