import { describe, test, expect, beforeEach } from 'vitest'

import {
  UpdateInstanceRequest,
  UpdateInstanceUseCase,
  Instance,
  UpdateInstanceErrors,
  InstanceBuilder,
  UpdateInstanceFields,
  InstanceVisibility,
  InstanceTypes
} from '@mood/domain'

import { InstanceRepositoryBuilder } from '__tests__/builders/InstanceRepositoryBuilder'
import { UpdateInstancePresentationBuilder } from '__tests__/builders/UpdateInstancePresentationBuilder'
import { UUID } from 'crypto'

function givenAllIsOK(resolve: any): UpdateInstanceUseCase {
  const instanceRepository = new InstanceRepositoryBuilder()
    .withUpdateInstance((instance: Instance) => {
      resolve(instance)
      return Promise.resolve()
    })
    .build()

  const updateInstanceUseCase = new UpdateInstanceUseCase(instanceRepository)
  return updateInstanceUseCase
}

function givenAnError(): UpdateInstanceUseCase {
  const instanceRepository = new InstanceRepositoryBuilder().build()
  const updateInstanceUseCase = new UpdateInstanceUseCase(instanceRepository)
  return updateInstanceUseCase
}

describe('Feature: Update instance use case', () => {
  let instanceToUpdate: Instance

  beforeEach(() => {
    instanceToUpdate = new InstanceBuilder()
      .withId(crypto.randomUUID())
      .withInstanceType('prometheus')
      .withName('prom-00')
      .withVisibility('private')
      .withDescription('desc prom-00')
      .withTenantId('00000000-0000-0000-0000-000000000000')
      .withTenantName('tenant0')
      .build()
  })

  test('Update instance to repository when instance is valid', async () => {
    const instanceUpdated = await new Promise<Instance>((resolve) => {
      // Given
      const updateInstanceUseCase = givenAllIsOK(resolve)

      // When
      const presenter = new UpdateInstancePresentationBuilder().build()
      const request = new UpdateInstanceRequest(
        instanceToUpdate.id,
        instanceToUpdate.instanceType,
        instanceToUpdate.name,
        instanceToUpdate.visibility,
        instanceToUpdate.description,
        instanceToUpdate.tenantName,
        instanceToUpdate.tenantId
      )
      updateInstanceUseCase.execute(request, presenter)
    })
    // Then
    expect(instanceUpdated).toBeDefined()
    expect(instanceUpdated.instanceType).toBe('prometheus')
    expect(instanceUpdated.name).toBe('prom-00')
    expect(instanceUpdated.visibility).toBe('private')
    expect(instanceUpdated.description).toBe('desc prom-00')
    expect(instanceUpdated.tenantId).toBe('00000000-0000-0000-0000-000000000000')
    expect(instanceUpdated.tenantName).toBe('tenant0')
  })

  test('Update instance without required info', async () => {
    // Given
    const updateInstanceUseCase = givenAnError()

    // When
    const errors: UpdateInstanceErrors = await new Promise((resolve) => {
      const presentation = new UpdateInstancePresentationBuilder()
        .withNotifyUpdateInstanceFieldError((err: UpdateInstanceErrors) => {
          resolve(err)
        })
        .build()

      const request = new UpdateInstanceRequest(
        '' as UUID,
        '' as InstanceTypes,
        '',
        '' as InstanceVisibility,
        '',
        '',
        '' as UUID
      )

      return updateInstanceUseCase.execute(request, presentation)
    })

    expect(errors.has(UpdateInstanceFields.instanceType)).toBeTruthy()
    expect(errors.get(UpdateInstanceFields.instanceType)).toBe('instanceTypeIsRequired')

    expect(errors.has(UpdateInstanceFields.name)).toBeTruthy()
    expect(errors.get(UpdateInstanceFields.name)).toBe('nameIsRequired')

    expect(errors.has(UpdateInstanceFields.visibility)).toBeTruthy()
    expect(errors.get(UpdateInstanceFields.visibility)).toBe('visibilityIsRequired')

    expect(errors.has(UpdateInstanceFields.tenantName)).toBeTruthy()
    expect(errors.get(UpdateInstanceFields.tenantName)).toBe('tenantNameIsRequired')

    expect(errors.has(UpdateInstanceFields.tenantId)).toBeTruthy()
    expect(errors.get(UpdateInstanceFields.tenantId)).toBe('tenantIdIsRequired')
  })
})
