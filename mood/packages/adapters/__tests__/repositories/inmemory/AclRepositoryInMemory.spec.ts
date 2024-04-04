import { Acl } from '@mood/domain'
import { AclRepositoryInMemory } from '@mood/web-adapters'
import { describe, test, expect } from 'vitest'

describe('AclRepositoryInMemory', () => {
  test('get acls should be fine', async () => {
    // Given
    const acls: any[] = [
      {
        owner: 'user0',
        ownerType: 'user',
        role: 'administrator',
        tenantName: 'tenant0',
        tenantId: '00000000-0000-0000-0000-000000000000'
      },
      {
        owner: 'team0',
        ownerType: 'team',
        role: 'viewer',
        tenantName: 'tenant0',
        tenantId: '00000000-0000-0000-0000-000000000000'
      }
    ]

    const aclRepository = new AclRepositoryInMemory(acls)

    // When
    const aclsFetched: Acl[] = await aclRepository.getAcls(
      '00000000-0000-0000-0000-000000000000',
      'tenant0'
    )

    // Then
    expect(aclsFetched).toBeDefined()
    expect(aclsFetched).toHaveLength(2)

    expect(aclsFetched[0].owner).toStrictEqual('user0')
    expect(aclsFetched[0].ownerType).toStrictEqual('user')
    expect(aclsFetched[0].role).toStrictEqual('administrator')
    expect(aclsFetched[0].tenantName).toStrictEqual('tenant0')
    expect(aclsFetched[0].tenantId).toStrictEqual('00000000-0000-0000-0000-000000000000')

    expect(aclsFetched[1].owner).toStrictEqual('team0')
    expect(aclsFetched[1].ownerType).toStrictEqual('team')
    expect(aclsFetched[1].role).toStrictEqual('viewer')
    expect(aclsFetched[1].tenantName).toStrictEqual('tenant0')
    expect(aclsFetched[1].tenantId).toStrictEqual('00000000-0000-0000-0000-000000000000')
  })
})
