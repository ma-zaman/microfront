import {
  DeleteInstanceErrors,
  DeleteInstancePresentation,
  Instance,
  DeleteInstanceFields,
  InstanceTypes
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

export class DeleteInstancePresenterVM extends AlertPresenterVM {
  instanceToDelete: string | undefined
  instanceToDeleteError: string | undefined
  instanceToDeleteTouched = false

  instanceId: UUID | undefined
  instanceIdError: string | undefined
  instanceIdTouched = false

  instanceName: string | undefined
  instanceNameError: string | undefined
  instanceNameTouched = false

  instanceType: InstanceTypes | undefined
  instanceTypeError: string | undefined
  instanceTypeTouched = false

  instanceTenantId: UUID | undefined
  instanceTenantIdError: string | undefined
  instanceTenantIdTouched = false

  instanceTenantName: string | undefined
  instanceTenantNameError: string | undefined
  instanceTenantNameTouched = false

  canDeleteInstance = false
  deletingInstance = false
  instanceDeleted = false
}
const instanceDeletedAlert: (name: string) => Alert = (instanceName) => ({
  title: 'success',
  details: 'theInstanceHasBeenDeleted',
  type: AlertTypes.success,
  params: { instanceName: instanceName }
})

const instanceDeletingAlert: () => Alert = () => ({
  title: 'information',
  details: 'deletingInstance',
  type: AlertTypes.info,
  showCloseBtn: false,
  params: {}
})

const errorInstanceDeleteAlert: (err: string) => Alert = (err) => ({
  title: 'error',
  details: err,
  type: AlertTypes.danger,
  params: {}
})

export class DeleteInstancePresenter
  extends Presenter<DeleteInstancePresenterVM>
  implements DeleteInstancePresentation
{
  constructor(private navigator: Navigation) {
    super(new DeleteInstancePresenterVM())
  }

  notifyDeletingInstanceInfo(): void {
    this.vm.deletingInstance = true
    this.vm.instanceDeleted = false
    this.vm.alert = instanceDeletingAlert()
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyDeleteInstanceError(error: string): void {
    this.vm.deletingInstance = false
    this.vm.alert = errorInstanceDeleteAlert(error)
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyInstanceDeleted(instance: Instance): void {
    this.vm.deletingInstance = false
    this.vm.instanceDeleted = true
    this.vm.alert = instanceDeletedAlert(instance.name)
    this.vm.displayAlert = true
    this.notifyVM()
    this.navigator.navigate(NavigationRoute.INSTANCES)
  }

  notifyDeleteInstanceFieldError(errors: DeleteInstanceErrors): void {
    this.vm.instanceIdError = this.vm.instanceIdTouched ? errors.get(DeleteInstanceFields.id) : ''
    this.vm.instanceNameError = this.vm.instanceNameTouched
      ? errors.get(DeleteInstanceFields.name)
      : ''
    this.vm.instanceToDeleteError = this.vm.instanceToDeleteTouched
      ? errors.get(DeleteInstanceFields.instanceToDelete)
      : ''
    this.vm.instanceTenantNameError = this.vm.instanceTenantNameTouched
      ? errors.get(DeleteInstanceFields.tenantName)
      : ''
    this.vm.instanceTypeError = this.vm.instanceTypeTouched
      ? errors.get(DeleteInstanceFields.instanceType)
      : ''

    this.vm.canDeleteInstance = errors.size == 0
    this.notifyVM()
  }
}
