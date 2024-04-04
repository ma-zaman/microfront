import { DeleteTenantRequest, DeleteTenantUseCase } from '@mood/domain'
import { Controller, DeleteTenantPresenter, DeleteTenantPresenterVM } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class DeleteTenantController extends Controller<DeleteTenantPresenterVM> {
  constructor(
    private deleteTenantUseCase: DeleteTenantUseCase,
    private presenter: DeleteTenantPresenter
  ) {
    super(presenter)
  }

  validateTenantToDelete(tenantToDelete: string) {
    this.presenter.vm.tenantToDelete = tenantToDelete
    this.presenter.vm.tenantName = ''

    this.presenter.vm.tenantToDeleteTouched = true
    this.presenter.vm.tenantNameTouched = false

    this.presenter.vm.tenantDeleted = false
    this.validate()
  }

  validateTenantName(tenantName: string) {
    this.presenter.vm.tenantName = tenantName
    this.presenter.vm.tenantNameTouched = true
    this.validate()
  }

  validateTenantId(tenantId: UUID) {
    this.presenter.vm.tenantId = tenantId
    this.presenter.vm.tenantIdTouched = true
    this.validate()
  }

  delete() {
    this.deleteTenantUseCase.execute(
      new DeleteTenantRequest(
        this.presenter.vm.tenantId || ('' as UUID),
        this.presenter.vm.tenantName || '',
        this.presenter.vm.tenantToDelete || ''
      ),
      this.presenter
    )
  }

  private validate() {
    this.deleteTenantUseCase.validate(
      new DeleteTenantRequest(
        this.presenter.vm.tenantId || ('' as UUID),
        this.presenter.vm.tenantName || '',
        this.presenter.vm.tenantToDelete || ''
      ),
      this.presenter
    )
  }
}
