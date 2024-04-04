import {
  AddInstanceErrors,
  AddInstancePresentation,
  Instance,
  NewInstanceFields,
  InstanceTypes,
  InstanceVisibility
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

export class AddInstancePresenterVM extends AlertPresenterVM {
  instanceName: string | undefined
  instanceType: InstanceTypes | undefined
  instanceVisibility: InstanceVisibility | undefined
  instanceDescription: string | undefined
  instanceTenantName: string | undefined
  instanceTenantId: UUID | undefined

  instanceNameError: string | undefined
  instanceTypeError: string | undefined
  instanceVisibilityError: string | undefined
  instanceDescriptionError: string | undefined
  instanceTenantNameError: string | undefined
  instanceTenantIdError: string | undefined

  instanceNameTouched = false
  instanceTypeTouched = false
  instanceVisibilityTouched = false
  instanceDescriptionTouched = false
  instanceTenantNameTouched = false
  instanceTenantIdTouched = false

  canCreateInstance = false
  creatingInstance = false
  instanceCreated = false
}

const instanceCreatedAlert: (instance: Instance) => Alert = (instance: Instance) => ({
  title: 'success',
  details: 'yourInstanceHasBeenCreated',
  type: AlertTypes.success,
  params: {
    instanceType: instance.instanceType,
    instanceName: instance.name,
    tenantName: instance.tenantName
  }
})

const instanceCreatingAlert: () => Alert = () => ({
  title: 'information',
  details: 'creatingInstance',
  type: AlertTypes.info,
  showCloseBtn: false,
  params: {}
})

const errorInstanceAlert: (err: string) => Alert = (err) => ({
  title: 'error',
  details: err,
  type: AlertTypes.danger,
  params: {}
})

export class AddInstancePresenter
  extends Presenter<AddInstancePresenterVM>
  implements AddInstancePresentation
{
  constructor(private navigator: Navigation) {
    super(new AddInstancePresenterVM())
  }

  notifyCreatingInstanceInfo(): void {
    this.vm.creatingInstance = true
    this.vm.instanceCreated = false
    this.vm.alert = instanceCreatingAlert()
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyAddInstanceError(error: string): void {
    this.vm.creatingInstance = false
    this.vm.alert = errorInstanceAlert(error)
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyInstanceAdded(instance: Instance): void {
    this.vm.creatingInstance = false
    this.vm.instanceCreated = true
    this.vm.alert = instanceCreatedAlert(instance)
    this.vm.displayAlert = true
    this.notifyVM()
  }

  notifyNewInstanceFieldError(errors: AddInstanceErrors): void {
    this.vm.instanceNameError = this.vm.instanceNameTouched
      ? errors.get(NewInstanceFields.name)
      : ''
    this.vm.instanceTypeError = this.vm.instanceTypeTouched
      ? errors.get(NewInstanceFields.instanceType)
      : ''
    this.vm.instanceVisibilityError = this.vm.instanceVisibilityTouched
      ? errors.get(NewInstanceFields.visibility)
      : ''
    this.vm.instanceTenantNameError = this.vm.instanceTenantNameTouched
      ? errors.get(NewInstanceFields.tenantName)
      : ''
    this.vm.instanceTenantIdError = this.vm.instanceTenantIdTouched
      ? errors.get(NewInstanceFields.tenantId)
      : ''
    this.vm.canCreateInstance = errors.size == 0
    this.notifyVM()
  }
}
