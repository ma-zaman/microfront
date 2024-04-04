import { Instance, InstanceTypes, InstanceVisibility } from '@mood/domain'
import { UUID } from 'crypto'

export class InstanceBuilder {
  private instanceType!: InstanceTypes
  private id!: UUID
  private name!: string
  private description!: string
  private relatedConfigs!: UUID[]
  private relatedServiceInstances!: UUID[]
  private urls!: string[]
  private internalUrl!: string
  private visibility!: InstanceVisibility
  private tenantName!: string
  private tenantId!: UUID

  withInstanceType(instanceType: InstanceTypes) {
    this.instanceType = instanceType
    return this
  }

  withId(id: UUID) {
    this.id = id
    return this
  }

  withName(name: string) {
    this.name = name
    return this
  }

  withDescription(description: string) {
    this.description = description
    return this
  }

  withRelatedConfigs(relatedConfigs: UUID[]) {
    this.relatedConfigs = relatedConfigs
    return this
  }

  withRelatedServiceInstances(relatedServiceInstances: UUID[]) {
    this.relatedServiceInstances = relatedServiceInstances
    return this
  }

  withUrls(urls: string[]) {
    this.urls = urls
    return this
  }

  withInternalUrl(internalUrl: string) {
    this.internalUrl = internalUrl
    return this
  }

  withVisibility(visibility: InstanceVisibility) {
    this.visibility = visibility
    return this
  }

  withTenantName(tenantName: string) {
    this.tenantName = tenantName
    return this
  }

  withTenantId(tenantId: UUID) {
    this.tenantId = tenantId
    return this
  }

  build(): Instance {
    return {
      instanceType: this.instanceType,
      id: this.id,
      name: this.name,
      description: this.description,
      relatedConfigs: this.relatedConfigs,
      relatedServiceInstances: this.relatedServiceInstances,
      urls: this.urls,
      internalUrl: this.internalUrl,
      visibility: this.visibility,
      tenantName: this.tenantName,
      tenantId: this.tenantId
    }
  }
}
