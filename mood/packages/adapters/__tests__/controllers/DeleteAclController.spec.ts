import {
  DeleteAclPresentation,
  DeleteAclRequest,
  AclBuilder,
  DeleteAclFields,
  Acl,
  RoleTypes,
  AclOwnerTypes
} from '@mood/domain'
import {
  DeleteAclController,
  DeleteAclPresenter,
  FakeNavigation,
  NavigationRoute
} from '@mood/web-adapters'
import { DeleteAclUseCaseBuilder } from '../builders/DeleteAclCaseBuilder'
import { describe, test, expect } from 'vitest'

describe('DeleteAclController', () => {
  test('display acl error on validate Owner', () => {
    // Given
    const useCase = new DeleteAclUseCaseBuilder()
      .withValidate((_: DeleteAclRequest, presenter: DeleteAclPresentation) => {
        const errors = new Map<DeleteAclFields, string>()
        errors.set(DeleteAclFields.owner, 'Acl Owner required')
        presenter.notifyDeleteAclFieldError(errors)
        return errors
      })
      .build()

    const controller = new DeleteAclController(
      useCase,
      new DeleteAclPresenter(new FakeNavigation())
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
    const useCase = new DeleteAclUseCaseBuilder()
      .withValidate((_: DeleteAclRequest, presenter: DeleteAclPresentation) => {
        const errors = new Map<DeleteAclFields, string>()
        errors.set(DeleteAclFields.ownerType, 'OwnerType required')
        presenter.notifyDeleteAclFieldError(errors)
        return errors
      })
      .build()
    const controller = new DeleteAclController(
      useCase,
      new DeleteAclPresenter(new FakeNavigation())
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
    const useCase = new DeleteAclUseCaseBuilder()
      .withValidate((_: DeleteAclRequest, presenter: DeleteAclPresentation) => {
        const errors = new Map<DeleteAclFields, string>()
        errors.set(DeleteAclFields.role, 'Role required')
        presenter.notifyDeleteAclFieldError(errors)
        return errors
      })
      .build()
    const controller = new DeleteAclController(
      useCase,
      new DeleteAclPresenter(new FakeNavigation())
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
    const useCase = new DeleteAclUseCaseBuilder()
      .withValidate((_: DeleteAclRequest, presenter: DeleteAclPresentation) => {
        const errors = new Map<DeleteAclFields, string>()
        errors.set(DeleteAclFields.tenantName, 'TenantName required')
        presenter.notifyDeleteAclFieldError(errors)
        return errors
      })
      .build()
    const controller = new DeleteAclController(
      useCase,
      new DeleteAclPresenter(new FakeNavigation())
    )

    // When
    controller.validateAclTenantName('')

    // Then
    expect(controller.vm.aclTenantNameError).toBe('TenantName required')
    expect(controller.vm.aclTenantNameTouched).toBeTruthy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display acl error on delete', () => {
    // Given
    const useCase = new DeleteAclUseCaseBuilder()
      .withExecute((_: DeleteAclRequest, presenter: DeleteAclPresentation) => {
        const errors = new Map<DeleteAclFields, string>()
        errors.set(DeleteAclFields.owner, 'Acl name required')
        errors.set(DeleteAclFields.ownerType, 'OwnerType required')
        errors.set(DeleteAclFields.role, 'Role required')
        errors.set(DeleteAclFields.tenantName, 'TenantName required')
        presenter.notifyDeleteAclFieldError(errors)
        return Promise.resolve()
      })
      .build()
    const controller = new DeleteAclController(
      useCase,
      new DeleteAclPresenter(new FakeNavigation())
    )

    // When
    controller.delete()

    // Then
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display acl notification on delete', () => {
    // Given
    const useCase = new DeleteAclUseCaseBuilder()
      .withExecute((_: DeleteAclRequest, presenter: DeleteAclPresentation) => {
        const acl: Acl = new AclBuilder()
          .withId('00000000-0000-0000-0000-000000000000')
          .withOwner('ownerTest')
          .withOwnerType('user')
          .withRole('administrator')
          .withTenantName('tenant-test')
          .build()
        presenter.notifyAclDeleted(acl)
        return Promise.resolve()
      })
      .build()

    const controller = new DeleteAclController(
      useCase,
      new DeleteAclPresenter(new FakeNavigation())
    )

    // When
    controller.delete()

    // Then
    expect(controller.vm.displayAlert).toBeTruthy()
    expect(controller.vm.alert.title).toBe('success')
    expect(controller.vm.alert.details).toBe('theAclHasBeenDeleted')
  })

  test('display notification on repository error', () => {
    // Given
    const useCase = new DeleteAclUseCaseBuilder()
      .withExecute((_: DeleteAclRequest, presenter: DeleteAclPresentation) => {
        const acl: Acl = new AclBuilder().build()
        presenter.notifyDeleteAclError('API Error !')
        return Promise.resolve()
      })
      .build()

    const controller = new DeleteAclController(
      useCase,
      new DeleteAclPresenter(new FakeNavigation())
    )

    // When
    controller.delete()

    // Then
    expect(controller.vm.displayAlert).toBeTruthy()
    expect(controller.vm.alert.title).toBe('error')
    expect(controller.vm.alert.details).toBe('API Error !')
  })

  test('redirect to acl on delete success', async () => {
    // Given
    const acl = new AclBuilder()
      .withId('00000000-0000-0000-0000-000000000000')
      .withOwner('ownerTest')
      .withOwnerType('user')
      .withRole('administrator')
      .withTenantName('tenant-test')
      .build()
    const navigation = new FakeNavigation()

    await new Promise<void>((resolve) => {
      const useCase = new DeleteAclUseCaseBuilder()
        .withExecute((_: DeleteAclRequest, presenter: DeleteAclPresentation) => {
          presenter.notifyAclDeleted(acl)
          return Promise.resolve().then(() => resolve())
        })
        .build()
      const controller = new DeleteAclController(useCase, new DeleteAclPresenter(navigation))

      // When
      controller.delete()
    })

    // Then
    expect(navigation.currentRoute).toBe(NavigationRoute.ACLS)
  })
})
