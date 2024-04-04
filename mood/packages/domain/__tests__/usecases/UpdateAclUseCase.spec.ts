import { describe, test, expect, beforeEach } from 'vitest'

import {
  UpdateAclRequest,
  UpdateAclUseCase,
  Acl,
  UpdateAclErrors,
  AclBuilder,
  UpdateAclFields,
  RoleTypes,
  AclOwnerTypes
} from '@mood/domain'

import { AclRepositoryBuilder } from '__tests__/builders/AclRepositoryBuilder'
import { UpdateAclPresentationBuilder } from '__tests__/builders/UpdateAclPresentationBuilder'
import { UUID } from 'crypto'

function givenAllIsOK(resolve: any): UpdateAclUseCase {
  const aclRepository = new AclRepositoryBuilder()
    .withUpdateAcl((acl: Acl) => {
      resolve(acl)
      return Promise.resolve()
    })
    .build()

  const updateAclUseCase = new UpdateAclUseCase(aclRepository)
  return updateAclUseCase
}

function givenAnError(): UpdateAclUseCase {
  const aclRepository = new AclRepositoryBuilder().build()
  const updateAclUseCase = new UpdateAclUseCase(aclRepository)
  return updateAclUseCase
}

describe('Feature: Update acl use case', () => {
  let aclToUpdate: Acl

  beforeEach(() => {
    aclToUpdate = new AclBuilder()
      .withId('00000000-0000-0000-0000-000000000000')
      .withOwner('Owner')
      .withOwnerType('user')
      .withRole('viewer')
      .withTenantId('00000000-0000-0000-0000-000000000000')
      .withTenantName('tenant0')
      .build()
  })

  test('Update acl to repository when acl is valid', async () => {
    const aclUpdated = await new Promise<Acl>((resolve) => {
      // Given
      const updateAclUseCase = givenAllIsOK(resolve)

      // When
      const presenter = new UpdateAclPresentationBuilder().build()
      const request = new UpdateAclRequest(
        aclToUpdate.id,
        aclToUpdate.owner,
        aclToUpdate.ownerType,
        aclToUpdate.role,
        aclToUpdate.tenantId,
        aclToUpdate.tenantName
      )
      updateAclUseCase.execute(request, presenter)
    })
    // Then
    expect(aclUpdated).toBeDefined()
    expect(aclUpdated.owner).toBe('Owner')
    expect(aclUpdated.ownerType).toBe('user')
    expect(aclUpdated.role).toBe('viewer')
    expect(aclUpdated.tenantId).toBe('00000000-0000-0000-0000-000000000000')
    expect(aclUpdated.tenantName).toBe('tenant0')
  })

  test('Update acl without a role must fail', async () => {
    // Given
    const updateAclUseCase = givenAnError()

    // When
    const errors: UpdateAclErrors = await new Promise((resolve) => {
      const presentation = new UpdateAclPresentationBuilder()
        .withNotifyUpdateAclFieldError((err: UpdateAclErrors) => {
          resolve(err)
        })
        .build()

      const request = new UpdateAclRequest(
        aclToUpdate.id,
        aclToUpdate.owner,
        aclToUpdate.ownerType,
        '' as RoleTypes,
        aclToUpdate.tenantId,
        aclToUpdate.tenantName
      )
      return updateAclUseCase.execute(request, presentation)
    })
    expect(errors.has(UpdateAclFields.role)).toBeTruthy()
    expect(errors.get(UpdateAclFields.role)).toBe('RoleIsRequired')
  })

  test('Update acl without owner must fail', async () => {
    // Given
    const updateAclUseCase = givenAnError()

    // When
    const errors: UpdateAclErrors = await new Promise((resolve) => {
      const presentation = new UpdateAclPresentationBuilder()
        .withNotifyUpdateAclFieldError((err: UpdateAclErrors) => {
          resolve(err)
        })
        .build()
      return updateAclUseCase.execute(
        new UpdateAclRequest(
          aclToUpdate.id,
          '',
          aclToUpdate.ownerType,
          aclToUpdate.role,
          aclToUpdate.tenantId,
          aclToUpdate.tenantName
        ),
        presentation
      )
    })
    expect(errors.has(UpdateAclFields.owner)).toBeTruthy()
    expect(errors.get(UpdateAclFields.owner)).toBe('thisFieldIsRequired')
  })

  test('Update acl without ownerType', async () => {
    // Given
    const updateAclUseCase = givenAnError()

    // When
    const errors: UpdateAclErrors = await new Promise((resolve) => {
      const presentation = new UpdateAclPresentationBuilder()
        .withNotifyUpdateAclFieldError((err: UpdateAclErrors) => {
          resolve(err)
        })
        .build()
      return updateAclUseCase.execute(
        new UpdateAclRequest(
          aclToUpdate.id,
          aclToUpdate.owner,
          '' as AclOwnerTypes,
          aclToUpdate.role,
          aclToUpdate.tenantId,
          aclToUpdate.tenantName
        ),
        presentation
      )
    })
    expect(errors.has(UpdateAclFields.ownerType)).toBeTruthy()
    expect(errors.get(UpdateAclFields.ownerType)).toBe('OwnerTypeIsRequired')
  })

  test('Update acl without tenantName', async () => {
    // Given
    const updateAclUseCase = givenAnError()

    // When
    const errors: UpdateAclErrors = await new Promise((resolve) => {
      const presentation = new UpdateAclPresentationBuilder()
        .withNotifyUpdateAclFieldError((err: UpdateAclErrors) => {
          resolve(err)
        })
        .build()
      return updateAclUseCase.execute(
        new UpdateAclRequest(
          aclToUpdate.owner,
          aclToUpdate.ownerType,
          aclToUpdate.role,
          '' as UUID,
          ''
        ),
        presentation
      )
    })

    // Then
    expect(errors.has(UpdateAclFields.tenantName)).toBeTruthy()
    expect(errors.get(UpdateAclFields.tenantName)).toBe('tenantNameIsRequired')
    expect(errors.has(UpdateAclFields.tenantId)).toBeTruthy()
    expect(errors.get(UpdateAclFields.tenantId)).toBe('tenantIdIsRequired')
  })
})
