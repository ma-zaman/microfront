import { GetInstancesRequest, GetInstancesPresentation, InstanceRepository } from '@mood/domain'

export class GetInstancesUseCase {
  constructor(private instanceRepository: InstanceRepository) {}

  async execute(request: GetInstancesRequest, presenter: GetInstancesPresentation) {
    presenter.loadingInstances()
    this.instanceRepository
      .getInstances(request.tenantId, request.tenantName)
      .then((instances) => presenter.displayInstances(instances))
      .catch((err: Error) => presenter.notifyInstancesError(err.message))
  }
}
