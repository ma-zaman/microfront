import { describe, test, expect } from 'vitest'

import {
  AddInstanceRequest,
  AddInstanceUseCase,
  Instance,
  AddInstanceErrors,
  NewInstanceFields,
  InstanceVisibility,
  InstanceTypes
} from '@mood/domain'

import { InstanceRepositoryBuilder } from '__tests__/builders/InstanceRepositoryBuilder'
import { AddInstancePresentationBuilder } from '__tests__/builders/AddInstancePresentationBuilder'

describe('Feature: Add new instance use case', () => {
  function givenAllIsOK(resolve: any): AddInstanceUseCase {
    const instanceRepository = new InstanceRepositoryBuilder()
      .withAddInstance((instance: Instance) => {
        resolve(instance)
        return Promise.resolve()
      })
      .build()

    const addInstanceUseCase = new AddInstanceUseCase(instanceRepository)
    return addInstanceUseCase
  }

  function givenAnError(): AddInstanceUseCase {
    const instanceRepository = new InstanceRepositoryBuilder().build()
    const addInstanceUseCase = new AddInstanceUseCase(instanceRepository)
    return addInstanceUseCase
  }

  test('Add instance to repository when instance is valid', async () => {
    const instanceAdded = await new Promise<Instance>((resolve) => {
      // Given
      const addInstanceUseCase = givenAllIsOK(resolve)

      // When
      const presenter = new AddInstancePresentationBuilder().build()
      const request = new AddInstanceRequest(
        'victoria',
        'name',
        'private',
        'description',
        'my-tenant',
        '00000000-0000-0000-0000-000000000000'
      )
      addInstanceUseCase.execute(request, presenter)
    })
    // Then
    expect(instanceAdded).toBeDefined()
    expect(instanceAdded.instanceType).toBe('victoria')
    expect(instanceAdded.name).toBe('name')
    expect(instanceAdded.visibility).toBe('private')
    expect(instanceAdded.description).toBe('description')
    expect(instanceAdded.tenantName).toBe('my-tenant')
  })
  test('Add instance without instanceType must fail', async () => {
    // Given
    const addInstanceUseCase = givenAnError()

    // When
    const errors: AddInstanceErrors = await new Promise((resolve) => {
      const presentation = new AddInstancePresentationBuilder()
        .withNotifyNewInstanceFieldError((err: AddInstanceErrors) => {
          resolve(err)
        })
        .build()
      return addInstanceUseCase.execute(
        new AddInstanceRequest(
          '' as InstanceTypes,
          'name',
          'private',
          'description',
          'my-tenant',
          '00000000-0000-0000-0000-000000000000'
        ),
        presentation
      )
    })
    expect(errors.has(NewInstanceFields.instanceType)).toBeTruthy()
    expect(errors.get(NewInstanceFields.instanceType)).toBe('instanceTypeIsRequired')
  })
  test('Add instance without name', async () => {
    // Given
    const addInstanceUseCase = givenAnError()

    // When
    const errors: AddInstanceErrors = await new Promise((resolve) => {
      const presentation = new AddInstancePresentationBuilder()
        .withNotifyNewInstanceFieldError((err: AddInstanceErrors) => {
          resolve(err)
        })
        .build()
      return addInstanceUseCase.execute(
        new AddInstanceRequest(
          'victoria',
          '',
          'private',
          'description',
          'my-tenant',
          '00000000-0000-0000-0000-000000000000'
        ),
        presentation
      )
    })
    expect(errors.has(NewInstanceFields.name)).toBeTruthy()
    expect(errors.get(NewInstanceFields.name)).toBe('thisFieldMustContainBetween3And30Characters')
  })
  test('Add instance without visibility', async () => {
    // Given
    const addInstanceUseCase = givenAnError()

    // When
    const errors: AddInstanceErrors = await new Promise((resolve) => {
      const presentation = new AddInstancePresentationBuilder()
        .withNotifyNewInstanceFieldError((err: AddInstanceErrors) => {
          resolve(err)
        })
        .build()
      return addInstanceUseCase.execute(
        new AddInstanceRequest(
          'victoria',
          'name',
          '' as InstanceVisibility,
          'description',
          'my-tenant',
          '00000000-0000-0000-0000-000000000000'
        ),
        presentation
      )
    })
    expect(errors.has(NewInstanceFields.visibility)).toBeTruthy()
    expect(errors.get(NewInstanceFields.visibility)).toBe('visibilityIsRequired')
  })
  test('Add instance without description', async () => {
    const instanceAdded = await new Promise<Instance>((resolve) => {
      // Given
      const addInstanceUseCase = givenAllIsOK(resolve)

      // When
      const presenter = new AddInstancePresentationBuilder().build()
      const request = new AddInstanceRequest(
        'victoria',
        'name',
        'private',
        '',
        'my-tenant',
        '00000000-0000-0000-0000-000000000000'
      )
      addInstanceUseCase.execute(request, presenter)
    })
    // Then
    expect(instanceAdded).toBeDefined()
    expect(instanceAdded.instanceType).toBe('victoria')
    expect(instanceAdded.name).toBe('name')
    expect(instanceAdded.visibility).toBe('private')
    expect(instanceAdded.description).toBe('')
    expect(instanceAdded.tenantName).toBe('my-tenant')
  })
  test('Add instance without tenantName', async () => {
    // Given
    const addInstanceUseCase = givenAnError()

    // When
    const errors: AddInstanceErrors = await new Promise((resolve) => {
      const presentation = new AddInstancePresentationBuilder()
        .withNotifyNewInstanceFieldError((err: AddInstanceErrors) => {
          resolve(err)
        })
        .build()
      return addInstanceUseCase.execute(
        new AddInstanceRequest(
          'victoria',
          'name',
          'private',
          'description',
          '',
          '00000000-0000-0000-0000-000000000000'
        ),
        presentation
      )
    })
    expect(errors.has(NewInstanceFields.tenantName)).toBeTruthy()
    expect(errors.get(NewInstanceFields.tenantName)).toBe('tenantNameIsRequired')
  })
})
