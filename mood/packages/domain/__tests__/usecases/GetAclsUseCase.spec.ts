import { GetAclsRequest, GetAclsUseCase, RoleTypes, Acl, AclBuilder } from '@mood/domain'
import { GetAclsPresentationBuilder } from '__tests__/builders/GetAclsPresentationBuilder'
import { AclRepositoryBuilder } from '__tests__/builders/AclRepositoryBuilder'
import { describe, test, expect } from 'vitest'

describe('Get acls use case', () => {
  test('display list of acls', async () => {
    return new Promise((resolve) => {
      // Given
      const aclBuilder = new AclBuilder()
      const acl0: Acl = aclBuilder
        .withTenantName('tenant0')
        .withOwner('user0')
        .withOwnerType('user')
        .withRole('administrator')
        .build()

      const acl1: Acl = aclBuilder
        .withTenantName('tenant0')
        .withOwner('team0')
        .withOwnerType('team')
        .withRole('viewer')
        .build()

      const acls: Acl[] = []
      acls.push(acl0)
      acls.push(acl1)

      const aclRepository = new AclRepositoryBuilder()
        .withGetAcls((tenantName: string) =>
          Promise.resolve(acls.filter((acl) => acl.tenantName === tenantName))
        )
        .build()

      const useCase = new GetAclsUseCase(aclRepository)
      const presentation = new GetAclsPresentationBuilder()
        .withDisplayAcls((displayAcls) => resolve(displayAcls))
        .build()

      // When
      useCase.execute(new GetAclsRequest('tenant0'), presentation)
    }).then((acls: Acl[]) => {
      // Then
      expect(acls).toBeDefined()
      expect(acls).toHaveLength(2)

      expect(acls[0].owner).toStrictEqual('user0')
      expect(acls[0].ownerType).toStrictEqual('user')
      expect(acls[0].role).toStrictEqual('administrator')
      expect(acls[0].tenantName).toStrictEqual('tenant0')

      expect(acls[1].owner).toStrictEqual('team0')
      expect(acls[1].ownerType).toStrictEqual('team')
      expect(acls[1].role).toStrictEqual('viewer')
      expect(acls[1].tenantName).toStrictEqual('tenant0')
    })
  })
})
