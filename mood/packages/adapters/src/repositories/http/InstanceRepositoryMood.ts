import { InstanceRepository, Instance, InstanceTypes } from '@mood/domain'
import { HttpClient } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class InstanceRepositoryMood implements InstanceRepository {
  private API_URI = '/v1/instances'

  constructor(
    private http: HttpClient,
    private apiBaseUrl: string
  ) {}

  private async getInstancesByInstanceType(
    tenantId: UUID,
    tenantName: string,
    instanceType: InstanceTypes
  ): Promise<Instance[]> {
    const rawInstances = await this.http.get<any[]>(
      this.apiBaseUrl + this.API_URI + '/' + instanceType,
      { 'X-Mood-Tenant': tenantName }
    )

    // 1. Rename column name
    // 2. Add missing tenant info not returned by the API
    const instances = rawInstances.map((e) => {
      return {
        ...e,
        instanceType: instanceType,
        relatedConfigs: e.related_configs,
        relatedServiceInstances: e.related_service_instances,
        urls: e.url,
        internalUrl: e.internal_url,
        tenantName: tenantName,
        tenantId: tenantId
      }
    })

    return instances
  }

  async getInstances(tenantId: UUID, tenantName: string): Promise<Instance[]> {
    let prometheusInstances = await this.getInstancesByInstanceType(
      tenantId,
      tenantName,
      'prometheus'
    )
    let alertmanagerInstances = await this.getInstancesByInstanceType(
      tenantId,
      tenantName,
      'alertmanager'
    )
    let victoriaInstances = await this.getInstancesByInstanceType(tenantId, tenantName, 'victoria')

    return prometheusInstances.concat(alertmanagerInstances, victoriaInstances)
  }

  addInstance(instance: Instance): Promise<void> {
    const body = {
      name: instance.name,
      visibility: instance.visibility,
      description: instance.description
    }
    return this.http.post(this.apiBaseUrl + this.API_URI + '/' + instance.instanceType, body, {
      'X-Mood-Tenant': instance.tenantId
    })
  }

  updateInstance(instance: Instance): Promise<void> {
    const body = {
      name: instance.name,
      visibility: instance.visibility,
      description: instance.description
    }
    return this.http.put(
      this.apiBaseUrl + this.API_URI + '/' + instance.instanceType + '/' + instance.id,
      body,
      {
        'X-Mood-Tenant': instance.tenantId
      }
    )
  }

  deleteInstance(instance: Instance): Promise<void> {
    return this.http.delete(
      this.apiBaseUrl + this.API_URI + `/${instance.instanceType}/${instance.id}`,
      { 'X-Mood-Tenant': instance.tenantName }
    )
  }
}
