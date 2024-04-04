import {
  UpdateAclPresentation,
  UpdateAclRequest,
  AclBuilder,
  UpdateAclFields,
  Acl,
  AclOwnerTypes,
  RoleTypes
} from '@mood/domain'
import {
  UpdateAclController,
  UpdateAclPresenter,
  FakeNavigation,
  NavigationRoute
} from '@mood/web-adapters'
import { UpdateAclUseCaseBuilder } from '../builders/UpdateAclCaseBuilder'
import { describe, test, expect } from 'vitest'

describe('UpdateAclController', () => {
  test('display acl error on validate Owner', () => {
    // Given
    const useCase = new UpdateAclUseCaseBuilder()
      .withValidate((_: UpdateAclRequest, presenter: UpdateAclPresentation) => {
        const errors = new Map<UpdateAclFields, string>()
        errors.set(UpdateAclFields.owner, 'Acl Owner required')
        presenter.notifyUpdateAclFieldError(errors)
        return errors
      })
      .build()

    const controller = new UpdateAclController(
      useCase,
      new UpdateAclPresenter(new FakeNavigation())
    )

    // When
    controller.validateAclOwner('')

    // Then
    expect(controller.vm.aclOwnerError).toBe('Acl Owner required')
    expect(controller.vm.aclOwnerTouched).toBeTruthy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display acl error on validate OwnerType', () => {
    // Given
    const useCase = new UpdateAclUseCaseBuilder()
      .withValidate((_: UpdateAclRequest, presenter: UpdateAclPresentation) => {
        const errors = new Map<UpdateAclFields, string>()
        errors.set(UpdateAclFields.ownerType, 'OwnerType required')
        presenter.notifyUpdateAclFieldError(errors)
        return errors
      })
      .build()
    const controller = new UpdateAclController(
      useCase,
      new UpdateAclPresenter(new FakeNavigation())
    )

    // When
    controller.validateAclOwnerType('' as AclOwnerTypes)

    // Then
    expect(controller.vm.aclOwnerTypeError).toBe('OwnerType required')
    expect(controller.vm.aclOwnerTypeTouched).toBeTruthy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display acl error on validate Role', () => {
    // Given
    const useCase = new UpdateAclUseCaseBuilder()
      .withValidate((_: UpdateAclRequest, presenter: UpdateAclPresentation) => {
        const errors = new Map<UpdateAclFields, string>()
        errors.set(UpdateAclFields.role, 'Role required')
        presenter.notifyUpdateAclFieldError(errors)
        return errors
      })
      .build()
    const controller = new UpdateAclController(
      useCase,
      new UpdateAclPresenter(new FakeNavigation())
    )

    // When
    controller.validateAclRole('' as RoleTypes)

    // Then
    expect(controller.vm.aclRoleError).toBe('Role required')
    expect(controller.vm.aclRoleTouched).toBeTruthy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display acl error on validate TenantName', () => {
    // Given
    const useCase = new UpdateAclUseCaseBuilder()
      .withValidate((_: UpdateAclRequest, presenter: UpdateAclPresentation) => {
        const errors = new Map<UpdateAclFields, string>()
        errors.set(UpdateAclFields.tenantName, 'TenantName required')
        presenter.notifyUpdateAclFieldError(errors)
        return errors
      })
      .build()
    const controller = new UpdateAclController(
      useCase,
      new UpdateAclPresenter(new FakeNavigation())
    )

    // When
    controller.validateAclTenantName('')

    // Then
    expect(controller.vm.aclTenantNameError).toBe('TenantName required')
    expect(controller.vm.aclTenantNameTouched).toBeTruthy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display acl error on update', () => {
    // Given
    const useCase = new UpdateAclUseCaseBuilder()
      .withExecute((_: UpdateAclRequest, presenter: UpdateAclPresentation) => {
        const errors = new Map<UpdateAclFields, string>()
        errors.set(UpdateAclFields.owner, 'Acl name required')
        errors.set(UpdateAclFields.ownerType, 'OwnerType required')
        errors.set(UpdateAclFields.role, 'Role required')
        errors.set(UpdateAclFields.tenantName, 'TenantName required')
        presenter.notifyUpdateAclFieldError(errors)
        return Promise.resolve()
      })
      .build()
    const controller = new UpdateAclController(
      useCase,
      new UpdateAclPresenter(new FakeNavigation())
    )

    // When
    controller.update()

    // Then
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display acl notification on update', () => {
    // Given
    const useCase = new UpdateAclUseCaseBuilder()
      .withExecute((_: UpdateAclRequest, presenter: UpdateAclPresentation) => {
        const acl: Acl = new AclBuilder()
          .withId('00000000-0000-0000-0000-000000000000')
          .withOwner('ownerTest')
          .withOwnerType('user')
          .withRole('administrator')
          .withTenantName('tenant-test')
          .withTenantId('00000000-0000-0000-0000-000000000000')
          .build()
        presenter.notifyAclUpdated(acl)
        return Promise.resolve()
      })
      .build()

    const controller = new UpdateAclController(
      useCase,
      new UpdateAclPresenter(new FakeNavigation())
    )

    // When
    controller.update()

    // Then
    expect(controller.vm.displayAlert).toBeTruthy()
    expect(controller.vm.alert.title).toBe('success')
    expect(controller.vm.alert.details).toBe('yourAclHasBeenUpdated')
  })

  test('display notification on repository error', () => {
    // Given
    const useCase = new UpdateAclUseCaseBuilder()
      .withExecute((_: UpdateAclRequest, presenter: UpdateAclPresentation) => {
        const acl: Acl = new AclBuilder().build()
        presenter.notifyUpdateAclError('API Error !')
        return Promise.resolve()
      })
      .build()

    const controller = new UpdateAclController(
      useCase,
      new UpdateAclPresenter(new FakeNavigation())
    )

    // When
    controller.update()

    // Then
    expect(controller.vm.displayAlert).toBeTruthy()
    expect(controller.vm.alert.title).toBe('error')
    expect(controller.vm.alert.details).toBe('API Error !')
  })

  test('redirect to acl on update success', async () => {
    // Given
    const acl = new AclBuilder()
      .withOwner('ownerTest')
      .withOwnerType('user')
      .withRole('administrator')
      .withTenantName('tenant-test')
      .withTenantId('00000000-0000-0000-0000-000000000000')
      .build()
    const navigation = new FakeNavigation()

    await new Promise<void>((resolve) => {
      const useCase = new UpdateAclUseCaseBuilder()
        .withExecute((_: UpdateAclRequest, presenter: UpdateAclPresentation) => {
          presenter.notifyAclUpdated(acl)
          return Promise.resolve().then(() => resolve())
        })
        .build()
      const controller = new UpdateAclController(useCase, new UpdateAclPresenter(navigation))

      // When
      controller.update()
    })

    // Then
    expect(navigation.currentRoute).toBe(NavigationRoute.ACLS)
  })
})
