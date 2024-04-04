import {
  DeleteAclRequest,
  DeleteAclUseCase,
  DeleteAclErrors,
  DeleteAclFields,
  Acl,
  AclBuilder,
  RoleTypes
} from '@mood/domain'
import { DeleteAclPresentationBuilder } from '__tests__/builders/DeleteAclPresentationBuilder'
import { AclRepositoryBuilder } from '__tests__/builders/AclRepositoryBuilder'
import { describe, test, expect } from 'vitest'
import { UUID } from 'crypto'

describe('Feature: Delete new acl use case', () => {
  function givenAllIsOK(resolve: any): DeleteAclUseCase {
    const aclRepository = new AclRepositoryBuilder()
      .withDeleteAcl((acl: Acl) => {
        resolve(acl)
        return Promise.resolve()
      })
      .build()

    const deleteAclUseCase = new DeleteAclUseCase(aclRepository)
    return deleteAclUseCase
  }

  function givenAnError(): DeleteAclUseCase {
    const aclRepository = new AclRepositoryBuilder().build()
    const deleteAclUseCase = new DeleteAclUseCase(aclRepository)
    return deleteAclUseCase
  }

  test('Delete acl from repository when acl is valid', async () => {
    const errors = await new Promise((resolve) => {
      // Given
      const deleteAclUseCase = givenAllIsOK(resolve)
      const aclBuilder = new AclBuilder()
      const acl0: Acl = aclBuilder
        .withTenantName('tenant0')
        .withTenantId('00000000-0000-0000-0000-000000000000')
        .withId('00000000-0000-0000-0000-000000000001')
        .withOwner('user0')
        .withOwnerType('user')
        .withRole('administrator')
        .build()

      const acl1: Acl = aclBuilder
        .withTenantName('tenant0')
        .withTenantId('00000000-0000-0000-0000-000000000000')
        .withId('00000000-0000-0000-0000-000000000002')
        .withOwner('team0')
        .withOwnerType('team')
        .withRole('administrator')
        .build()

      const acls: Acl[] = []
      acls.push(acl0)
      acls.push(acl1)

      // When
      const presenter = new DeleteAclPresentationBuilder().build()
      const request = new DeleteAclRequest(
        acls,
        '00000000-0000-0000-0000-000000000002',
        'team0',
        'team',
        'administrator',
        'tenant0',
        '00000000-0000-0000-0000-000000000000'
      )
      deleteAclUseCase.execute(request, presenter)
    })

    // Then
    expect(errors).toBeDefined
  })

  test('Delete last admin must fail', async () => {
    // Given
    const deleteAclUseCase = givenAnError()
    const aclBuilder = new AclBuilder()
    const acl0: Acl = aclBuilder
      .withTenantName('tenant0')
      .withTenantId('00000000-0000-0000-0000-000000000000')
      .withId('00000000-0000-0000-0000-000000000001')
      .withOwner('user0')
      .withOwnerType('user')
      .withRole('administrator')
      .build()

    const acl1: Acl = aclBuilder
      .withTenantName('tenant0')
      .withTenantId('00000000-0000-0000-0000-000000000000')
      .withId('00000000-0000-0000-0000-000000000002')
      .withOwner('team0')
      .withOwnerType('team')
      .withRole('viewer')
      .build()

    const acls: Acl[] = []
    acls.push(acl0)
    acls.push(acl1)

    // When
    const errors: DeleteAclErrors = await new Promise((resolve) => {
      const presentation = new DeleteAclPresentationBuilder()
        .withNotifyDeleteAclFieldError((err: DeleteAclErrors) => {
          resolve(err)
        })
        .build()

      const request = new DeleteAclRequest(
        acls,
        '00000000-0000-0000-0000-000000000001',
        'user0',
        'user',
        'administrator',
        'tenant0',
        '00000000-0000-0000-0000-000000000000'
      )
      return deleteAclUseCase.execute(request, presentation)
    })
    expect(errors.has(DeleteAclFields.acls)).toBeTruthy()
    expect(errors.get(DeleteAclFields.acls)).toBe('canTDeleteLastAdmin')
  })

  test('Delete acl without a role must fail', async () => {
    // Given
    const deleteAclUseCase = givenAnError()
    const aclBuilder = new AclBuilder()
    const acl0: Acl = aclBuilder
      .withTenantName('tenant0')
      .withTenantId('00000000-0000-0000-0000-000000000000')
      .withId('00000000-0000-0000-0000-000000000001')
      .withOwner('user0')
      .withOwnerType('user')
      .withRole('administrator')
      .build()

    const acl1: Acl = aclBuilder
      .withTenantName('tenant0')
      .withTenantId('00000000-0000-0000-0000-000000000000')
      .withId('00000000-0000-0000-0000-000000000002')
      .withOwner('team0')
      .withOwnerType('team')
      .withRole('viewer')
      .build()

    const acls: Acl[] = []
    acls.push(acl0)
    acls.push(acl1)

    // When
    const errors: DeleteAclErrors = await new Promise((resolve) => {
      const presentation = new DeleteAclPresentationBuilder()
        .withNotifyDeleteAclFieldError((err: DeleteAclErrors) => {
          resolve(err)
        })
        .build()

      const request = new DeleteAclRequest(
        acls,
        '00000000-0000-0000-0000-000000000002',
        'team0',
        'team',
        '' as RoleTypes,
        'tenant0',
        '00000000-0000-0000-0000-000000000000'
      )
      return deleteAclUseCase.execute(request, presentation)
    })
    expect(errors.has(DeleteAclFields.role)).toBeTruthy()
    expect(errors.get(DeleteAclFields.role)).toBe('RoleIsRequired')
  })

  test('Delete acl without owner must fail', async () => {
    // Given
    const deleteAclUseCase = givenAnError()
    const aclBuilder = new AclBuilder()
    const acl0: Acl = aclBuilder
      .withTenantName('tenant0')
      .withTenantId('00000000-0000-0000-0000-000000000000')
      .withId('00000000-0000-0000-0000-000000000001')
      .withOwner('user0')
      .withOwnerType('user')
      .withRole('administrator')
      .build()

    const acl1: Acl = aclBuilder
      .withTenantName('tenant0')
      .withTenantId('00000000-0000-0000-0000-000000000000')
      .withId('00000000-0000-0000-0000-000000000002')
      .withOwner('team0')
      .withOwnerType('team')
      .withRole('viewer')
      .build()

    const acls: Acl[] = []
    acls.push(acl0)
    acls.push(acl1)

    // When
    const errors: DeleteAclErrors = await new Promise((resolve) => {
      const presentation = new DeleteAclPresentationBuilder()
        .withNotifyDeleteAclFieldError((err: DeleteAclErrors) => {
          resolve(err)
        })
        .build()
      return deleteAclUseCase.execute(
        new DeleteAclRequest(
          acls,
          '00000000-0000-0000-0000-000000000002',
          '',
          'team',
          'administrator',
          'tenant0',
          '00000000-0000-0000-0000-000000000000'
        ),
        presentation
      )
    })
    expect(errors.has(DeleteAclFields.owner)).toBeTruthy()
    expect(errors.get(DeleteAclFields.owner)).toBe('thisFieldIsRequired')
  })

  test('Delete acl without ownerType', async () => {
    // Given
    const deleteAclUseCase = givenAnError()
    const aclBuilder = new AclBuilder()
    const acl0: Acl = aclBuilder
      .withTenantName('tenant0')
      .withTenantId('00000000-0000-0000-0000-000000000000')
      .withId('00000000-0000-0000-0000-000000000001')
      .withOwner('user0')
      .withOwnerType('user')
      .withRole('administrator')
      .build()

    const acl1: Acl = aclBuilder
      .withTenantName('tenant0')
      .withTenantId('00000000-0000-0000-0000-000000000000')
      .withId('00000000-0000-0000-0000-000000000002')
      .withOwner('team0')
      .withOwnerType('team')
      .withRole('viewer')
      .build()

    const acls: Acl[] = []
    acls.push(acl0)
    acls.push(acl1)

    // When
    const errors: DeleteAclErrors = await new Promise((resolve) => {
      const presentation = new DeleteAclPresentationBuilder()
        .withNotifyDeleteAclFieldError((err: DeleteAclErrors) => {
          resolve(err)
        })
        .build()
      return deleteAclUseCase.execute(
        new DeleteAclRequest(
          acls,
          '00000000-0000-0000-0000-000000000002',
          'team0',
          '',
          'administrator',
          'tenant0',
          '00000000-0000-0000-0000-000000000000'
        ),
        presentation
      )
    })
    expect(errors.has(DeleteAclFields.ownerType)).toBeTruthy()
    expect(errors.get(DeleteAclFields.ownerType)).toBe('OwnerTypeIsRequired')
  })

  test('Delete acl without tenantName', async () => {
    // Given
    const deleteAclUseCase = givenAnError()
    const aclBuilder = new AclBuilder()
    const acl0: Acl = aclBuilder
      .withTenantName('tenant0')
      .withTenantId('00000000-0000-0000-0000-000000000000')
      .withId('00000000-0000-0000-0000-000000000001')
      .withOwner('user0')
      .withOwnerType('user')
      .withRole('administrator')
      .build()

    const acl1: Acl = aclBuilder
      .withTenantName('tenant0')
      .withTenantId('00000000-0000-0000-0000-000000000000')
      .withId('00000000-0000-0000-0000-000000000002')
      .withOwner('team0')
      .withOwnerType('team')
      .withRole('viewer')
      .build()

    const acls: Acl[] = []
    acls.push(acl0)
    acls.push(acl1)

    // When
    const errors: DeleteAclErrors = await new Promise((resolve) => {
      const presentation = new DeleteAclPresentationBuilder()
        .withNotifyDeleteAclFieldError((err: DeleteAclErrors) => {
          resolve(err)
        })
        .build()
      return deleteAclUseCase.execute(
        new DeleteAclRequest(
          acls,
          '00000000-0000-0000-0000-000000000002',
          'team0',
          'team',
          'administrator',
          '',
          '' as UUID
        ),
        presentation
      )
    })

    // Then
    expect(errors.has(DeleteAclFields.tenantId)).toBeTruthy()
    expect(errors.get(DeleteAclFields.tenantId)).toBe('tenantIdIsRequired')
  })
})
