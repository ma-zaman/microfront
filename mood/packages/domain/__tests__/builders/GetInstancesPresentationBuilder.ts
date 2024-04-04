import { GetInstancesPresentation, Instance } from '@mood/domain'

export class GetInstancesPresentationBuilder {
  private loadingInstances: () => void = () => null
  private notifyInstancesError: (message: string) => void = () => null
  private displayInstances: (instances: Instance[]) => void = () => null

  withDisplayInstances(displayInstances: (instances: Instance[]) => void) {
    this.displayInstances = displayInstances
    return this
  }

  withLoadingInstances(loadingInstances: () => void) {
    this.loadingInstances = loadingInstances
    return this
  }

  withNotifyInstancesError(notifyInstancesError: (message: string) => void) {
    this.notifyInstancesError = notifyInstancesError
    return this
  }

  build(): GetInstancesPresentation {
    return {
      displayInstances: this.displayInstances,
      loadingInstances: this.loadingInstances,
      notifyInstancesError: this.notifyInstancesError
    }
  }
}
