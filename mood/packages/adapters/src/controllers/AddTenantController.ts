import { AddTenantRequest, AddTenantUseCase } from '@mood/domain'
import { Controller, AddTenantPresenter, AddTenantPresenterVM } from '@mood/web-adapters'

export class AddTenantController extends Controller<AddTenantPresenterVM> {
  constructor(
    private addTenantUseCase: AddTenantUseCase,
    private presenter: AddTenantPresenter
  ) {
    super(presenter)
  }

  validateTenantName(tenantName: string) {
    this.presenter.vm.tenantName = tenantName
    this.presenter.vm.tenantNameTouched = true
    this.validate()
  }

  validateTenantDescription(tenantDescription: string) {
    this.presenter.vm.tenantDescription = tenantDescription
    this.presenter.vm.tenantDescriptionTouched = true
    this.validate()
  }

  validateTenantLabels(tenantLabels: Map<string, string>) {
    this.presenter.vm.tenantLabels = tenantLabels
    this.presenter.vm.tenantLabelsTouched = true
    this.validate()
  }

  clearTenantName() {
    this.presenter.vm.tenantName = undefined
    this.presenter.vm.tenantNameTouched = false
    this.validate()
  }

  clearTenantDescription() {
    this.presenter.vm.tenantDescription = undefined
    this.presenter.vm.tenantDescriptionTouched = false
    this.validate()
  }

  clearTenantLabels() {
    this.presenter.vm.tenantLabels = new Map()
    this.presenter.vm.tenantLabelsTouched = false
    this.validate()
  }

  create() {
    this.addTenantUseCase.execute(
      new AddTenantRequest(
        this.presenter.vm.tenantName || '',
        this.presenter.vm.tenantLabels || new Map(),
        this.presenter.vm.tenantDescription || ''
      ),
      this.presenter
    )
  }

  private validate() {
    this.presenter.vm.tenantCreated = false
    this.addTenantUseCase.validate(
      new AddTenantRequest(
        this.presenter.vm.tenantName || '',
        this.presenter.vm.tenantLabels || new Map(),
        this.presenter.vm.tenantDescription || ''
      ),
      this.presenter
    )
  }
}
