import { describe, test, expect, beforeEach } from 'vitest'

import {
  UpdateTenantRequest,
  UpdateTenantUseCase,
  Tenant,
  UpdateTenantErrors,
  TenantBuilder,
  UpdateTenantFields
} from '@mood/domain'

import { TenantRepositoryBuilder } from '__tests__/builders/TenantRepositoryBuilder'
import { UpdateTenantPresentationBuilder } from '__tests__/builders/UpdateTenantPresentationBuilder'

function givenAllIsOK(resolve: any): UpdateTenantUseCase {
  const tenantRepository = new TenantRepositoryBuilder()
    .withUpdateTenant((tenant: Tenant) => {
      resolve(tenant)
      return Promise.resolve()
    })
    .build()

  const updateTenantUseCase = new UpdateTenantUseCase(tenantRepository)
  return updateTenantUseCase
}

function givenAnError(): UpdateTenantUseCase {
  const tenantRepository = new TenantRepositoryBuilder().build()
  const updateTenantUseCase = new UpdateTenantUseCase(tenantRepository)
  return updateTenantUseCase
}

describe('Feature: Update tenant use case', () => {
  let tenantToUpdate: Tenant

  beforeEach(() => {
    tenantToUpdate = new TenantBuilder()
      .withName('name')
      .withLabels(new Map().set('com.orange.repository.orangecarto/id', '9999'))
      .withDescription('Description')
      .build()
  })

  test('Update tenant to repository when tenant is valid', async () => {
    const tenantUpdated = await new Promise<Tenant>((resolve) => {
      // Given
      const updateTenantUseCase = givenAllIsOK(resolve)

      // When
      const presenter = new UpdateTenantPresentationBuilder().build()
      const request = new UpdateTenantRequest(tenantToUpdate)
      updateTenantUseCase.execute(request, presenter)
    })
    // Then
    expect(tenantUpdated).toBeDefined()
    expect(tenantUpdated.name).toBe('name')
    expect(tenantUpdated.labels?.size).toEqual(1)
    expect(tenantUpdated.labels?.get('com.orange.repository.orangecarto/id')).toBe('9999')
    expect(tenantUpdated.description).toBe('Description')
  })

  test('Update tenant with name under 3 characters must fail', async () => {
    // Given
    const updateTenantUseCase = givenAnError()

    // When
    const errors: UpdateTenantErrors = await new Promise((resolve) => {
      const presentation = new UpdateTenantPresentationBuilder()
        .withNotifyUpdateTenantFieldError((err: UpdateTenantErrors) => {
          resolve(err)
        })
        .build()

      tenantToUpdate.name = 'na'

      return updateTenantUseCase.execute(new UpdateTenantRequest(tenantToUpdate), presentation)
    })
    // then
    expect(errors.has(UpdateTenantFields.name)).toBeTruthy()
    expect(errors.get(UpdateTenantFields.name)).toBe('tenantNameLengthUnder3Error')
  })

  test('Update tenant with name of more than 30 characters must fail', async () => {
    // Given
    const updateTenantUseCase = givenAnError()

    // When
    const errors: UpdateTenantErrors = await new Promise((resolve) => {
      const presentation = new UpdateTenantPresentationBuilder()
        .withNotifyUpdateTenantFieldError((err: UpdateTenantErrors) => {
          resolve(err)
        })
        .build()

      tenantToUpdate.name = 'hexakosioihexekontahexaphobique'

      return updateTenantUseCase.execute(new UpdateTenantRequest(tenantToUpdate), presentation)
    })
    expect(errors.has(UpdateTenantFields.name)).toBeTruthy()
    expect(errors.get(UpdateTenantFields.name)).toBe('tenantNameLengthUpper30Error')
  })

  test('Update tenant with blank name must fail', async () => {
    // Given
    const updateTenantUseCase = givenAnError()

    // When
    const errors: UpdateTenantErrors = await new Promise((resolve) => {
      const presentation = new UpdateTenantPresentationBuilder()
        .withNotifyUpdateTenantFieldError((err: UpdateTenantErrors) => {
          resolve(err)
        })
        .build()

      tenantToUpdate.name = '     '

      return updateTenantUseCase.execute(new UpdateTenantRequest(tenantToUpdate), presentation)
    })
    expect(errors.has(UpdateTenantFields.name)).toBeTruthy()
    expect(errors.get(UpdateTenantFields.name)).toBe('tenantNameLengthUnder3Error')
  })

  test('Update tenant with appId having size > 6 must fail', async () => {
    // Given
    const updateTenantUseCase = givenAnError()

    // When
    const errors: UpdateTenantErrors = await new Promise((resolve) => {
      const presentation = new UpdateTenantPresentationBuilder()
        .withNotifyUpdateTenantFieldError((err: UpdateTenantErrors) => {
          resolve(err)
        })
        .build()

      tenantToUpdate.labels = new Map().set('com.orange.repository.orangecarto/id', '1234567')

      return updateTenantUseCase.execute(new UpdateTenantRequest(tenantToUpdate), presentation)
    })

    // Then
    expect(errors.has(UpdateTenantFields.appId)).toBeTruthy()
    expect(errors.get(UpdateTenantFields.appId)).toBe('tenantAppIdLengthError')
  })

  test('Update tenant with empty appId must fail', async () => {
    // Given
    const updateTenantUseCase = givenAnError()

    // When
    const errors: UpdateTenantErrors = await new Promise((resolve) => {
      const presentation = new UpdateTenantPresentationBuilder()
        .withNotifyUpdateTenantFieldError((err: UpdateTenantErrors) => {
          resolve(err)
        })
        .build()

      tenantToUpdate.labels = new Map().set('com.orange.repository.orangecarto/id', '')

      return updateTenantUseCase.execute(new UpdateTenantRequest(tenantToUpdate), presentation)
    })

    // Then
    expect(errors.has(UpdateTenantFields.appId)).toBeTruthy()
    expect(errors.get(UpdateTenantFields.appId)).toBe('tenantAppIdLengthError')
  })

  test('Update tenant without orange carto label defined must fail', async () => {
    // Given
    const updateTenantUseCase = givenAnError()

    // When
    const errors: UpdateTenantErrors = await new Promise((resolve) => {
      const presentation = new UpdateTenantPresentationBuilder()
        .withNotifyUpdateTenantFieldError((err: UpdateTenantErrors) => {
          resolve(err)
        })
        .build()

      tenantToUpdate.labels = new Map().set('other-label', 'yeah')

      return updateTenantUseCase.execute(new UpdateTenantRequest(tenantToUpdate), presentation)
    })

    // Then
    expect(errors.has(UpdateTenantFields.appId)).toBeTruthy()
    expect(errors.get(UpdateTenantFields.appId)).toBe('tenantAppIdLengthError')
  })

  test('Update tenant without description defined must fail', async () => {
    // Given
    const updateTenantUseCase = givenAnError()

    // When
    const errors: UpdateTenantErrors = await new Promise((resolve) => {
      const presentation = new UpdateTenantPresentationBuilder()
        .withNotifyUpdateTenantFieldError((err: UpdateTenantErrors) => {
          resolve(err)
        })
        .build()

      tenantToUpdate.description = ''

      return updateTenantUseCase.execute(new UpdateTenantRequest(tenantToUpdate), presentation)
    })

    // Then
    expect(errors.has(UpdateTenantFields.description)).toBeTruthy()
    expect(errors.get(UpdateTenantFields.description)).toBe('tenantDescriptionError')
  })

  test('Update tenant with description having size > 1000', async () => {
    // Given
    const updateTenantUseCase = givenAnError()

    // When
    const errors: UpdateTenantErrors = await new Promise((resolve) => {
      const presentation = new UpdateTenantPresentationBuilder()
        .withNotifyUpdateTenantFieldError((err: UpdateTenantErrors) => {
          resolve(err)
        })
        .build()

      tenantToUpdate.description = '!' + '#'.repeat(1000)
      return updateTenantUseCase.execute(new UpdateTenantRequest(tenantToUpdate), presentation)
    })

    // Then
    expect(errors.has(UpdateTenantFields.description)).toBeTruthy()
    expect(errors.get(UpdateTenantFields.description)).toBe('tenantDescriptionError')
  })
})
