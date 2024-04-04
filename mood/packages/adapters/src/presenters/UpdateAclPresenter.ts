import {
  UpdateAclErrors,
  UpdateAclPresentation,
  Acl,
  UpdateAclFields,
  AclOwnerTypes,
  RoleTypes
} from '@mood/domain'
import {
  Presenter,
  Navigation,
  NavigationRoute,
  AlertPresenterVM,
  AlertTypes,
  Alert
} from '@mood/web-adapters'
import { UUID } from 'crypto'

export class UpdateAclPresenterVM extends AlertPresenterVM {
  aclId: UUID | undefined
  aclOwner: string | undefined
  aclOwnerType: AclOwnerTypes | undefined
  aclRole: RoleTypes | undefined
  aclTenantName: string | undefined
  aclTenantId: UUID | undefined

  aclIdError: string | undefined
  aclOwnerError: string | undefined
  aclOwnerTypeError: string | undefined
  aclRoleError: string | undefined
  aclTenantNameError: string | undefined
  aclTenantIdError: string | undefined

  aclIdTouched = false
  aclOwnerTouched = false
  aclOwnerTypeTouched = false
  aclRoleTouched = false
  aclTenantNameTouched = false
  aclTenantIdTouched = false

  updatingAcl = false
  aclUpdated = false
}

const aclUpdatedAlert: (acl: Acl) => Alert = (acl: Acl) => ({
  title: 'success',
  details: 'yourAclHasBeenUpdated',
  type: AlertTypes.success,
  params: { owner: acl.owner, role: acl.role }
})

const aclUpdatingAlert: () => Alert = () => ({
  title: 'information',
  details: 'updatingAcl',
  type: AlertTypes.info,
  showCloseBtn: false,
  params: {}
})

const errorAclUpdateAlert: (err: string) => Alert = (err) => ({
  title: 'error',
  details: err,
  type: AlertTypes.danger,
  params: {}
})

export class UpdateAclPresenter
  extends Presenter<UpdateAclPresenterVM>
  implements UpdateAclPresentation
{
  constructor(private navigator: Navigation) {
    super(new UpdateAclPresenterVM())
  }

  notifyUpdatingAclInfo(): void {
    this.vm.updatingAcl = true
    this.vm.aclUpdated = false
    this.vm.alert = aclUpdatingAlert()
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyUpdateAclError(error: string): void {
    this.vm.updatingAcl = false
    this.vm.aclUpdated = false
    this.vm.alert = errorAclUpdateAlert(error)
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyAclUpdated(acl: Acl): void {
    this.vm.updatingAcl = false
    this.vm.aclUpdated = true
    this.vm.alert = aclUpdatedAlert(acl)
    this.vm.displayAlert = true
    this.notifyVM()
    this.vm.aclUpdated = false
    this.navigator.navigate(NavigationRoute.ACLS)
  }

  notifyUpdateAclFieldError(errors: UpdateAclErrors): void {
    this.vm.aclIdError = this.vm.aclIdTouched ? errors.get(UpdateAclFields.id) : ''
    this.vm.aclOwnerError = this.vm.aclOwnerTouched ? errors.get(UpdateAclFields.owner) : ''
    this.vm.aclOwnerTypeError = this.vm.aclOwnerTypeTouched
      ? errors.get(UpdateAclFields.ownerType)
      : ''
    this.vm.aclRoleError = this.vm.aclRoleTouched ? errors.get(UpdateAclFields.role) : ''
    this.vm.aclTenantNameError = this.vm.aclTenantNameTouched
      ? errors.get(UpdateAclFields.tenantName)
      : ''
    this.vm.aclTenantIdError = this.vm.aclTenantIdTouched
      ? errors.get(UpdateAclFields.tenantId)
      : ''
    this.notifyVM()
  }
}
