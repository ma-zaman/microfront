import { UUID } from 'crypto'

export type InstanceTypes = 'prometheus' | 'alertmanager' | 'victoria'
export type InstanceVisibility = 'private' | 'internal'

export interface Instance {
  instanceType: InstanceTypes
  id: UUID
  name: string
  description?: string
  relatedConfigs?: UUID[]
  relatedServiceInstances?: UUID[]
  urls?: string[]
  internalUrl?: string
  visibility: InstanceVisibility
  tenantName: string
  tenantId: UUID
}
