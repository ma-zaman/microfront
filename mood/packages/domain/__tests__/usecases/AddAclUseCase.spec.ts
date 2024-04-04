import { describe, test, expect } from 'vitest'

import {
  AddAclRequest,
  AddAclUseCase,
  Acl,
  AddAclErrors,
  NewAclFields,
  AclOwnerTypes,
  RoleTypes
} from '@mood/domain'

import { AclRepositoryBuilder } from '__tests__/builders/AclRepositoryBuilder'
import { AddAclPresentationBuilder } from '__tests__/builders/AddAclPresentationBuilder'
import { UUID } from 'crypto'

describe('Feature: Add new acl use case', () => {
  function givenAllIsOK(resolve: any): AddAclUseCase {
    const aclRepository = new AclRepositoryBuilder()
      .withAddAcl((acl: Acl) => {
        resolve(acl)
        return Promise.resolve()
      })
      .build()

    const addAclUseCase = new AddAclUseCase(aclRepository)
    return addAclUseCase
  }

  function givenAnError(): AddAclUseCase {
    const aclRepository = new AclRepositoryBuilder().build()
    const addAclUseCase = new AddAclUseCase(aclRepository)
    return addAclUseCase
  }

  test('Add acl to repository when acl is valid', async () => {
    const aclAdded = await new Promise<Acl>((resolve) => {
      // Given
      const addAclUseCase = givenAllIsOK(resolve)

      // When
      const presenter = new AddAclPresentationBuilder().build()
      const request = new AddAclRequest(
        'owner',
        'user',
        'administrator',
        '00000000-0000-0000-0000-000000000000',
        'my-tenant'
      )
      addAclUseCase.execute(request, presenter)
    })
    // Then
    expect(aclAdded).toBeDefined()
    expect(aclAdded.owner).toBe('owner')
    expect(aclAdded.ownerType).toBe('user')
    expect(aclAdded.role).toBe('administrator')
    expect(aclAdded.tenantName).toBe('my-tenant')
  })
  test('Add acl without owner characters must fail', async () => {
    // Given
    const addAclUseCase = givenAnError()

    // When
    const errors: AddAclErrors = await new Promise((resolve) => {
      const presentation = new AddAclPresentationBuilder()
        .withNotifyNewAclFieldError((err: AddAclErrors) => {
          resolve(err)
        })
        .build()
      return addAclUseCase.execute(
        new AddAclRequest('', 'user', 'administrator', '00000000-0000-0000-0000-000000000000', 'my-tenant'),
        presentation
      )
    })
    expect(errors.has(NewAclFields.owner)).toBeTruthy()
    expect(errors.get(NewAclFields.owner)).toBe('thisFieldIsRequired')
  })
  test('Add acl without ownerType', async () => {
    // Given
    const addAclUseCase = givenAnError()

    // When
    const errors: AddAclErrors = await new Promise((resolve) => {
      const presentation = new AddAclPresentationBuilder()
        .withNotifyNewAclFieldError((err: AddAclErrors) => {
          resolve(err)
        })
        .build()
      return addAclUseCase.execute(
        new AddAclRequest(
          'owner',
          '' as AclOwnerTypes,
          'administrator',
          '00000000-0000-0000-0000-000000000000',
          'my-tenant'
        ),
        presentation
      )
    })
    expect(errors.has(NewAclFields.ownerType)).toBeTruthy()
    expect(errors.get(NewAclFields.ownerType)).toBe('OwnerTypeIsRequired')
  })
  test('Add acl without role', async () => {
    // Given
    const addAclUseCase = givenAnError()

    // When
    const errors: AddAclErrors = await new Promise((resolve) => {
      const presentation = new AddAclPresentationBuilder()
        .withNotifyNewAclFieldError((err: AddAclErrors) => {
          resolve(err)
        })
        .build()
      return addAclUseCase.execute(
        new AddAclRequest(
          'owner',
          'user',
          '' as RoleTypes,
          '00000000-0000-0000-0000-000000000000',
          'my-tenant'
        ),
        presentation
      )
    })
    expect(errors.has(NewAclFields.role)).toBeTruthy()
    expect(errors.get(NewAclFields.role)).toBe('RoleIsRequired')
  })

  test('Add acl without tenantName', async () => {
    // Given
    const addAclUseCase = givenAnError()

    // When
    const errors: AddAclErrors = await new Promise((resolve) => {
      const presentation = new AddAclPresentationBuilder()
        .withNotifyNewAclFieldError((err: AddAclErrors) => {
          resolve(err)
        })
        .build()
      return addAclUseCase.execute(
        new AddAclRequest('owner', 'user', 'administrator', '' as UUID, ''),
        presentation
      )
    })

    // Then
    expect(errors.has(NewAclFields.tenantName)).toBeTruthy()
    expect(errors.get(NewAclFields.tenantName)).toBe('tenantNameIsRequired')
  })
})
