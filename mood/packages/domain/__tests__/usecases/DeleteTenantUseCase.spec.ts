import {
  DeleteTenantRequest,
  DeleteTenantUseCase,
  DeleteTenantErrors,
  DeleteTenantFields,
  Tenant
} from '@mood/domain'
import { DeleteTenantPresentationBuilder } from '__tests__/builders/DeleteTenantPresentationBuilder'
import { TenantRepositoryBuilder } from '__tests__/builders/TenantRepositoryBuilder'
import { describe, test, expect } from 'vitest'

describe('Feature: Delete new tenant use case', () => {
  function givenAllIsOK(resolve: any): DeleteTenantUseCase {
    const tenantRepository = new TenantRepositoryBuilder()
      .withDeleteTenant((tenant: Tenant) => {
        resolve(tenant)
        return Promise.resolve()
      })
      .build()

    const deleteTenantUseCase = new DeleteTenantUseCase(tenantRepository)
    return deleteTenantUseCase
  }

  function givenAnError(): DeleteTenantUseCase {
    const tenantRepository = new TenantRepositoryBuilder().build()
    const deleteTenantUseCase = new DeleteTenantUseCase(tenantRepository)
    return deleteTenantUseCase
  }

  test('Delete tenant from repository when tenant is valid', async () => {
    const errors = await new Promise((resolve) => {
      // Given
      const deleteTenantUseCase = givenAllIsOK(resolve)

      // When
      const presenter = new DeleteTenantPresentationBuilder().build()
      const request = new DeleteTenantRequest(crypto.randomUUID(),'my-super-tenant', 'my-super-tenant')
      deleteTenantUseCase.execute(request, presenter)
    })

    // Then
    expect(errors).toBeDefined
  })

  test('Delete tenant with name under 3 characters must fail', async () => {
    // Given
    const deleteTenantUseCase = givenAnError()

    // When
    const errors: DeleteTenantErrors = await new Promise((resolve) => {
      const presentation = new DeleteTenantPresentationBuilder()
        .withNotifyDeleteTenantFieldError((err: DeleteTenantErrors) => {
          resolve(err)
        })
        .build()
      return deleteTenantUseCase.execute(new DeleteTenantRequest(crypto.randomUUID(),'na', 'na'), presentation)
    })
    expect(errors.has(DeleteTenantFields.tenantToDelete)).toBeTruthy()
    expect(errors.get(DeleteTenantFields.tenantToDelete)).toBe('tenantNameLengthUnder3Error')
  })

  test('Delete tenant with name of more than 30 characters must fail', async () => {
    // Given
    const deleteTenantUseCase = givenAnError()

    // When
    const errors: DeleteTenantErrors = await new Promise((resolve) => {
      const presentation = new DeleteTenantPresentationBuilder()
        .withNotifyDeleteTenantFieldError((err: DeleteTenantErrors) => {
          resolve(err)
        })
        .build()
      return deleteTenantUseCase.execute(
        new DeleteTenantRequest(
          crypto.randomUUID(),
          'hexakosioihexekontahexaphobique',
          'hexakosioihexekontahexaphobique'
        ),
        presentation
      )
    })
    expect(errors.has(DeleteTenantFields.tenantToDelete)).toBeTruthy()
    expect(errors.get(DeleteTenantFields.tenantToDelete)).toBe('tenantNameLengthUpper30Error')
  })
  test('Delete tenant with blank name must fail', async () => {
    // Given
    const deleteTenantUseCase = givenAnError()

    // When
    const errors: DeleteTenantErrors = await new Promise((resolve) => {
      const presentation = new DeleteTenantPresentationBuilder()
        .withNotifyDeleteTenantFieldError((err: DeleteTenantErrors) => {
          resolve(err)
        })
        .build()
      return deleteTenantUseCase.execute(new DeleteTenantRequest(crypto.randomUUID(), '     ', '     '), presentation)
    })
    expect(errors.has(DeleteTenantFields.tenantToDelete)).toBeTruthy()
    expect(errors.get(DeleteTenantFields.tenantToDelete)).toBe('tenantNameLengthUnder3Error')
  })
  test('Delete tenant with different name must fail', async () => {
    // Given
    const deleteTenantUseCase = givenAnError()

    // When
    const errors: DeleteTenantErrors = await new Promise((resolve) => {
      const presentation = new DeleteTenantPresentationBuilder()
        .withNotifyDeleteTenantFieldError((err: DeleteTenantErrors) => {
          resolve(err)
        })
        .build()
      return deleteTenantUseCase.execute(
        new DeleteTenantRequest(crypto.randomUUID(), 'my-tenant', 'my-tenan'),
        presentation
      )
    })
    expect(errors.has(DeleteTenantFields.name)).toBeTruthy()
    expect(errors.get(DeleteTenantFields.name)).toBe('tenantNameDoesNtMatch')
  })
})
