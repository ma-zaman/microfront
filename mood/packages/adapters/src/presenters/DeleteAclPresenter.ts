import {
  DeleteAclErrors,
  DeleteAclPresentation,
  Acl,
  DeleteAclFields,
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

export class DeleteAclPresenterVM extends AlertPresenterVM {
  acls: Acl[] | undefined
  aclId: UUID | undefined
  aclOwner: string | undefined
  aclOwnerType: AclOwnerTypes | undefined
  aclRole: RoleTypes | undefined
  aclTenantName: string | undefined
  aclTenantId: UUID | undefined

  aclsError: string | undefined
  aclIdError: string | undefined
  aclOwnerError: string | undefined
  aclOwnerTypeError: string | undefined
  aclRoleError: string | undefined
  aclTenantNameError: string | undefined
  aclTenantIdError: string | undefined

  aclsTouched = false
  aclIdTouched = false
  aclOwnerTouched = false
  aclOwnerTypeTouched = false
  aclRoleTouched = false
  aclTenantNameTouched = false
  aclTenantIdTouched = false

  canDeleteAcl = false
  deletingAcl = false
  aclDeleted = false
}
const aclDeletedAlert: (owner: string) => Alert = (owner) => ({
  title: 'success',
  details: 'theAclHasBeenDeleted',
  type: AlertTypes.success,
  params: { owner: owner }
})

const aclDeletingAlert: () => Alert = () => ({
  title: 'information',
  details: 'deletingAcl',
  type: AlertTypes.info,
  showCloseBtn: false,
  params: {}
})

const errorAclDeleteAlert: (err: string) => Alert = (err) => ({
  title: 'error',
  details: err,
  type: AlertTypes.danger,
  params: {}
})

export class DeleteAclPresenter
  extends Presenter<DeleteAclPresenterVM>
  implements DeleteAclPresentation
{
  constructor(private navigator: Navigation) {
    super(new DeleteAclPresenterVM())
  }

  notifyDeletingAclInfo(): void {
    this.vm.deletingAcl = true
    this.vm.aclDeleted = false
    this.vm.alert = aclDeletingAlert()
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyDeleteAclError(error: string): void {
    this.vm.deletingAcl = false
    this.vm.alert = errorAclDeleteAlert(error)
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyAclDeleted(acl: Acl): void {
    this.vm.deletingAcl = false
    this.vm.aclDeleted = true
    this.vm.alert = aclDeletedAlert(acl.owner)
    this.vm.displayAlert = true
    this.notifyVM()
    this.navigator.navigate(NavigationRoute.ACLS)
  }

  notifyDeleteAclFieldError(errors: DeleteAclErrors): void {
    this.vm.aclsError = this.vm.aclsTouched ? errors.get(DeleteAclFields.acls) : ''
    this.vm.aclIdError = this.vm.aclIdTouched ? errors.get(DeleteAclFields.id) : ''
    this.vm.aclOwnerError = this.vm.aclOwnerTouched ? errors.get(DeleteAclFields.owner) : ''
    this.vm.aclOwnerTypeError = this.vm.aclOwnerTypeTouched
      ? errors.get(DeleteAclFields.ownerType)
      : ''
    this.vm.aclRoleError = this.vm.aclRoleTouched ? errors.get(DeleteAclFields.role) : ''
    this.vm.aclTenantNameError = this.vm.aclTenantNameTouched
      ? errors.get(DeleteAclFields.tenantName)
      : ''

    this.vm.canDeleteAcl = errors.size == 0
    this.notifyVM()
  }
}
