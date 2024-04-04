import {
  AddAclErrors,
  AddAclPresentation,
  Acl,
  NewAclFields,
  RoleTypes,
  AclOwnerTypes
} from '@mood/domain'
import {
  Presenter,
  Navigation,
  AlertPresenterVM,
  Alert,
  AlertTypes,
  NavigationRoute
} from '@mood/web-adapters'
import { UUID } from 'crypto'

export class AddAclPresenterVM extends AlertPresenterVM {
  aclOwner: string | undefined
  aclOwnerType: AclOwnerTypes | undefined
  aclRole: RoleTypes | undefined
  aclTenantId: UUID | undefined
  aclTenantName: string | undefined

  aclOwnerError: string | undefined
  aclOwnerTypeError: string | undefined
  aclRoleError: string | undefined
  aclTenantIdError: string | undefined
  aclTenantNameError: string | undefined

  aclOwnerTouched = false
  aclOwnerTypeTouched = false
  aclRoleTouched = false
  aclTenantIdTouched = false
  aclTenantNameTouched = false

  canCreateAcl = false
  creatingAcl = false
  aclCreated = false
}

const aclCreatedAlert: (acl: Acl) => Alert = (acl: Acl) => ({
  title: 'success',
  details: 'yourAclHasBeenCreated',
  type: AlertTypes.success,
  params: { owner: acl.owner, role: acl.role, tenantName: acl.tenantName }
})

const aclCreatingAlert: () => Alert = () => ({
  title: 'information',
  details: 'creatingAcl',
  type: AlertTypes.info,
  showCloseBtn: false,
  params: {}
})

const errorAclAlert: (err: string) => Alert = (err) => ({
  title: 'error',
  details: err,
  type: AlertTypes.danger,
  params: {}
})

export class AddAclPresenter extends Presenter<AddAclPresenterVM> implements AddAclPresentation {
  constructor(private navigator: Navigation) {
    super(new AddAclPresenterVM())
  }

  notifyCreatingAclInfo(): void {
    this.vm.creatingAcl = true
    this.vm.aclCreated = false
    this.vm.alert = aclCreatingAlert()
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyAddAclError(error: string): void {
    this.vm.creatingAcl = false
    this.vm.alert = errorAclAlert(error)
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyAclAdded(acl: Acl): void {
    this.vm.creatingAcl = false
    this.vm.aclCreated = true
    this.vm.alert = aclCreatedAlert(acl)
    this.vm.displayAlert = true
    this.notifyVM()
    this.navigator.navigate(NavigationRoute.ACLS)
  }

  notifyNewAclFieldError(errors: AddAclErrors): void {
    this.vm.aclOwnerError = this.vm.aclOwnerTouched ? errors.get(NewAclFields.owner) : ''
    this.vm.aclOwnerTypeError = this.vm.aclOwnerTypeTouched
      ? errors.get(NewAclFields.ownerType)
      : ''
    this.vm.aclRoleError = this.vm.aclRoleTouched ? errors.get(NewAclFields.role) : ''
    this.vm.aclTenantNameError = this.vm.aclTenantNameTouched
      ? errors.get(NewAclFields.tenantName)
      : ''
    this.vm.aclTenantIdError = this.vm.aclTenantIdTouched ? errors.get(NewAclFields.tenantId) : ''
    this.vm.canCreateAcl = errors.size == 0
    this.notifyVM()
  }
}
