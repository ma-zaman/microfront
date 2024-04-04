import { describe, test, expect } from 'vitest'

import {
  AddTenantRequest,
  AddTenantUseCase,
  Tenant,
  AddTenantErrors,
  NewTenantFields
} from '@mood/domain'

import { AddTenantPresentationBuilder } from '__tests__/builders/AddTenantPresentationBuilder'
import { TenantRepositoryBuilder } from '__tests__/builders/TenantRepositoryBuilder'

describe('Feature: Add new tenant use case', () => {
  function givenAllIsOK(resolve: any): AddTenantUseCase {
    const tenantRepository = new TenantRepositoryBuilder()
      .withAddTenant((tenant: Tenant) => {
        resolve(tenant)
        return Promise.resolve()
      })
      .build()

    const addTenantUseCase = new AddTenantUseCase(tenantRepository)
    return addTenantUseCase
  }

  function givenAnError(): AddTenantUseCase {
    const tenantRepository = new TenantRepositoryBuilder().build()
    const addTenantUseCase = new AddTenantUseCase(tenantRepository)
    return addTenantUseCase
  }

  test('Add tenant to repository when tenant is valid', async () => {
    const tenantAdded = await new Promise<Tenant>((resolve) => {
      // Given
      const addTenantUseCase = givenAllIsOK(resolve)

      // When
      const presenter = new AddTenantPresentationBuilder().build()
      const request = new AddTenantRequest(
        'my-super-tenant',
        new Map().set('com.orange.repository.orangecarto/id', '10'),
        'super description'
      )
      addTenantUseCase.execute(request, presenter)
    })
    // Then
    expect(tenantAdded).toBeDefined()
    expect(tenantAdded.name).toBe('my-super-tenant')
    expect(tenantAdded.labels?.size).toEqual(1)
    expect(tenantAdded.labels?.get('com.orange.repository.orangecarto/id')).toBe('10')
    expect(tenantAdded.description).toBe('super description')
  })
  test('Add tenant with name under 3 characters must fail', async () => {
    // Given
    const addTenantUseCase = givenAnError()

    // When
    const errors: AddTenantErrors = await new Promise((resolve) => {
      const presentation = new AddTenantPresentationBuilder()
        .withNotifyNewTenantFieldError((err: AddTenantErrors) => {
          resolve(err)
        })
        .build()
      return addTenantUseCase.execute(
        new AddTenantRequest(
          'te',
          new Map().set('com.orange.repository.orangecarto/id', '10'),
          'super description'
        ),
        presentation
      )
    })
    expect(errors.has(NewTenantFields.name)).toBeTruthy()
    expect(errors.get(NewTenantFields.name)).toBe('thisFieldMustContainBetween3And30Characters')
  })
  test('Add tenant with name of more than 30 characters must fail', async () => {
    // Given
    const addTenantUseCase = givenAnError()

    // When
    const errors: AddTenantErrors = await new Promise((resolve) => {
      const presentation = new AddTenantPresentationBuilder()
        .withNotifyNewTenantFieldError((err: AddTenantErrors) => {
          resolve(err)
        })
        .build()
      return addTenantUseCase.execute(
        new AddTenantRequest(
          'hexakosioihexekontahexaphobique',
          new Map().set('com.orange.repository.orangecarto/id', '10'),
          'super description'
        ),
        presentation
      )
    })
    expect(errors.has(NewTenantFields.name)).toBeTruthy()
    expect(errors.get(NewTenantFields.name)).toBe('thisFieldMustContainBetween3And30Characters')
  })
  test('Add tenant with blank name must fail', async () => {
    // Given
    const addTenantUseCase = givenAnError()

    // When
    const errors: AddTenantErrors = await new Promise((resolve) => {
      const presentation = new AddTenantPresentationBuilder()
        .withNotifyNewTenantFieldError((err: AddTenantErrors) => {
          resolve(err)
        })
        .build()
      return addTenantUseCase.execute(
        new AddTenantRequest(
          '     ',
          new Map().set('com.orange.repository.orangecarto/id', '10'),
          'super description'
        ),
        presentation
      )
    })
    expect(errors.has(NewTenantFields.name)).toBeTruthy()
    expect(errors.get(NewTenantFields.name)).toBe('thisFieldMustContainBetween3And30Characters')
  })

  test('Add tenant with appId having size > 6 must fail', async () => {
    // Given
    const addTenantUseCase = givenAnError()

    // When
    const errors: AddTenantErrors = await new Promise((resolve) => {
      const presentation = new AddTenantPresentationBuilder()
        .withNotifyNewTenantFieldError((err: AddTenantErrors) => {
          resolve(err)
        })
        .build()
      return addTenantUseCase.execute(
        new AddTenantRequest(
          'mon-tenant',
          new Map().set('com.orange.repository.orangecarto/id', '1234567'),
          'super description'
        ),
        presentation
      )
    })

    // Then
    expect(errors.has(NewTenantFields.appId)).toBeTruthy()
    expect(errors.get(NewTenantFields.appId)).toBe('thisFieldMustContainBetween1And5Digits')
  })

  test('Add tenant with empty appId must fail', async () => {
    // Given
    const addTenantUseCase = givenAnError()

    // When
    const errors: AddTenantErrors = await new Promise((resolve) => {
      const presentation = new AddTenantPresentationBuilder()
        .withNotifyNewTenantFieldError((err: AddTenantErrors) => {
          resolve(err)
        })
        .build()
      return addTenantUseCase.execute(
        new AddTenantRequest(
          'mon-tenant',
          new Map().set('com.orange.repository.orangecarto/id', ''),
          'super description'
        ),
        presentation
      )
    })

    // Then
    expect(errors.has(NewTenantFields.appId)).toBeTruthy()
    expect(errors.get(NewTenantFields.appId)).toBe('thisFieldMustContainBetween1And5Digits')
  })

  test('Add tenant without orange carto label defined must fail', async () => {
    // Given
    const addTenantUseCase = givenAnError()

    // When
    const errors: AddTenantErrors = await new Promise((resolve) => {
      const presentation = new AddTenantPresentationBuilder()
        .withNotifyNewTenantFieldError((err: AddTenantErrors) => {
          resolve(err)
        })
        .build()
      return addTenantUseCase.execute(
        new AddTenantRequest(
          'mon-tenant',
          new Map().set('other-label', 'yeah'),
          'super description'
        ),
        presentation
      )
    })

    // Then
    expect(errors.has(NewTenantFields.appId)).toBeTruthy()
    expect(errors.get(NewTenantFields.appId)).toBe('thisFieldMustContainBetween1And5Digits')
  })

  test('Add tenant without description defined must fail', async () => {
    // Given
    const addTenantUseCase = givenAnError()

    // When
    const errors: AddTenantErrors = await new Promise((resolve) => {
      const presentation = new AddTenantPresentationBuilder()
        .withNotifyNewTenantFieldError((err: AddTenantErrors) => {
          resolve(err)
        })
        .build()
      return addTenantUseCase.execute(
        new AddTenantRequest('mon-tenant', new Map().set('other-label', 'yeah'), ''),
        presentation
      )
    })

    // Then
    expect(errors.has(NewTenantFields.description)).toBeTruthy()
    expect(errors.get(NewTenantFields.description)).toBe('thisFieldIsRequired')
  })

  test('Add tenant with description having size > 1000', async () => {
    // Given
    const addTenantUseCase = givenAnError()

    // When
    const errors: AddTenantErrors = await new Promise((resolve) => {
      const presentation = new AddTenantPresentationBuilder()
        .withNotifyNewTenantFieldError((err: AddTenantErrors) => {
          resolve(err)
        })
        .build()

      let description: string = '!' + '#'.repeat(1000)
      return addTenantUseCase.execute(
        new AddTenantRequest('mon-tenant', new Map().set('other-label', 'yeah'), description),
        presentation
      )
    })

    // Then
    expect(errors.has(NewTenantFields.description)).toBeTruthy()
    expect(errors.get(NewTenantFields.description)).toBe('thisFieldMustBeLessThan1000Characters')
  })
})
