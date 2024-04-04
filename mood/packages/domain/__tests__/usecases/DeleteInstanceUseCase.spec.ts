import {
  DeleteInstanceRequest,
  DeleteInstanceUseCase,
  DeleteInstanceErrors,
  DeleteInstanceFields,
  Instance
} from '@mood/domain'
import { DeleteInstancePresentationBuilder } from '__tests__/builders/DeleteInstancePresentationBuilder'
import { InstanceRepositoryBuilder } from '__tests__/builders/InstanceRepositoryBuilder'
import { describe, test, expect } from 'vitest'

describe('Feature: Delete new instance use case', () => {
  function givenAllIsOK(resolve: any): DeleteInstanceUseCase {
    const instanceRepository = new InstanceRepositoryBuilder()
      .withDeleteInstance((instance: Instance) => {
        resolve(instance)
        return Promise.resolve()
      })
      .build()

    const deleteInstanceUseCase = new DeleteInstanceUseCase(instanceRepository)
    return deleteInstanceUseCase
  }

  function givenAnError(): DeleteInstanceUseCase {
    const instanceRepository = new InstanceRepositoryBuilder().build()
    const deleteInstanceUseCase = new DeleteInstanceUseCase(instanceRepository)
    return deleteInstanceUseCase
  }

  test('Delete instance from repository when instance is valid', async () => {
    const errors = await new Promise((resolve) => {
      // Given
      const deleteInstanceUseCase = givenAllIsOK(resolve)

      // When
      const presenter = new DeleteInstancePresentationBuilder().build()
      const request = new DeleteInstanceRequest(
        crypto.randomUUID(),
        'instance0',
        'instance0',
        'prometheus',
        'tenant0',
        crypto.randomUUID()
      )
      deleteInstanceUseCase.execute(request, presenter)
    })

    // Then
    expect(errors).toBeDefined
  })

  test('Delete instance with different name must fail', async () => {
    // Given
    const deleteInstanceUseCase = givenAnError()

    // When
    const errors: DeleteInstanceErrors = await new Promise((resolve) => {
      const presentation = new DeleteInstancePresentationBuilder()
        .withNotifyDeleteInstanceFieldError((err: DeleteInstanceErrors) => {
          resolve(err)
        })
        .build()
      return deleteInstanceUseCase.execute(
        new DeleteInstanceRequest(
          crypto.randomUUID(),
          'instance0',
          'blablabla',
          'victoria',
          'tenant0',
          crypto.randomUUID()
        ),
        presentation
      )
    })
    expect(errors.has(DeleteInstanceFields.name)).toBeTruthy()
    expect(errors.get(DeleteInstanceFields.name)).toBe('instanceNameDoesNtMatch')
  })
})
