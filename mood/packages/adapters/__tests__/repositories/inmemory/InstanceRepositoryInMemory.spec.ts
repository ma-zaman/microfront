import { Instance } from '@mood/domain'
import { InstanceRepositoryInMemory } from '@mood/web-adapters'
import { describe, test, expect } from 'vitest'

describe('InstanceRepositoryInMemory', () => {
  test('get instances should be fine', async () => {
    // Given
    const instances: any[] = [
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
        tenantName: 'tenant0',
        tenantId: '33333333-3333-3333-3333-333333333333'
      }
    ]

    const instanceRepository = new InstanceRepositoryInMemory(instances)

    // When
    const instancesFetched: Instance[] = await instanceRepository.getInstances(
      '33333333-3333-3333-3333-333333333333',
      'tenant0'
    )

    // Then
    expect(instancesFetched).toBeDefined()
    expect(instancesFetched).toHaveLength(1)

    expect(instancesFetched[0].instanceType).toStrictEqual('victoria')
    expect(instancesFetched[0].name).toStrictEqual('vm-infra')
    expect(instancesFetched[0].id).toStrictEqual('00000eee-12ab-417c-876c-168dc15a0520')
    expect(instancesFetched[0].description).toStrictEqual('')
    expect(instancesFetched[0].relatedConfigs).toStrictEqual([])
    expect(instancesFetched[0].relatedServiceInstances).toStrictEqual([])
    expect(instancesFetched[0].urls).toStrictEqual([
      'https://my-tenant---vm-infra.victoria.nd2.mood-preprod.si.fr.intraorange',
      'https://00000eee-12ab-417c-876c-168dc15a0520.victoria.nd2.mood-preprod.si.fr.intraorange'
    ])
    expect(instancesFetched[0].internalUrl).toStrictEqual(
      'http://svm-00000eee-12ab-417c-876c-168dc15a0520.mood-tenant-11111111-aaaa-4888-8e3c-827181ecd0fc.svc.bmsmood.local:8428'
    )
    expect(instancesFetched[0].visibility).toStrictEqual('private')
    expect(instancesFetched[0].tenantName).toStrictEqual('tenant0')
    expect(instancesFetched[0].tenantId).toStrictEqual('33333333-3333-3333-3333-333333333333')
  })

  test('update instances should be fine', async () => {
    // Given
    const instances: any[] = [
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
        tenantName: 'tenant0',
        tenantId: '33333333-3333-3333-3333-333333333333'
      }
    ]

    const instanceRepository = new InstanceRepositoryInMemory(instances)

    // When

    // Get instances
    const instancesFetchedBeforeUpdate: Instance[] = await instanceRepository.getInstances(
      '33333333-3333-3333-3333-333333333333',
      'tenant0'
    )

    // Update an instance
    const instanceToUpdate = instancesFetchedBeforeUpdate[0]
    instanceToUpdate.name = 'vm-infra-updated'
    await instanceRepository.updateInstance(instanceToUpdate)

    // Reload instances again
    const instancesFetchedAfterUpdate: Instance[] = await instanceRepository.getInstances(
      '33333333-3333-3333-3333-333333333333',
      'tenant0'
    )

    // Then
    expect(instancesFetchedAfterUpdate).toBeDefined()
    expect(instancesFetchedAfterUpdate).toHaveLength(1)

    expect(instancesFetchedAfterUpdate[0].name).toStrictEqual('vm-infra-updated')
    expect(instancesFetchedAfterUpdate[0].id).toStrictEqual('00000eee-12ab-417c-876c-168dc15a0520')
    expect(instancesFetchedAfterUpdate[0].description).toStrictEqual('')
    expect(instancesFetchedAfterUpdate[0].relatedConfigs).toStrictEqual([])
    expect(instancesFetchedAfterUpdate[0].relatedServiceInstances).toStrictEqual([])
    expect(instancesFetchedAfterUpdate[0].urls).toStrictEqual([
      'https://my-tenant---vm-infra.victoria.nd2.mood-preprod.si.fr.intraorange',
      'https://00000eee-12ab-417c-876c-168dc15a0520.victoria.nd2.mood-preprod.si.fr.intraorange'
    ])
    expect(instancesFetchedAfterUpdate[0].internalUrl).toStrictEqual(
      'http://svm-00000eee-12ab-417c-876c-168dc15a0520.mood-tenant-11111111-aaaa-4888-8e3c-827181ecd0fc.svc.bmsmood.local:8428'
    )
    expect(instancesFetchedAfterUpdate[0].visibility).toStrictEqual('private')
    expect(instancesFetchedAfterUpdate[0].tenantName).toStrictEqual('tenant0')
    expect(instancesFetchedAfterUpdate[0].tenantId).toStrictEqual(
      '33333333-3333-3333-3333-333333333333'
    )
  })
})
