import { GetInstancesRequest, GetInstancesUseCase, Instance, InstanceBuilder } from '@mood/domain'
import { GetInstancesPresentationBuilder } from '__tests__/builders/GetInstancesPresentationBuilder'
import { InstanceRepositoryBuilder } from '__tests__/builders/InstanceRepositoryBuilder'
import { UUID, randomUUID } from 'crypto'
import { describe, test, expect } from 'vitest'

describe('Get instances use case', () => {
  test('display list of instances', async () => {
    return new Promise((resolve) => {
      // Given
      const instanceBuilder = new InstanceBuilder()
      const instance0: Instance = instanceBuilder
        .withInstanceType('prometheus')
        .withId('00000000-0000-0000-0000-000000000000')
        .withName('prom 01')
        .withDescription('desc prom 01')
        .withRelatedConfigs([
          '99999999-0000-0000-0000-000000000000',
          '88888888-0000-0000-0000-000000000000'
        ])
        .withRelatedServiceInstances([])
        .withUrls([
          'https://my-tenant---vm-infra.prom.nd2.mood-preprod.si.fr.intraorange',
          'https://00000eee-12ab-417c-876c-168dc15a0520.prom.nd2.mood-preprod.si.fr.intraorange'
        ])
        .withInternalUrl(
          'http://svm-00000eee-12ab-417c-876c-168dc15a0520.mood-tenant-11111111-aaaa-4888-8e3c-827181ecd0fc.svc.bmsmood.local:8428'
        )
        .withVisibility('private')
        .withTenantName('tenant0')
        .withTenantId('33333333-3333-3333-3333-333333333333')
        .build()

      const instance1: Instance = instanceBuilder
        .withInstanceType('alertmanager')
        .withId('00000000-1111-0000-0000-000000000000')
        .withName('am 01')
        .withDescription('desc am 01')
        .withRelatedConfigs([
          '99999999-1111-0000-0000-000000000000',
          '88888888-1111-0000-0000-000000000000'
        ])
        .withRelatedServiceInstances([])
        .withUrls(['https://my-tenant---vm-infra.am.nd2.mood-preprod.si.fr.intraorange'])
        .withInternalUrl('')
        .withVisibility('internal')
        .withTenantName('tenant0')
        .withTenantId('33333333-3333-3333-3333-333333333333')
        .build()

      const instances: Instance[] = []
      instances.push(instance0)
      instances.push(instance1)

      const instanceRepository = new InstanceRepositoryBuilder()
        .withGetInstances((tenantId: UUID, tenantName: string) =>
          Promise.resolve(instances.filter((instance) => {
            return instance.tenantId === tenantId;
          })
          )
        )
        .build()

      const useCase = new GetInstancesUseCase(instanceRepository)
      const presentation = new GetInstancesPresentationBuilder()
        .withDisplayInstances((displayInstances) => resolve(displayInstances))
        .build()

      // When
      useCase.execute(new GetInstancesRequest('33333333-3333-3333-3333-333333333333', 'tenant0'), presentation)
    }).then((instances: Instance[]) => {
      // Then
      expect(instances).toBeDefined()
      expect(instances).toHaveLength(2)

      expect(instances[0].instanceType).toStrictEqual('prometheus')
      expect(instances[0].id).toStrictEqual('00000000-0000-0000-0000-000000000000')
      expect(instances[0].name).toStrictEqual('prom 01')
      expect(instances[0].description).toStrictEqual('desc prom 01')
      expect(instances[0].relatedConfigs).toHaveLength(2)
      expect(instances[0].relatedConfigs[0]).toStrictEqual('99999999-0000-0000-0000-000000000000')
      expect(instances[0].relatedConfigs[1]).toStrictEqual('88888888-0000-0000-0000-000000000000')
      expect(instances[0].relatedServiceInstances).toHaveLength(0)
      expect(instances[0].urls).toHaveLength(2)
      expect(instances[0].urls[0]).toStrictEqual(
        'https://my-tenant---vm-infra.prom.nd2.mood-preprod.si.fr.intraorange'
      )
      expect(instances[0].urls[1]).toStrictEqual(
        'https://00000eee-12ab-417c-876c-168dc15a0520.prom.nd2.mood-preprod.si.fr.intraorange'
      )
      expect(instances[0].internalUrl).toStrictEqual(
        'http://svm-00000eee-12ab-417c-876c-168dc15a0520.mood-tenant-11111111-aaaa-4888-8e3c-827181ecd0fc.svc.bmsmood.local:8428'
      )
      expect(instances[0].tenantName).toStrictEqual('tenant0')
      expect(instances[0].visibility).toStrictEqual('private')

      expect(instances[1].instanceType).toStrictEqual('alertmanager')
      expect(instances[1].id).toStrictEqual('00000000-1111-0000-0000-000000000000')
      expect(instances[1].name).toStrictEqual('am 01')
      expect(instances[1].description).toStrictEqual('desc am 01')
      expect(instances[1].relatedConfigs).toHaveLength(2)
      expect(instances[1].relatedConfigs[0]).toStrictEqual('99999999-1111-0000-0000-000000000000')
      expect(instances[1].relatedConfigs[1]).toStrictEqual('88888888-1111-0000-0000-000000000000')
      expect(instances[1].relatedServiceInstances).toHaveLength(0)
      expect(instances[1].urls).toHaveLength(1)
      expect(instances[1].urls[0]).toStrictEqual(
        'https://my-tenant---vm-infra.am.nd2.mood-preprod.si.fr.intraorange'
      )
      expect(instances[1].internalUrl).toStrictEqual('')
      expect(instances[1].tenantName).toStrictEqual('tenant0')
      expect(instances[1].visibility).toStrictEqual('internal')
    })
  })
})
