import { InstanceRepository, Instance } from '@mood/domain'
import { UUID } from 'crypto'

const INITIAL_INSTANCES: any[] = [
  {
    instanceType: 'victoria',
    name: 'vm-infra',
    id: '00000eee-12ab-417c-876c-168dc15a0520',
    description: '',
    relatedConfigs: [],
    relatedServiceInstances: [],
    urls: [
      'https://my-tenant---vm-infra.victoria.nd2.mood-preprod.si.fr.intraorange',
      'https://00000eee-12ab-417c-876c-168dc15a0520.victoria.nd2.mood-preprod.si.fr.intraorange'
    ],
    internalUrl:
      'http://svm-00000eee-12ab-417c-876c-168dc15a0520.mood-tenant-11111111-aaaa-4888-8e3c-827181ecd0fc.svc.bmsmood.local:8428',
    visibility: 'private',
    tenantName: 'my-tenant',
    tenantId: '00000000-0000-0000-0000-000000000000'
  },
  {
    instanceType: 'prometheus',
    name: 'prom-infra-kube',
    id: 'aaaaaaaa-1111-4cf3-b971-da216dc730ad',
    description: '',
    relatedConfigs: [
      'b0002895-ecf6-4535-a0a6-addb466b27d3',
      'd06b28d3-24f6-4b36-8cce-b5d2b4b2ab85'
    ],
    relatedServiceInstances: [],
    urls: [
      'https://my-tenant---prom-infra-kube.prometheus.nd2.mood-preprod.si.fr.intraorange',
      'https://aaaaaaaa-1111-4cf3-b971-da216dc730ad.prometheus.nd2.mood-preprod.si.fr.intraorange'
    ],
    internalUrl:
      'http://sp-aaaaaaaa-1111-4cf3-b971-da216dc730ad.mood-tenant-11111111-aaaa-4888-8e3c-827181ecd0fc.svc.bmsmood.local:9090',
    visibility: 'private',
    tenantName: 'my-tenant',
    tenantId: '00000000-0000-0000-0000-000000000000'
  },
  {
    instanceType: 'prometheus',
    name: 'prom-infra-kube-2',
    id: 'aaaaaaaa-1111-4cf3-b971-da216dc730ad',
    description: '',
    relatedConfigs: [
      'b0002895-ecf6-4535-a0a6-addb466b27d3',
      'd06b28d3-24f6-4b36-8cce-b5d2b4b2ab85'
    ],
    relatedServiceInstances: [],
    urls: [
      'https://my-tenant---prom-infra-kube.prometheus.nd2.mood-preprod.si.fr.intraorange',
      'https://aaaaaaaa-1111-4cf3-b971-da216dc730ad.prometheus.nd2.mood-preprod.si.fr.intraorange'
    ],
    internalUrl:
      'http://sp-aaaaaaaa-1111-4cf3-b971-da216dc730ad.mood-tenant-11111111-aaaa-4888-8e3c-827181ecd0fc.svc.bmsmood.local:9090',
    visibility: 'private',
    tenantName: 'my-tenant',
    tenantId: '00000000-0000-0000-0000-000000000000'
  },
  {
    instanceType: 'alertmanager',
    name: 'am-infra',
    id: 'aaaaaaaa-1111-4cf3-b971-da216dc730ad',
    description: '',
    relatedConfigs: [
      'b0002895-ecf6-4535-a0a6-addb466b27d3',
      'd06b28d3-24f6-4b36-8cce-b5d2b4b2ab85'
    ],
    relatedServiceInstances: [],
    urls: [
      'https://my-tenant---prom-infra-kube.prometheus.nd2.mood-preprod.si.fr.intraorange',
      'https://aaaaaaaa-1111-4cf3-b971-da216dc730ad.prometheus.nd2.mood-preprod.si.fr.intraorange'
    ],
    internalUrl:
      'http://sp-aaaaaaaa-1111-4cf3-b971-da216dc730ad.mood-tenant-11111111-aaaa-4888-8e3c-827181ecd0fc.svc.bmsmood.local:9090',
    visibility: 'private',
    tenantName: 'my-tenant',
    tenantId: '00000000-0000-0000-0000-000000000000'
  },
  {
    instanceType: 'alertmanager',
    name: 'am-infra',
    id: '55555555-1111-4539-8e3b-93cfb5eeec7c',
    description: '',
    relatedConfigs: ['7803c23e-39d6-4125-9e9c-d1d8ea71b6a5'],
    relatedServiceInstances: [],
    urls: [
      'https://my-tenant---am-infra.alertmanager.nd2.mood-preprod.si.fr.intraorange',
      'https://55555555-1111-4539-8e3b-93cfb5eeec7c.alertmanager.nd2.mood-preprod.si.fr.intraorange'
    ],
    internalUrl:
      'http://sam-55555555-1111-4539-8e3b-93cfb5eeec7c.mood-tenant-11111111-aaaa-4888-8e3c-827181ecd0fc.svc.bmsmood.local:9093',
    visibility: 'private',
    tenantName: 'my-tenant-2',
    tenantId: '10000000-0000-0000-0000-000000000000'
  }
]

export class InstanceRepositoryInMemory implements InstanceRepository {
  constructor(private instances: Instance[] = INITIAL_INSTANCES) {}

  getInstances(tenantId: UUID, tenantName: string): Promise<Instance[]> {
    return Promise.resolve(this.instances.filter((e) => e.tenantId === tenantId))
  }

  addInstance(instance: Instance): Promise<void> {
    this.instances.push(instance)
    return Promise.resolve()
  }

  updateInstance(instance: Instance): Promise<void> {
    const index = this.instances.findIndex((item) => item.id === instance.id)
    this.instances[index] = instance
    return Promise.resolve()
  }

  deleteInstance(instance: Instance): Promise<void> {
    this.instances = this.instances.filter((el) => el.id !== instance.id)
    return Promise.resolve()
  }
}
