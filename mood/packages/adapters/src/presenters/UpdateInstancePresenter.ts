import {
  UpdateInstanceErrors,
  UpdateInstancePresentation,
  Instance,
  UpdateInstanceFields,
  InstanceTypes,
  InstanceVisibility
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

export class UpdateInstancePresenterVM extends AlertPresenterVM {
  instanceId: UUID | undefined
  instanceName: string | undefined
  instanceType: InstanceTypes | undefined
  instanceVisibility: InstanceVisibility | undefined
  instanceDescription: string | undefined
  instanceTenantName: string | undefined
  instanceTenantId: UUID | undefined

  instanceIdError: string | undefined
  instanceNameError: string | undefined
  instanceTypeError: string | undefined
  instanceVisibilityError: string | undefined
  instanceDescriptionError: string | undefined
  instanceTenantNameError: string | undefined
  instanceTenantIdError: string | undefined

  instanceIdTouched = false
  instanceNameTouched = false
  instanceTypeTouched = false
  instanceVisibilityTouched = false
  instanceDescriptionTouched = false
  instanceTenantNameTouched = false
  instanceTenantIdTouched = false

  updatingInstance = false
  instanceUpdated = false
}

const instanceUpdatedAlert: (instance: Instance) => Alert = (instance: Instance) => ({
  title: 'success',
  details: 'yourInstanceHasBeenUpdated',
  type: AlertTypes.success,
  params: { owner: instance.name, role: instance.instanceType }
})

const instanceUpdatingAlert: () => Alert = () => ({
  title: 'information',
  details: 'updatingInstance',
  type: AlertTypes.info,
  showCloseBtn: false,
  params: {}
})

const errorInstanceUpdateAlert: (err: string) => Alert = (err) => ({
  title: 'error',
  details: err,
  type: AlertTypes.danger,
  params: {}
})

export class UpdateInstancePresenter
  extends Presenter<UpdateInstancePresenterVM>
  implements UpdateInstancePresentation
{
  constructor(private navigator: Navigation) {
    super(new UpdateInstancePresenterVM())
  }

  notifyUpdatingInstanceInfo(): void {
    this.vm.updatingInstance = true
    this.vm.instanceUpdated = false
    this.vm.alert = instanceUpdatingAlert()
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyUpdateInstanceError(error: string): void {
    this.vm.updatingInstance = false
    this.vm.instanceUpdated = false
    this.vm.alert = errorInstanceUpdateAlert(error)
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyInstanceUpdated(instance: Instance): void {
    this.vm.updatingInstance = false
    this.vm.instanceUpdated = true
    this.vm.alert = instanceUpdatedAlert(instance)
    this.vm.displayAlert = true
    this.notifyVM()
    this.vm.instanceUpdated = false
  }

  notifyUpdateInstanceFieldError(errors: UpdateInstanceErrors): void {
    this.vm.instanceNameError = this.vm.instanceNameTouched
      ? errors.get(UpdateInstanceFields.name)
      : ''
    this.vm.instanceTypeError = this.vm.instanceTypeTouched
      ? errors.get(UpdateInstanceFields.instanceType)
      : ''
    this.vm.instanceVisibilityError = this.vm.instanceVisibilityTouched
      ? errors.get(UpdateInstanceFields.visibility)
      : ''
    this.vm.instanceTenantNameError = this.vm.instanceTenantNameTouched
      ? errors.get(UpdateInstanceFields.tenantName)
      : ''
    this.vm.instanceTenantIdError = this.vm.instanceTenantIdTouched
      ? errors.get(UpdateInstanceFields.tenantId)
      : ''
    this.notifyVM()
  }
}
